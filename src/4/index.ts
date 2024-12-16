import { readFullFileStringStrings } from "@/utils/input";
import { print } from "@/utils/output";

/** https://adventofcode.com/2024/day/4 */
const NEEDED_SEARCH = 'XMAS';
const NEEDED_SEARCH_2 = 'MAS';
async function main() {
    const data = await readFullFileStringStrings(__dirname, 'input');
    print (countAll(data));
    print (countAllMasInX(data));
}

function countAll(data: string[][]) {
    const directions = [
        [0, 1], // horizontal
        [0, -1], // horizontal reversed
        [1, 0], // vertical
        [-1, 0], // vertical reversed
        [1, 1], // diagonal South East
        [-1, -1], // diagonal North West
        [1, -1], // diagonal South West
        [-1, 1], // diagonal North East
    ];

    const rows = data.length;
    const columns = data[0].length;
    let totalCount = 0;
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < columns; ++j) {
            for (const [dx, dy] of directions) {
                if (checkDirection(data, i, j, dx, dy, NEEDED_SEARCH)) {
                    ++totalCount;
                }
            }
        }
    }
    return totalCount;    
}

function checkDirection(data: string[][], x: number, y: number, dx: number, dy: number, searchStr: string) {
    for (let i = 0; i < searchStr.length; ++i) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (!isValid(data, nx, ny) || data[nx][ny] !== searchStr[i]) {
            return false;
        }
    }
    return true;
}


function countAllMasInX(data: string[][]) {
    const directionSE = [1, 1];
    const directionNW = [-1, -1];
    const directionSW = [1, -1];
    const directionNE = [-1, 1];    

    const rows = data.length;
    const columns = data[0].length;
    let totalCount = 0;
    const searchStr = NEEDED_SEARCH_2;
    const searchWordLen = searchStr.length;
    const checkDirection2 = (data: string[][], x: number, y: number, dx: number, dy: number) => checkDirection(data, x, y, dx, dy, searchStr);

    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < columns; ++j) {
            let count = 0;
            count += Number(checkDirection2(data, i, j, directionSE[0], directionSE[1]));
            count += Number(checkDirection2(data, i+searchWordLen-1, j+searchWordLen-1, directionNW[0], directionNW[1]));
            count += Number(checkDirection2(data, i, j+searchWordLen-1, directionSW[0], directionSW[1]));
            count += Number(checkDirection2(data, i+searchWordLen-1, j, directionNE[0], directionNE[1]));
            if (count >= 2) {
                ++totalCount;
            }            
        }
    }
    return totalCount;    
}

function isValid(data: string[][], x: number, y: number) {
    const rows = data.length;
    const columns = data[0].length;
    return !(
        x < 0 || 
        y < 0 ||
        x >= rows ||
         y >= columns
    );    
}


main();