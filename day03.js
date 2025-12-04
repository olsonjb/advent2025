const TEST_INPUT = `987654321111111
811111111111119
234234234234278
818181911112111`;

async function main() {
  const path = `inputs/day03.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  const powerBanks = input.split("\n");

  solvePart1(powerBanks);
  solvePart2(powerBanks);
}

main();

function solvePart1(powerBanks) {
  let sum = 0;
  for (const powerBank of powerBanks) {
    sum += Number(getHighest2(powerBank));
  }

  console.log("Part 1 (2 Digits):", sum);
}

function getHighest2(powerBank) {
  let first = 0;
  let second = 0;
  for (let i = 0; i < powerBank.length - 1; i++) {
    const digit = Number(powerBank[i]);
    if (digit > first) {
      first = digit;
      second = powerBank[i + 1];
    }
    for (let j = i + 1; j < powerBank.length; j++) {
      let secondDigit = Number(powerBank[j]);
      if (secondDigit > second) {
        second = secondDigit;
      }
    }
  }
  return String(first) + String(second);
}

function solvePart2(powerBanks) {
  let sum = 0;
  for (const powerBank of powerBanks) {
    const highest12 = getHighest12(powerBank);
    // console.log("Highest 12 digits:", highest12);
    sum += Number(highest12);
  }

  console.log("Part 2 (12 Digits):", sum);
}

function getHighest12(powerBank) {
  let kept = "";
  // console.log("Power Bank:", powerBank);
  for (let i = 0; i < powerBank.length; i++) {
    const numLeftToCheck = powerBank.length - i;
    if (!kept.length) {
      kept += powerBank[i];
      continue;
    }

    let earliestCheckableIdx = 0;
    let didOverwrite = false;
    if (numLeftToCheck < 12) {
      earliestCheckableIdx = 12 - numLeftToCheck;
    }
    for (let j = 0; j < kept.length; j++) {
      // console.log("earliestCheckableIdx:", earliestCheckableIdx, `comparing ${kept[j]} and ${powerBank[i]}`);
      if (j >= earliestCheckableIdx && kept[j] < powerBank[i]) {
        // console.log(kept[j], " < ", powerBank[i]);
        // console.log("adding", kept.slice(0, j), "and", powerBank[i]);
        kept = kept.slice(0, j) + powerBank[i];
        didOverwrite = true;
        break;
      }
    }

    if (kept.length < 12 && !didOverwrite) {
      kept += powerBank[i];
    }
    // console.log("Kept:", kept);
  }

  return kept;
}

