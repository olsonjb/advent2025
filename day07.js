
const TEST_INPUT = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

async function main() {
  const path = `inputs/day07.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  solvePart1(input);
  solvePart2(input);
}

main();

function solvePart1(input) {
  const rows = input.split("\n").map(r => r.split(""));

  let splitCount = 0;
  for (let i = 1; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === "." && "|S".includes(rows[i - 1][j])) {
        rows[i][j] = "|";
      } else if (rows[i][j] === "^" && "|S".includes(rows[i - 1][j])) {
        rows[i][j - 1] = "|";
        rows[i][j + 1] = "|";
        splitCount++;
      }
    }
  }

  console.log("Part 1 (Splits):", splitCount);
}

function solvePart2(input) {
  input = input.replace("S", "1");
  const rows = input.split("\n").map(r => r.split(""));

  for (let i = 1; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const above = rows[i - 1][j];

      if (rows[i][j] === "." && !"^.".includes(above)) {
        rows[i][j] = above;
      } else if (rows[i][j] === "^" && !"^.".includes(above)) {
        // Left
        const prevLeft = isNaN(rows[i][j - 1]) ? 0 : parseInt(rows[i][j - 1]);
        rows[i][j - 1] = prevLeft + parseInt(above);

        // Right
        const aboveRight = isNaN(rows[i - 1][j + 1]) ? 0 : parseInt(rows[i - 1][j + 1]);
        rows[i][j + 1] = aboveRight + parseInt(above);
      }
    }
  }

  // Add last row counts
  const timelineCount = rows.at(-1).reduce((acc, cur) => acc + (isNaN(cur) ? 0 : parseInt(cur)), 0);

  console.log("Part 2 (Timelines):", timelineCount);
}

// Recursive 1st attempt - too slow
function countTimelines(rowIdx, rows) {
  for (let i = rowIdx; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === "." && "|S".includes(rows[i - 1][j])) {
        rows[i][j] = "|";
      } else if (rows[i][j] === "^" && "|S".includes(rows[i - 1][j])) {
        const leftRows = [...rows.map(r => [...r])];
        const rightRows = [...rows.map(r => [...r])];
        leftRows[i][j - 1] = "|";
        rightRows[i][j + 1] = "|";

        const leftTimelineCount = countTimelines(i + 1, leftRows);
        const rightTimelineCount = countTimelines(i + 1, rightRows);

        return leftTimelineCount + rightTimelineCount;
      }
    }
  }

  // console.log("TIMELINE")
  // console.log(rows);

  return 1;
}
