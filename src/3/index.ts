import { readFullFileStrings } from "@/utils/input";
import { print } from "@/utils/output";
import { validateHeaderValue } from "http";

/** https://adventofcode.com/2024/day/3 */
async function main() {
    const data = await readFullFileStrings(__dirname);
    const text = data.join('');
    const mulPairs: [number, number][] = parseMuls(text); 
    const sum = mulPairsSum(mulPairs);    
    print('Mul Pairs Sum: ', sum);

    const mulPairsWithDo: [number, number][] = parseMulsWithDo(text);
    const sumWithDo = mulPairsSum(mulPairsWithDo);    
    print('Mul Pairs Sum with Do instructions:', sumWithDo);
}

function parseMuls(text: string): [number, number][]  {            
    const results = text.matchAll(/mul\((\d+),(\d+)\)/g);    
    return [...results].map(result => ([Number(result[1]), Number(result[2])]));
}

function parseMulsWithDo(text: string): [number, number][]  {            
    const doString = 'do()';
    const dontString = "don't()";
    const parts = text.split(dontString);
    const results: [number, number][] = [];
    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        const doPartIndex = part.indexOf(doString);
        if (i && doPartIndex === -1) {
            continue;
        }
        const doPart = part.slice(doPartIndex+doString.length);
        const mulParts = doPart.matchAll(/mul\((\d+),(\d+)\)/g);
        const mulPairs: [number, number][] = [...mulParts].map(result => ([Number(result[1]), Number(result[2])]));
        results.push(
            ...mulPairs
        );
    }
    return results;
}

function mulPairsSum(mulPairs: [number, number][]) {
    return mulPairs.reduce((acc, [num1, num2]) => acc += (num1 * num2), 0)
}

main();