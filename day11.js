
const TEST_INPUT = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

const TEST_INPUT2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`

async function main() {
  const path = `inputs/day11.txt`;

  const file = Bun.file(path);
  const input = await file.text();
  const rows = input.split("\n");

  solvePart1(rows);
  // solvePart2(rows);
}

main();

function solvePart1(rows) {
  // DFS to find ways out
  const graph = {};
  for (const row of rows) {
    const [from, to] = row.split(":");
    graph[from] = to.trim().split(" ");
  }

  // console.log(graph);

  const stack = ["you"];
  let waysOut = 0;
  while (stack.length) {
    const node = stack.pop();
    if (graph[node].includes("out")) {
      waysOut++;
    }

    stack.push(...graph[node].filter(e => e !== "out"));
  }

  console.log("Part 1 (Ways out):", waysOut);
}

// TOO SLOW
function solvePart2(rows) {
  // DFS to find ways out
  const graph = {};
  for (const row of rows) {
    const [from, to] = row.split(":");
    graph[from] = to.trim().split(" ");
  }

  // console.log(graph);

  const stack = ["svr"];
  let path = [];
  let validWaysOut = 0;
  while (stack.length) {
    const node = stack.pop();
    path.push(node);

    if (graph[node].includes("out")) {
      // console.log("PATH:", path);
      if (path.includes("fft") && path.includes("dac")) validWaysOut++;
      const branchNode = stack.at(-1);
      path = path.slice(0, path.indexOf(branchNode))
    }

    stack.push(...graph[node].filter(e => e !== "out"));
  }

  console.log("Part 2 (Valid ways out):", validWaysOut);
}
