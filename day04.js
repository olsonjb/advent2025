const TEST_INPUT = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

async function main() {
  const path = `inputs/day04.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  const rows = input.split("\n");

  solvePart1(rows);
  solvePart2(rows);
}

main();

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function solvePart1(rows) {
  let accessible = 0;
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    place: for (let colIdx = 0; colIdx < rows[rowIdx].length; colIdx++) {
      let surroundingCount = 0;
      if (rows[rowIdx][colIdx] !== "@") continue;

      for (const [dx, dy] of directions) {
        const checkRow = rowIdx + dy;
        const checkCol = colIdx + dx;
        if (checkRow >= 0 && checkRow < rows.length && checkCol >= 0 && checkCol < rows[checkRow].length) {
          if (rows[checkRow][checkCol] === "@") {
            surroundingCount++;
            if (surroundingCount >= 4) {
              continue place;
            }
          }
        }
      }

      if (surroundingCount < 4) {
        accessible++;
      }
    }
  }

  console.log("Part 1 (Accessible Rolls):", accessible);
}

function solvePart2(rows) {
  rows = rows.map(row => row.split(""));
  let didRemove = true;
  let numRemoved = 0;

  while (didRemove) {
    didRemove = false;
    const toRemove = [];

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      place: for (let colIdx = 0; colIdx < rows[rowIdx].length; colIdx++) {
        let surroundingCount = 0;
        if (rows[rowIdx][colIdx] !== "@") continue;

        for (const [dx, dy] of directions) {
          const checkRow = rowIdx + dy;
          const checkCol = colIdx + dx;
          if (checkRow >= 0 && checkRow < rows.length && checkCol >= 0 && checkCol < rows[checkRow].length) {
            if (rows[checkRow][checkCol] === "@") {
              surroundingCount++;
              if (surroundingCount >= 4) {
                continue place;
              }
            }
          }
        }

        if (surroundingCount < 4) {
          toRemove.push([rowIdx, colIdx]);
        }
      }
    }

    for (const [rowIdx, colIdx] of toRemove) {
      rows[rowIdx][colIdx] = ".";
      numRemoved++;
      didRemove = true;
    }
  }

  console.log("Part 2 (Rolls Removed):", numRemoved);
}
