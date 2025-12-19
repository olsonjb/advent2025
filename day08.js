
const TEST_INPUT = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

const NUM_CONNECTIONS = 1000;

async function main() {
  const path = `inputs/day08.txt`;

  const file = Bun.file(path);
  const input = await file.text();
  const rows = input.split("\n").map(r => r.split(",").map(n => parseInt(n)));

  solvePart1(rows);
  solvePart2(rows);
}

main();

//IDEA - get all distances between all points once and store in map (maybe dist as key w/ list of idx pairs?).
function solvePart1(rows) {
  const distMap = buildDistMap(rows);
  const distances = Array.from(distMap.keys()).toSorted((a, b) => a - b);

  const circuits = [];
  connect: for (let i = 0; i < NUM_CONNECTIONS; i++) {
    const nextShortestDist = distances.shift();
    const [a, b] = distMap.get(nextShortestDist);
    // console.log("Connecting:", a, b);

    const connectedCircuits = [];
    for (let j = 0; j < circuits.length; j++) {
      if (circuits[j].includes(a) && circuits[j].includes(b)) {
        // console.log("Already connected:", a, b);
        // i--; Don't decrement, this connection counts
        continue connect;
      }

      // Circuit contains one or the other
      if (circuits[j].includes(a) || circuits[j].includes(b)) {
        connectedCircuits.push(j);
      }
    }

    if (connectedCircuits.length === 1) {
      // 1 circuit contains a or b: add the missing one to the existing circuit
      const idx = connectedCircuits[0];
      if (circuits[idx].includes(a)) {
        circuits[idx].push(b);
      } else if (circuits[idx].includes(b)) {
        circuits[idx].push(a);
      }
    } else if (connectedCircuits.length === 2) {
      // 1 circuit contains a and another contains b: merge the circuits
      const [idxA, idxB] = connectedCircuits;
      circuits[idxA] = circuits[idxA].concat(circuits[idxB]);
      // remove the second circuit
      circuits.splice(idxB, 1);
    } else {
      if (connectedCircuits.length > 2) console.error("MORE THAN 2 CIRCUITS CONTAIN", a, b, "THIS SHOULD NOT HAPPEN");
      // Didn't connect to any existing circuits
      circuits.push([a, b]);
    }
    // console.log(circuits);
  }

  const circuitLengths = circuits.map(c => c.length).toSorted((a, b) => b - a);
  const productOfLongest = circuitLengths.slice(0, 3).reduce((acc, cur) => acc * cur);

  console.log("Part 1 (Product of longest 3):", productOfLongest);
}

function solvePart2(rows) {
  const distMap = buildDistMap(rows);
  const distances = Array.from(distMap.keys()).toSorted((a, b) => a - b);

  const circuits = [];
  let lastConnection;
  connect: while (distances.length) {
    const nextShortestDist = distances.shift();
    const [a, b] = distMap.get(nextShortestDist);
    // console.log("Connecting:", a, b);

    const connectedCircuits = [];
    for (let j = 0; j < circuits.length; j++) {
      if (circuits[j].includes(a) && circuits[j].includes(b)) {
        // console.log("Already connected:", a, b);
        // i--; Don't decrement, this connection counts
        continue connect;
      }

      // Circuit contains one or the other
      if (circuits[j].includes(a) || circuits[j].includes(b)) {
        connectedCircuits.push(j);
      }
    }

    if (connectedCircuits.length === 1) {
      // 1 circuit contains a or b: add the missing one to the existing circuit
      const idx = connectedCircuits[0];
      if (circuits[idx].includes(a)) {
        circuits[idx].push(b);
      } else if (circuits[idx].includes(b)) {
        circuits[idx].push(a);
      }
    } else if (connectedCircuits.length === 2) {
      // 1 circuit contains a and another contains b: merge the circuits
      const [idxA, idxB] = connectedCircuits;
      circuits[idxA] = circuits[idxA].concat(circuits[idxB]);
      // remove the second circuit
      circuits.splice(idxB, 1);
    } else {
      if (connectedCircuits.length > 2) console.error("MORE THAN 2 CIRCUITS CONTAIN", a, b, "THIS SHOULD NOT HAPPEN");
      // Didn't connect to any existing circuits
      circuits.push([a, b]);
    }
    // console.log(circuits);

    // If we didn't skip, we made a connection. Update lastConnection
    lastConnection = distMap.get(nextShortestDist);
  }

  // console.log("Last connection:", lastConnection);
  const rowA = rows[lastConnection[0]];
  const rowB = rows[lastConnection[1]];

  const xProduct = rowA[0] * rowB[0];
  console.log("Part 2 (Product X coords):", xProduct);
}

function buildDistMap(rows) {
  const distMap = new Map();
  const checked = new Set();
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      if (i === j || checked.has(`${j}:${i}`)) continue;

      const dist = getDistance(...rows[i], ...rows[j]);

      // NOTE: Verified that my input has no duplicate distances, so ignoring that case
      distMap.set(dist, [i, j]);

      checked.add(`${i}:${j}`);
    }
  }

  return distMap;
}

function getDistance(x, y, z, x2, y2, z2) {
  const dx = x2 - x;
  const dy = y2 - y;
  const dz = z2 - z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
