const TEST_INPUT = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +`;

async function main() {
  const path = `inputs/day06.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  solvePart1(input);
  solvePart2(input);
}

main();

function solvePart1(input) {
  const rows = input.split("\n").map(line => line.trim().split(/\s+/));
  const cols = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));

  let sum = 0;
  for (const problem of cols) {
    const operator = problem.at(-1);
    const operands = problem.slice(0, -1).map(n => parseInt(n));

    let result = 0;
    if (operator === "*") {
      result = operands.reduce((acc, cur) => acc * cur);
    } else if (operator === "+") {
      result = operands.reduce((acc, cur) => acc + cur);
    }

    sum += result;
  }

  console.log("Part 1 (Horizontal numbers):", sum);
}

function solvePart2(input) {
  const rows = input.split("\n").map(r => r.split(""));
  const operators = rows.pop().filter(o => o.trim().length);
  const cols = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));

  // console.log(cols)
  // console.log(operators);

  let sum = 0;
  let operatorIdx = 0;
  let currentOperands = [];
  for (const col of cols) {
    if (col.every(c => c === " ")) {
      // End of current problem
      sum += solveProblem(currentOperands, operators[operatorIdx]);
      currentOperands = [];
      operatorIdx++;
    } else {
      // Add operand
      currentOperands.push(parseInt(col.join("")));
    }
  }
  // Last problem
  sum += solveProblem(currentOperands, operators[operatorIdx]);

  console.log("Part 2 (Vertical numbers):", sum);
}

function solveProblem(operands, operator) {
  // console.log(`Problem ${operatorIdx + 1}:`, currentOperands.join(operators[operatorIdx]));
  if (operator === "*") {
    return operands.reduce((acc, cur) => acc * cur);
  } else if (operator === "+") {
    return operands.reduce((acc, cur) => acc + cur);
  }
}
