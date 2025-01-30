let tiles = [];
const tileImages = [];

let grid = [];

const DIM = [20, 40];

function preload() {
  // const path = 'rail';
  // for (let i = 0; i < 7; i++) {
  //   tileImages[i] = loadImage(`${path}/tile${i}.png`);
  // }

  const path = 'tiles/circuit-inspired';
  for (let i = 0; i < 21; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function removeDuplicatedTiles(tiles) {
  const uniqueTilesMap = {};
  for (const tile of tiles) {
    const key = tile.edges.join(','); // ex: "ABB,BCB,BBA,AAA"
    uniqueTilesMap[key] = tile;
  }
  return Object.values(uniqueTilesMap);
}

function setup() {
  window.cnv = createCanvas(2400, 4800);
  //randomSeed(15);

  // tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
  // tiles[1] = new Tile(tileImages[1], ['ABA', 'ABA', 'ABA', 'AAA']);
  // tiles[2] = new Tile(tileImages[2], ['BAA', 'AAB', 'AAA', 'AAA']);
  // tiles[3] = new Tile(tileImages[3], ['BAA', 'AAA', 'AAB', 'AAA']);
  // tiles[4] = new Tile(tileImages[4], ['ABA', 'ABA', 'AAA', 'AAA']);
  // tiles[5] = new Tile(tileImages[5], ['ABA', 'AAA', 'ABA', 'AAA']);
  // tiles[6] = new Tile(tileImages[6], ['ABA', 'ABA', 'ABA', 'ABA']);

  // Loaded and created the tiles
  tiles[0] = new Tile(tileImages[0], ['___', '___', '___', '___']);
  tiles[1] = new Tile(tileImages[1], ['___', '___', '_B_', '___']);
  tiles[2] = new Tile(tileImages[2], ['___', '___', 'C_C', '___']);
  tiles[3] = new Tile(tileImages[3], ['___', '___', 'DDD', '___']);
  tiles[4] = new Tile(tileImages[4], ['_B_', '___', '_B_', '___']);
  tiles[5] = new Tile(tileImages[5], ['_B_', '_B_', '_B_', '_B_']);
  tiles[6] = new Tile(tileImages[6], ['___', '___', '_B_', '_B_']);
  tiles[7] = new Tile(tileImages[7], ['___', '_B_', '_B_', '_B_']);
  tiles[8] = new Tile(tileImages[8], ['C_C', '___', '_B_', '___']);
  tiles[9] = new Tile(tileImages[9], ['C_C', '___', 'C_C', '___']);
  tiles[10] = new Tile(tileImages[10], ['DDD', '___', 'C_C', '___']);
  tiles[11] = new Tile(tileImages[11], ['C_C', '___', 'C_C', 'C_C']);
  tiles[12] = new Tile(tileImages[12], ['C_C', '_B_', '___', '___']);
  tiles[13] = new Tile(tileImages[13], ['DDD', '___', 'DDD', '___']);
  tiles[14] = new Tile(tileImages[14], ['DDD', 'DDD', '___', '___']);
  tiles[15] = new Tile(tileImages[15], ['DDD', 'DDD', 'DDD', '___']);
  tiles[16] = new Tile(tileImages[16], ['DDD', 'C_C', '___', '___']);
  tiles[17] = new Tile(tileImages[17], ['C_C', '___', '___', '_B_']);
  tiles[18] = new Tile(tileImages[18], ['DDD', '___', '___', 'C_C']);
  tiles[19] = new Tile(tileImages[19], ['DDD', '___', '___', '_B_']);
  tiles[20] = new Tile(tileImages[20], ['DDD', '_B_', '___', '___']);

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].index = i;
  }

  const initialTileCount = tiles.length;
  for (let i = 0; i < initialTileCount; i++) {
    let tempTiles = [];
    for (let j = 0; j < 4; j++) {
      tempTiles.push(tiles[i].rotate(j));
    }
    tempTiles = removeDuplicatedTiles(tempTiles);
    tiles = tiles.concat(tempTiles);
  }
  console.log(tiles.length);

  // Generate the adjacency rules based on edges
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startOver() {
  // Create cell for each spot on the grid
  for (let i = 0; i < DIM[0] * DIM[1]; i++) {
    grid[i] = new Cell(tiles.length);
  }
}

function checkValid(arr, valid) {
  //console.log(arr, valid);
  for (let i = arr.length - 1; i >= 0; i--) {
    // VALID: [BLANK, RIGHT]
    // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
    // result in removing UP, DOWN, LEFT
    let element = arr[i];
    // console.log(element, valid.includes(element));
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
  // console.log(arr);
  // console.log("----------");
}

function mousePressed() {
  redraw();
}

function draw() {
  background(0);

  const w = width / DIM[0];
  const h = height / DIM[1];
  for (let j = 0; j < DIM[1]; j++) {
    for (let i = 0; i < DIM[0]; i++) {
      let cell = grid[i + j * DIM[0]];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * w, j * h, w, h);
      } else {
        noFill();
        stroke(51);
        rect(i * w, j * h, w, h);
      }
    }
  }

  // Pick cell with least entropy
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter((a) => !a.collapsed);
  // console.table(grid);
  // console.table(gridCopy);

  if (gridCopy.length == 0) {
    return;
  }
  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 1; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }

  if (stopIndex > 0) gridCopy.splice(stopIndex);
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  if (pick === undefined) {
    startOver();
    return;
  }
  cell.options = [pick];

  const nextGrid = [];
  for (let j = 0; j < DIM[1]; j++) {
    for (let i = 0; i < DIM[0]; i++) {
      let index = i + j * DIM[0];
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);
        // Look up
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM[0]];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look right
        if (i < DIM[0] - 1) {
          let right = grid[i + 1 + j * DIM[0]];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look down
        if (j < DIM[1] - 1) {
          let down = grid[i + (j + 1) * DIM[0]];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look left
        if (i > 0) {
          let left = grid[i - 1 + j * DIM[0]];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }

        // I could immediately collapse if only one option left?
        nextGrid[index] = new Cell(options);
      }
    }
  }

  grid = nextGrid;
}