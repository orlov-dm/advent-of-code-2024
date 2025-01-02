import { readFullFileStrings } from "@/utils/input";
import { print } from "@/utils/output";

enum Operations {
    ADD = 0,
    MULTIPLY = 1,
    CONCAT = 2,
};

/** https://adventofcode.com/2024/day/7 */
async function main() {
    const data = await parseFile();


    print('Part 1: ', solve(data, [Operations.ADD, Operations.MULTIPLY]));
    print('Part 2: ', solve(data, [Operations.ADD, Operations.MULTIPLY, Operations.CONCAT]));
}

function solve(equations: string[], operations: Operations[]) {
    let result = 0;
    for (const equation of equations) {
        const [totalString, rest] = equation.split(': ');
        const total = Number(totalString);
        const numbers = rest.split(' ').map(Number);
        if (canReachTarget(total, numbers, operations)) {
            result += total;
        }
    }
    return result;
}

function canReachTarget(target: number, numbers: number[], operations: Operations[]): boolean {
    const length = numbers.length;
    function dfs(index: number, result: number) {
        if (length === index) return result === target;

        const number = numbers[index];
        for (const operation of operations) {
            const newResult = applyOperation(result, number, operation);
            if (newResult > target) {
                continue;
            }
            if (dfs(index + 1, newResult)) {
                return true;
            }
        }
        return false;
    }

    return dfs(1, numbers[0]);
}

function applyOperation(a: number, b: number, operation: Operations) {
    switch(operation) {
        case Operations.ADD:
            return a + b;
        case Operations.MULTIPLY:
            return a * b;
        case Operations.CONCAT:
            return Number(a.toString() + b.toString());
        default: throw new Error(`Unsupported operation: ${operation}`);
    }
}

async function parseFile() {
    const data = await readFullFileStrings(__dirname, 'input');
    return data;
}

main();