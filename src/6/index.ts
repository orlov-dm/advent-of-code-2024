import { readFullFileStringStrings } from "@/utils/input";
import { print } from "@/utils/output";

enum Direction {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
}

const DIRECTION_COUNT = 4;

type Position = [number, number];

/** https://adventofcode.com/2024/day/6 */
async function main() {
    const data = await parseFile();

    let guardPosition: Position | null = null;
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data.length; ++j) {
            const value = data[i][j];
            if (value === '^') {
                guardPosition = [i, j];
                break;
            }
        }
        if (guardPosition) {
            break;
        }
    }

    if (!guardPosition) {
        throw new Error("Can't find position of guard");
    }
    
    print('Part 1: ', countSteps(data, guardPosition));
    print('Part 2: ', countLoops(data, guardPosition));
}

function countSteps(data: string[][], guardPosition: Position) {
    let direction = Direction.UP;
    let steppedPositions = new Set<string>();
    let [i, j] = guardPosition;
    steppedPositions.add(`${i}_${j}`);

    const rowsCount = data.length;
    const columnsCount = rowsCount ? data[0].length : 0;

    while (i >= 0 && i < rowsCount &&
        j >= 0 && j < columnsCount
    ) {
        const nextPosition = getNextPosition(direction, [i, j]);
        const [nextI, nextJ] = nextPosition;
        if (isOutOfRange(data, nextI, nextJ)) {            
            print('Found exit');
            break;
        }

        if (data[nextI][nextJ] === '#') {
            direction = getNextDirection(direction);
            continue;
        }
        [i, j] = nextPosition;
        steppedPositions.add(`${i}_${j}`);
    }
    return steppedPositions.size;
}

function countLoops(data: string[][], guardPosition: Position) {
    let direction = Direction.UP;
    let [i, j] = guardPosition;

    const rowsCount = data.length;
    const columnsCount = rowsCount ? data[0].length : 0;

    const loopSet = new Set<string>();
    while (i >= 0 && i < rowsCount &&
        j >= 0 && j < columnsCount
    ) {
        const nextPosition = getNextPosition(direction, [i, j]);
        const [nextI, nextJ] = nextPosition;
        if (isOutOfRange(data, nextI, nextJ)) {        
            print('Found exit');
            break;
        }

        if (data[nextI][nextJ] === '#') {
            direction = getNextDirection(direction);
            continue;
        }

        if (data[nextI][nextJ] === '.') {
            data[nextI][nextJ] = '#';
            if (checkIfLoop(data, guardPosition, Direction.UP)) {
                loopSet.add(`${nextI}_${nextJ}`);      
            }
            data[nextI][nextJ] = '.';
        }

        [i, j] = nextPosition;
    }
    return loopSet.size;
}

function checkIfLoop(data: string[][], position: Position, initialDirection: Direction): boolean {
    let [i, j] = position;

    let direction = initialDirection;
    const stepsSet: Set<string> = new Set();
    while (true) {        
        const stepKey = `${i}_${j}_${direction}`;
        if (stepsSet.has(stepKey)) {
            return true;
        }
        stepsSet.add(stepKey);

        const nextPosition = getNextPosition(direction, [i, j]);
        const [nextI, nextJ] = nextPosition;
        if (isOutOfRange(data, nextI, nextJ)) {
            break;
        }
        if (data[nextI][nextJ] === '#') {
            direction = getNextDirection(direction);
            continue;
        }
        [i, j] = nextPosition;
    }

    return false;
}

function isOutOfRange(data: string[][], x: number, y: number) {
    const rowsCount = data.length;
    const columnsCount = rowsCount ? data[0].length : 0;
    return x < 0 || x >= rowsCount ||
        y < 0 || y >= columnsCount;
}

function getNextPosition(direction: Direction, position: Position) {
    let nextPosition: Position | null = null;

    const [x,y] = position;
    switch (direction) {
        case Direction.UP:                
            nextPosition = [x-1, y];
            break;
        case Direction.RIGHT:
            nextPosition = [x, y+1];
            break;
        case Direction.DOWN:
            nextPosition = [x+1, y];
            break;
        case Direction.LEFT:
            nextPosition = [x, y-1];
            break;
    }
    if (!nextPosition) {
        throw new Error("Can't set next position");
    }
    return nextPosition;
}

function getNextDirection(direction: Direction): Direction {
    return (direction+1) % DIRECTION_COUNT;
}
 
async function parseFile() {
    const data = await readFullFileStringStrings(__dirname, 'input');
    return data;
}

function printData(data: string[][]) {
    print('Data');
    for (let i = 0; i < data.length; ++i) {
        let row = '';
        for (let j = 0; j < data[0].length; ++j) {
            row += data[i][j] + ' ';
        }
        print(row, '\n');
    }
}

main();