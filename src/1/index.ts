import { readFullFileStrings } from "@/utils/input";
import { print } from "@/utils/output";
import { validateHeaderValue } from "http";

/** https://adventofcode.com/2024/day/1 */
async function main() {
    const data = await readFullFileStrings(__dirname);
    const [array1, array2] = getNumberArrays(data);
    const distances = countDistances(array1, array2);
    const distancesSum = distances.reduce((acc, value) => acc+Math.abs(value), 0);
    print('SUM of distances', distancesSum);

    const array2Counts = getArrayCounts(array2);
    print(array2Counts);
    const similarity = calculateSimilarity(array1, array2Counts);
    print('Similarity', similarity);
}

function getNumberArrays(data: string[]): [number[], number[]] {
    const array1 = new Array(data.length);
    const array2 = new Array(data.length);

    for (let i = 0; i < data.length; ++i) {
        const row = data[i];
        const [num1, num2] = row.split(/\s+/).map(Number); 
        array1[i] = num1;
        array2[i] = num2;
    }
    array1.sort((a,b)=>(a-b));
    array2.sort((a,b)=>(a-b));
    return [array1, array2];
}

function countDistances(array1: number[], array2: number[]): number[] {  
    return array1.map((value, i) => value - array2[i]);
}

function getArrayCounts(array: number[]) {
    const countsMap = new Map<number, number>();
    for (const num of array) {
        countsMap.set(num, (countsMap.get(num) || 0)+1);
    }
    return countsMap;
}

function calculateSimilarity(array1: number[], array2Counts: Map<number,number>): number {
    return array1.reduce((acc, value) => 
        acc += value * (array2Counts.get(value) || 0), 0
    )
}
main();