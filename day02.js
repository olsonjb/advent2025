const TEST_INPUT = '11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124'

async function main() {
  const path = `inputs/day02.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  const ranges = input.split(",");

  solvePart1(ranges);
  solvePart2(ranges);
}

main();

function solvePart1(ranges) {
  let invalidSum = 0;
  for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);
    for (let i = start; i <= end; i++) {
      const numString = i.toString();
      const [firstHalf, secondHalf] = splitInHalf(numString);

      if (firstHalf === secondHalf) {
        invalidSum += i;
      }
    }
  }

  console.log("Part 1 (Invalid ID Sum):", invalidSum);
}

function splitInHalf(str) {
  const mid = Math.floor(str.length / 2);
  return [str.slice(0, mid), str.slice(mid)];
}

function solvePart2(ranges) {
  let invalidSum = 0;
  for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);
    for (let i = start; i <= end; i++) {
      const numString = i.toString();

      const re = /^(.+)\1+$/;

      if (re.test(numString)) {
        invalidSum += i;
      }
    }
  }

  console.log("Part 2 (Invalid ID Sum):", invalidSum);
}
