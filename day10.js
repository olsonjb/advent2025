
const TEST_INPUT = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

async function main() {
  const path = `inputs/day10.txt`;

  const file = Bun.file(path);
  const input = await file.text();
  const rows = input.split("\n");

  solvePart1(rows);
}

main();

function solvePart1(rows) {
  // Key insights: order doesn't matter, pressing a button more than once is pointless
  let totalPresses = 0;
  for (const machine of rows) {
    const lights = machine.slice(1, machine.indexOf("]"));
    const buttons = machine.slice(machine.indexOf("("), machine.indexOf("{")).trim().split(" ").map(b => b.slice(1, -1).split(",").map(n => parseInt(n)));
    const presses = machine.slice(machine.indexOf("{") + 1, machine.indexOf("}")).trim().split(",").map(n => parseInt(n));

    const buttonCombinations = combinations(buttons);
    // console.log("Button combinations:", buttonCombinations);

    // Determine if combination is valid
    let shortest = Infinity;
    nextCombo: for (const combo of buttonCombinations) {
      // console.log("Checking combination:", combo);
      const lightState = Array.from(lights).fill(false);
      for (const button of combo) {
        for (const light of button) {
          lightState[light] = !lightState[light];
        }
      }

      // console.log("Light state:", lightState);

      for (let i = 0; i < lights.length; i++) {
        if ((lights[i] === '.' && lightState[i]) || lights[i] === '#' && !lightState[i]) {
          continue nextCombo;
        }
      }

      // If we get here, the combination is valid
      // console.log("VALID");
      shortest = Math.min(shortest, combo.length);
    }
    totalPresses += shortest;
  }

  console.log("Part 1 (Min presses, no joltage):", totalPresses);
}

function combinations(arr) {
  let res = [[]];

  for (const item of arr) {
    const newSets = res.map(s => [...s, item]);
    res = [...res, ...newSets];
  }

  return res.slice(1); // drop empty subset
}
