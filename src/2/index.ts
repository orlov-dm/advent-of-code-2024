import { readFullFileStrings } from "@/utils/input";
import { print } from "@/utils/output";
import { validateHeaderValue } from "http";

/** https://adventofcode.com/2024/day/2 */
async function main() {
    const reportsData = await readFullFileStrings(__dirname);
    const reports: number[][] = reportsData.map(reportData => reportData.split(' ').map(Number));    
    const countSafeReports = reports.map(isReportSafe).reduce((acc, isSafe) => isSafe ? acc + 1 : acc, 0);
    print(countSafeReports);

    const countSafeReportsTolerant = reports.map(isReportSafeTolerant).reduce((acc, isSafe) => isSafe ? acc + 1 : acc, 0);
    print(countSafeReportsTolerant);
}

function isReportSafe(report: number[]) {
    let isDecreasing = null;
    for (let i = 0; i < report.length - 1; ++i) {
        const num1 = report[i];
        const num2 = report[i+1];
        if (isDecreasing === null) {
            isDecreasing = num1 > num2;
        }

        if (num1 === num2) {
            return false;
        }

        if (isDecreasing && num1 < num2) {
            return false;
        } 

        if (!isDecreasing && num1 > num2) {
            return false;
        }

        if (Math.abs(num1 - num2) > 3) {
            return false;
        }
    }
    return true;
}

function isReportSafeTolerant(report: number[]) {
    if (!isReportSafe(report)) {
        for (let i = 0; i < report.length; ++i) {
            if (isReportSafe([...report.slice(0,i), ...report.slice(i+1)])) {
                return true;
            }
        }
        return false;
    }
    return true;
}

main();