import { readFullFileStrings } from "@/utils/input";
import { print } from "@/utils/output";

/** https://adventofcode.com/2024/day/5 */
async function main() {
    const [rules, updates] = await parseFile();

    const numberUpdates = updates.map(update => update.split(',').map(Number));
    const correctUpdates: number[][] = [];
    const incorrectUpdates: number[][] = []
    for (const numberUpdate of numberUpdates) {
        if (checkIfUpdateIsCorrect(numberUpdate, rules)) {    
            correctUpdates.push(numberUpdate);
        } else {
            incorrectUpdates.push(numberUpdate);
        }
    }
    print(sumMiddleValues(correctUpdates));

    const correctedUpdates = incorrectUpdates.map((update) => fixIncorrectUpdate(update, rules));
    print(sumMiddleValues(correctedUpdates));    
}

async function parseFile(): Promise<[[number,number][], string[]]> {
    const data = await readFullFileStrings(__dirname, 'input');
    const rules: string[] = [];
    const updates: string[] = [];
    let foundMiddle = false;
    for (const row of data) {
        if (!row) {
            foundMiddle = true;
            continue;
        }
        if (!foundMiddle) {
            rules.push(row);
        } else {
            updates.push(row);
        }
    }
    const rulesParsed: [number, number][] = rules.map(line => {
        const [a, b] = line.split("|").map(Number);
        return [a, b];
    });
    return [rulesParsed, updates];
}

function checkIfUpdateIsCorrect(update: number[], rules: [number, number][]) {
    const updateMap = new Map<number,number>(update.map((value, index) => [value, index]));
    for (const [left, right] of rules) {
        const leftIndex = updateMap.get(left);
        const rightIndex = updateMap.get(right);
        if (leftIndex !== undefined && rightIndex !== undefined && leftIndex >= rightIndex) {
            return false;
        }        
    }
    return true;
}


function fixIncorrectUpdate(update: number[], rules: [number, number][]): number[] {
    const dependencyGraph = new Map<number, number[]>();
    const inDegree = new Map<number, number>();

    // Initialize the graph and in-degree map
    update.forEach(page => {
        dependencyGraph.set(page, []);
        inDegree.set(page, 0);
    });

    // Build the graph
    for (const [before, after] of rules) {
        if (dependencyGraph.has(before) && dependencyGraph.has(after)) {
            dependencyGraph.get(before)!.push(after);
            inDegree.set(after, (inDegree.get(after) || 0) + 1);
        }
    }

    // Topological sort using Kahn's algorithm
    const queue: number[] = [];
    for (const [page, degree] of inDegree.entries()) {
        if (degree === 0) queue.push(page);
    }

    const sorted: number[] = [];
    while (queue.length > 0) {
        const current = queue.shift()!;
        sorted.push(current);

        for (const neighbor of dependencyGraph.get(current)!) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    // Return the sorted list 
    return sorted;
}

function sumMiddleValues(updates: number[][]): number {
    return updates.reduce((sum, update) => {
        const middleIndex = Math.floor(update.length/2);
        return sum+=update[middleIndex];
    }, 0)
}

main();