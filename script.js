let canvas = document.createElement('canvas');
canvas.setAttribute('width', '400');
canvas.setAttribute('height', '400');
canvas.style.border = '1px dashed black';
document.body.appendChild(canvas);
let ctx = canvas.getContext('2d');

function paintLine(x1, y1, x2, y2) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

let c = 40;
let columns = canvas.width / c;
let rows = canvas.height / c;

function index(x, y) {
  if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
    return -1;
  }
  return x * rows + y;
}

function index(x, y) {
  if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
    return -1;
  }
  return x * rows + y;
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.corners = [
      { x: x * c, y: y * c },
      { x: x * c + c, y: y * c },
      { x: x * c + c, y: y * c + c },
      { x: x * c, y: y * c + c },
      { x: x * c, y: y * c },
    ];
    //top, right, bottom, left
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  render() {
    for (let i = 0; i < 4; i++) {
      if (this.walls[i])
        paintLine(
          this.corners[i].x,
          this.corners[i].y,
          this.corners[i + 1].x,
          this.corners[i + 1].y
        );
    }
    if (this.visited) {
      ctx.fillStyle = 'rgba(0,255,0,0.5)';
      ctx.fillRect(this.x * c, this.y * c, c, c);
    }
  }

  checkNeighbors() {
    let x = this.x;
    let y = this.y;
    let posNeighbors = [
      { x: x, y: y - 1 },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
    ];
    let neighbors = [];
    for (let i = 0; i < 4; i++) {
      let neighborUnderTest =
        cells[index(posNeighbors[i].x, posNeighbors[i].y)];
      if (neighborUnderTest && !neighborUnderTest.visited) {
        neighbors.push(neighborUnderTest);
      }
    }
    if (neighbors.length > 0) {
      let r = Math.floor(Math.random() * neighbors.length);
      return neighbors[r];
    }
    return undefined;
  }

  light() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(this.x * c, this.y * c, c, c);
  }
}

function removeWall(currentCell, chosenCell) {
  let lr = currentCell.x - chosenCell.x;
  if (lr === -1) {
    currentCell.walls[1] = false;
    chosenCell.walls[3] = false;
  } else if (lr === 1) {
    currentCell.walls[3] = false;
    chosenCell.walls[1] = false;
  }
  let tb = currentCell.y - chosenCell.y;
  if (tb === -1) {
    currentCell.walls[2] = false;
    chosenCell.walls[0] = false;
  } else if (tb === 1) {
    currentCell.walls[0] = false;
    chosenCell.walls[2] = false;
  }
}

let cells = [];
for (let i = 0; i < columns; i++) {
  for (let j = 0; j < rows; j++) {
    let cell = new Cell(i, j);
    cells.push(cell);
  }
}
let current = cells[0];
let stack = [];
current.visited = true;
stack.push(current);

function maze() {
  if (stack.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current = stack.pop();
    newCurrent = current.checkNeighbors();
    if (newCurrent) {
      newCurrent.light();
      stack.push(current);
      removeWall(current, newCurrent);
      newCurrent.visited = true;
      stack.push(newCurrent);
    } else {
      current.light();
    }
    for (let i = 0; i < cells.length; i++) {
      cells[i].render();
    }
  }
}

setInterval(maze, 100);
