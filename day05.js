
const TEST_INPUT = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

async function main() {
  const path = `inputs/day05.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  const rows = input.split("\n");
  const ranges = rows.filter(r => r.includes("-"));
  const nums = rows.filter(r => !r.includes("-") && r.length);

  solvePart1(ranges, nums);
  solvePart2(ranges);
}

main();

function solvePart1(ranges, nums) {
  let count = 0;
  for (const num of nums) {
    for (const range of ranges) {
      const [start, end] = range.split("-").map(n => parseInt(n));
      if (num >= start && num <= end) {
        count++;
        break;
      }
    }
  }

  console.log("Part 1 (Fresh):", count);
}


function solvePart2(ranges) {
  let existingRanges = [];
  for (const range of ranges) {
    // console.log("Checking range:", range);
    const [start, end] = range.split("-").map(n => parseInt(n));

    const overlappingRangeIdxs = [];
    for (let i = 0; i < existingRanges.length; i++) {
      const existingRange = existingRanges[i];
      const [existingStart, existingEnd] = existingRange.split("-").map(n => parseInt(n));
      // New range within existing range
      if (existingStart <= start && existingEnd >= end) {
        overlappingRangeIdxs.push(i);
      }
      // Existing range within new range
      if (start <= existingStart && end >= existingEnd) {
        overlappingRangeIdxs.push(i);
      }
      // New range starts before and ends within existing range
      if (start < existingStart && end >= existingStart && end <= existingEnd) {
        overlappingRangeIdxs.push(i);
      }
      // New range starts within existing range and ends after
      if (start >= existingStart && start <= existingEnd && end > existingEnd) {
        overlappingRangeIdxs.push(i);
      }
    }

    if (overlappingRangeIdxs.length) {
      const splitRanges = overlappingRangeIdxs.flatMap(idx => existingRanges[idx].split("-").map(n => parseInt(n)));
      splitRanges.push(...range.split("-").map(n => parseInt(n)));
      const newStart = Math.min(...splitRanges);
      const newEnd = Math.max(...splitRanges);
      existingRanges = existingRanges.filter((_, idx) => !overlappingRangeIdxs.includes(idx));
      existingRanges.push(`${newStart}-${newEnd}`);
    }
    else {
      existingRanges.push(range);
    }
  }

  let count = 0;
  for (const range of existingRanges) {
    const [start, end] = range.split("-").map(n => parseInt(n));
    count += end - start + 1;
  }

  // console.log(existingRanges);
  console.log("Part 2 (Fresh Ids):", count);
}
