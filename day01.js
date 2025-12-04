
const TEST_INPUT = [
  "L68",
  "L30",
  "R48",
  "L5",
  "R60",
  "L55",
  "L1",
  "L99",
  "R14",
  "L82"
];

async function main() {
  const path = `inputs/day01.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  const instructions = input.split("\n");

  solvePart1(instructions);
  solvePart2(instructions);
}

main();

function solvePart1(instructions) {
  const numPositions = 100;
  let zeroCount = 0;
  let position = 50;
  for (const instruction of instructions) {
    // console.log("Instruction:", instruction);
    const direction = instruction.slice(0, 1);
    const distance = Number(instruction.slice(1));

    const modifier = direction === "R" ? 1 : -1;
    const movement = modifier * distance;

    position += movement;

    if (position < 0) {
      position = numPositions + position;
    }
    position %= numPositions;

    if (position === 0) {
      zeroCount++;
    }
  }

  console.log("Part 1 (Zero Count):", zeroCount);
}

function solvePart2(instructions) {
  const numPositions = 100;
  let zeroCount = 0;
  let position = 50;
  let passedZero = 0;
  for (const instruction of instructions) {
    // console.log("Instruction:", instruction);
    const direction = instruction.slice(0, 1);
    const distance = Number(instruction.slice(1));

    const fullMoves = Math.floor(distance / numPositions);
    const remainingDistance = distance % numPositions;
    passedZero += fullMoves;

    if (direction === "R") {
      if (remainingDistance + position > numPositions) {
        passedZero++;
      }
      position = (position + remainingDistance) % numPositions;
    } else if (direction === "L") {
      if (remainingDistance > position) {
        if (position > 0) {
          passedZero++;
        }
        position += numPositions;
      }
      position -= remainingDistance;
    }

    if (position === 0) {
      zeroCount++;
    }
    // console.log("Position:", position);
    // console.log("Passed Zero:", passedZero);
    // console.log("Zero Count:", zeroCount);
  }

  console.log("Part 2 (Zero Count):", zeroCount);
  console.log("Part 2 (Passed Zero):", passedZero);
  console.log("Part 2 (Total):", zeroCount + passedZero);
}
