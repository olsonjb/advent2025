
const TEST_INPUT = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

async function main() {
  const path = `inputs/day09.txt`;

  const file = Bun.file(path);
  const input = await file.text();
  const rows = input.split("\n").map(r => r.split(",").map(n => parseInt(n)));

  solvePart1(rows);
  // solvePart2(rows);
}

main();

function solvePart1(rows) {
  let largestArea = 0;
  for (const [x, y] of rows) {
    for (const [x2, y2] of rows) {
      const area = (Math.abs(x - x2) + 1) * (Math.abs(y - y2) + 1);
      largestArea = Math.max(area, largestArea);
    }
  }

  console.log("Part 1 (Largest area):", largestArea);
}

// THIS DOESN'T WORK WHEN THERE'S CONCAVITY - CAME TO SOME OTHER SOLUTIONS WITH AI, BUT THIS ONE STUMPED ME
function solvePart2Mine(rows) {
  let largestArea = 0;
  for (const [x, y] of rows) {
    for (const [x2, y2] of rows) {
      const area = (Math.abs(x - x2) + 1) * (Math.abs(y - y2) + 1);

      if (area > largestArea) {
        // Check that the other 2 corners are also inside
        const otherPoints = rows.filter(p => areDifferent(p, [x, y]) && areDifferent(p, [x2, y2]));
        if (x < x2 && y < y2) {
          const topLeft = [x, y2];
          const isTopLeftInside = otherPoints.some(([x3, y3]) => topLeft[0] >= x3 && topLeft[1] <= y3);
          const bottomRight = [x2, y];
          const isBottomRightInside = otherPoints.some(([x3, y3]) => bottomRight[0] <= x3 && bottomRight[1] >= y3);

          if (isTopLeftInside && isBottomRightInside) {
            largestArea = area;
          }
        } else if (x > x2 && y > y2) {
          const topLeft = [x2, y];
          const isTopLeftInside = otherPoints.some(([x3, y3]) => topLeft[0] >= x3 && topLeft[1] <= y3);
          const bottomRight = [x, y2];
          const isBottomRightInside = otherPoints.some(([x3, y3]) => bottomRight[0] <= x3 && bottomRight[1] >= y3);

          if (isTopLeftInside && isBottomRightInside) {
            largestArea = area;
          }
        } else if (x < x2 && y > y2) {
          const bottomLeft = [x, y2];
          const isBottomLeftInside = otherPoints.some(([x3, y3]) => bottomLeft[0] >= x3 && bottomLeft[1] >= y3);
          const topRight = [x2, y];
          const isTopRightInside = otherPoints.some(([x3, y3]) => topRight[0] <= x3 && topRight[1] <= y3);

          if (isBottomLeftInside && isTopRightInside) {
            largestArea = area;
          }
        } else if (x > x2 && y < y2) {
          const bottomLeft = [x2, y];
          const isBottomLeftInside = otherPoints.some(([x3, y3]) => bottomLeft[0] >= x3 && bottomLeft[1] >= y3);
          const topRight = [x, y2];
          const isTopRightInside = otherPoints.some(([x3, y3]) => topRight[0] <= x3 && topRight[1] <= y3);

          if (isBottomLeftInside && isTopRightInside) {
            largestArea = area;
          }
        }
      }
    }
  }

  console.log("Part 2 (Largest area inside greens):", largestArea);
}

// Still too slow, maybe compress?
function solvePart2(rows) {
  //Build grid (with 1 row padding)
  console.log("Building grid...");
  const width = Math.max(...rows.map(r => r[0] + 2));
  const height = Math.max(...rows.map(r => r[1] + 2));
  console.log(`Building ${height}x${width} grid...`);

  console.log("xstart", Math.min(...rows.map(r => r[0])));
  console.log("ystart", Math.min(...rows.map(r => r[1])));

  const grid = new Array(height).fill(0).map(() => new Array(width).fill("."));

  console.log(`Built ${height}x${width} grid. Connecting points...`);

  // Walk the points, mark them and lines between them
  let prevX;
  let prevY;
  for (const [x, y] of rows) {
    if (prevX === x) {
      const minY = Math.min(prevY, y);
      const maxY = Math.max(prevY, y);
      for (let y2 = minY; y2 <= maxY; y2++) {
        grid[y2][x] = "X";
      }
    } else if (prevY === y) {
      const minX = Math.min(prevX, x);
      const maxX = Math.max(prevX, x);
      for (let x2 = minX; x2 <= maxX; x2++) {
        grid[y][x2] = "X";
      }
    }
    prevX = x;
    prevY = y;
  }

  // Connect last point back to first point
  const [firstX, firstY] = rows[0];
  if (prevX === firstX) {
    const minY = Math.min(prevY, firstY);
    const maxY = Math.max(prevY, firstY);
    for (let y2 = minY; y2 <= maxY; y2++) {
      grid[y2][firstX] = "X";
    }
  } else if (prevY === firstY) {
    const minX = Math.min(prevX, firstX);
    const maxX = Math.max(prevX, firstX);
    for (let x2 = minX; x2 <= maxX; x2++) {
      grid[firstY][x2] = "X";
    }
  }

  // Find top-leftmost X, then start flood fill from 1 down and 1 to the right
  console.log("Points connected. Finding start point...");
  let startX, startY;
  outer: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "X") {
        startX = x + 1;
        startY = y + 1;
        break outer;
      }
    }
  }

  // Flood fill inside, modifying grid in place
  console.log(`Filling from ${startX},${startY}...`);
  const stack = [[startX, startY]];
  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    if (grid[cy][cx] !== ".") continue;

    grid[cy][cx] = "X";
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }

  console.log("Grid filled. Finding largest area...");
  // console.log(grid);

  let largestArea = 0;
  for (const [x, y] of rows) {
    corner: for (const [x2, y2] of rows) {
      const area = (Math.abs(x - x2) + 1) * (Math.abs(y - y2) + 1);

      if (area > largestArea) {
        // Verify all points are inside
        const minX = Math.min(x, x2);
        const maxX = Math.max(x, x2);
        const minY = Math.min(y, y2);
        const maxY = Math.max(y, y2);
        for (let y2 = minY; y2 <= maxY; y2++) {
          for (let x2 = minX; x2 <= maxX; x2++) {
            if (grid[y2][x2] !== "X") continue corner;
          }
        }
        largestArea = area;
      }
    }
  }

  console.log("Part 2 (Largest area inside greens):", largestArea);
}

function areDifferent([x, y], [x2, y2]) {
  return x !== x2 || y !== y2;
}
