const TEST_INPUT = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

// Vibe parse
function parseInput(input) {
  const lines = input.split("\n");
  const shapes = [];
  const regions = [];

  let i = 0;

  // Parse shapes (first section)
  while (i < lines.length) {
    const line = lines[i];

    // Check if we've reached the regions section (starts with dimensions like "40x42:")
    if (line.match(/^\d+x\d+:/)) {
      break;
    }

    // Check for shape label (like "0:", "1:", etc.)
    const labelMatch = line.match(/^(\d+):$/);
    if (labelMatch) {
      const grid = [];

      // Read the next 3 lines as the shape grid
      i++;
      while (i < lines.length && lines[i] && !lines[i].match(/^\d+:$/) && !lines[i].match(/^\d+x\d+:/)) {
        if (lines[i].trim()) {
          grid.push(lines[i].split(""));
        }
        i++;
      }

      shapes.push(grid);
    } else {
      i++;
    }
  }

  // Parse regions (second section)
  while (i < lines.length) {
    const line = lines[i];
    const regionMatch = line.match(/^(\d+)x(\d+):\s*(.+)$/);
    if (regionMatch) {
      const width = parseInt(regionMatch[1]);
      const height = parseInt(regionMatch[2]);
      const shapeIds = regionMatch[3].trim().split(/\s+/).map(Number);
      regions.push({ width, height, shapeIds });
    }
    i++;
  }

  return { shapes, regions };
}

async function main() {
  const path = `inputs/day12.txt`;

  const file = Bun.file(path);
  const input = await file.text();

  const { shapes, regions } = parseInput(input);

  solvePart1(shapes, regions);
}

main();

// Thank you Reddit for cluing me in to the fact that you don't actually have to solve the problem -_-
function solvePart1(shapes, regions) {
  let count = 0;
  for (const region of regions) {
    const regionArea = region.height * region.width;

    let totalShapeArea = 0;
    for (let i = 0; i < region.shapeIds.length; i++) {
      const area = shapes[i].reduce((acc, row) => acc + row.filter(c => c === '#').length, 0);

      totalShapeArea += area * region.shapeIds[i];
    }

    if (totalShapeArea <= regionArea) count++;
  }

  console.log("Part 1:", count);
}
