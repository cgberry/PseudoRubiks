let blocks = []
let size = 20
let shuffleButton, resetButton
let sp = 2

let time = 0
let timer
let counting
let c

let moves = 0
let moveText

let youWon

let reseting = true

function setup() {
//set up DOM elements
  c = createCanvas(300, 220);
  c.parent("game")

  shuffleButton = createButton("shuffle")
  shuffleButton.mousePressed(shuffling)
  shuffleButton.parent("game")

  resetButton = createButton("reset")
  resetButton.mousePressed(reset)
  resetButton.parent("game")

  timer = select("#timer")
  timer.html("Time Elapsed: " + time)

  moveText = select("#moves")
  moveText.html("Moves: " + moves)

  youWon = createP()

//create the blocks with respective colors
  for (let x = 0; x < 12; x++) {
    //for side blocks
    let min = 0
    let max = 3
    if (x >= 3 && x <= 5) {
      min = -3
      max = 6
    }

    for (let y = min; y < max; y++) {
      //offsets for colors
      let xOffset = 0
      let yOffset = 0
      if (x > 5) {
        xOffset = 2
      }
      if (y < 0) {
        yOffset = 1
      } else if (y > 2) {
        yOffset = 2
      }
      let colorIndex = floor(x / 3) + yOffset + xOffset
      blocks.push(new Block([x, y], colorIndex, size))
    }
  }

}

function draw() {
  background(255);
  //display blocks
  for (let b of blocks) {
    b.show()
    b.update(sp)
  }
}

class Block {
  constructor(gridPos, col, size) {
    this.gridPos = [...gridPos]
    this.oriGridPos = [...gridPos]
    this.size = size
    this.x = gridPos[0] * this.size + 40
    this.y = gridPos[1] * this.size + 80
    this.color = undefined

    this.colors(col)
  }
  show() {
    fill(this.color)
    square(this.x, this.y, this.size)
  }
  colors(cul) {
    switch (cul) {
      case 0:
        this.color = "orange"
        break;
      case 1:
        this.color = "snow"
        break;
      case 2:
        this.color = "blue"
        break;
      case 3:
        this.color = "green"
        break;
      case 4:
        this.color = "red"
        break;
      case 5:
        this.color = "yellow"
    }
  }
  updatePos(direction) {
    switch (direction) {
      case "up":
        this.gridPos[1] -= 3
        if (this.gridPos[1] < -3) {
          this.gridPos[1] += 9
        }
        break;
      case "down":
        this.gridPos[1] += 3
        if (this.gridPos[1] > 5) {
          this.gridPos[1] -= 9
        }
        break;
      case "left":
        this.gridPos[0] -= 3
        if (this.gridPos[0] < 0) {
          this.gridPos[0] += 12
        }
        break;
      case "right":
        this.gridPos[0] += 3
        if (this.gridPos[0] > 11) {
          this.gridPos[0] -= 12
        }
        break;
      default:
        let old = [...this.oriGridPos]
        this.gridPos = old
    }
  }

  update(speed) {
    let oldX = this.x
    let oldY = this.y

    let newX = this.gridPos[0] * this.size + 40
    let newY = this.gridPos[1] * this.size + 80

    if (oldX != newX && oldX < newX) {
      oldX += speed
    } else if (oldX != newX && oldX > newX) {
      oldX -= speed
    }

    if (oldY != newY && oldY < newY) {
      oldY += speed
    } else if (oldY != newY && oldY > newY) {
      oldY -= speed
    }
    this.x = oldX
    this.y = oldY
  }

}

function mousePressed() {
//What row or column am I pressing?
  let mY = int(map(mouseY, 20, 200, -3, 6, true))
  let mX = int(map(mouseX, 40, 280, 0, 11, true))

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    for (let b of blocks) {
      //move up if touching top
      if (mY === -3 && mX >= 3 && mX <= 5) {
        if (b.gridPos[0] === mX) {
          b.updatePos("up")
        }
      }
      if (mY === 6 && mX >= 3 && mX <= 5) {
        if (b.gridPos[0] === mX) {
          b.updatePos("down")
        }
      }
      if (mX === 0 && mY >= 0 && mY <= 2) {
        if (b.gridPos[1] === mY) {
          b.updatePos("left")
        }
      }
      if (mX === 11 && mY >= 0 && mY <= 2) {
        if (b.gridPos[1] === mY) {
          b.updatePos("right")
        }
      }
    }

    moves += 1
    moveText.html("Moves: " + moves)
    if(!reseting){
      win()
    }
  }
}

//shuffle the cubes without putting them in the wrong spot
function shuffling() {
  let randYArray = [-3, 0, 1, 2, 6]
  let randXArray = [0, 3, 4, 5, 11]


  for (let i = 0; i < 100; i++) {
    let randY = randYArray[floor(random(0, 5))]
    let randX = randXArray[floor(random(0, 5))]
    for (let b of blocks) {
      if (randY === -3 && randX >= 3 && randX <= 5) {
        if (b.gridPos[0] === randX) {
          b.updatePos("up")
        }
      }
      if (randY === 6 && randX >= 3 && randX <= 5) {
        if (b.gridPos[0] === randX) {
          b.updatePos("down")
        }
      }
      if (randX === 0 && randY >= 0 && randY <= 2) {
        if (b.gridPos[1] === randY) {
          b.updatePos("left")
        }
      }
      if (randX === 11 && randY >= 0 && randY <= 2) {
        if (b.gridPos[1] === randY) {
          b.updatePos("right")
        }
      }
    }
  }
  
  //start the timer
  startTime()
  moves = 0
  moveText.html("Moves: " + moves)
  reseting = false
  youWon.html("")
}

//reset the game
function reset() {
  for (let b of blocks) {
    b.updatePos()
  }
  time = 0
  moves = 0
  reseting = true
  clearInterval(counting)
  timer.html("Time Elapsed: " + time)
  moveText.html("Moves: " + moves)
  youWon.html("")
}

function startTime() {
  time = 0
  moves = 0
  clearInterval(counting)
  counting = setInterval(function() {
    let seconds = time % 60
    let minutes = floor(time / 60)
    let hours = floor(minutes / 60)
    timer.html("Time Elapsed: " + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds))
    time += 1
  }, 1000)
}

//Make sure time is in 00:00:00 format
function pad(n) {
  return (n < 10) ? ("0" + n) : n;
}

//win condition
function win() {
  let correctBlocks = []
  //check if blocks are in the correct place
  for (let b of blocks) {
    if (b.gridPos[0] !== b.oriGridPos[0] || b.gridPos[1] !== b.oriGridPos[1]) {
      correctBlocks.push(false)
    } else {
      correctBlocks.push(true)
    }
  }
  //if all are correct, say how much you won by!
  if (!correctBlocks.includes(false)) {
    clearInterval(counting)
    let timing = timer.html()
    youWon.html("You finished this in " + timing.slice(14) + " and " + moves + " moves")
  }
}
