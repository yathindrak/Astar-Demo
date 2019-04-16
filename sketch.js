let cols = 25;
let rows = 25;
let grid = new Array(cols);

// width and height of each cell
let w,h;

/**
 * initially open set has only one element and closed set is empty
 */
let openSet = [];
let closedSet = [];

/**
 * start and end nodes
 */
let start;
let end;

/**
 * path for the max flow
 */
let path = [];

function Spot(i, j) {
    // x,y coordinates of each spot, for displaying purposes named as i,j
    this.i = i;
    this.j = j;
    // properties of a spot
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;
    this.wall = false;

    /**
     * Wall is by default false. So making it true for some spots randomly
     */
    if (random(1) < 0.1) {
        this.wall = true;
    }

    this.show = function (color) {
        fill(color);

        // fill black if spot is a wall
        if (this.wall) {
            fill(0);
        }

        noStroke();
        // stroke(255, 0, 200);
        // strokeWeight(w / 2);
        rect(this.i * w, this.j * h, w-1, h-1);
    };

    /**
     * Add neighbours
     * @param grid - this grid param useful when add neighbours
     */
    this.addNeighbours = function (grid) {
        const i = this.i;
        const j = this.j;
        // conditions to support add neighbours add neighbour nodes,
        // and avoid accessing unexisting nodes
        if (i < cols - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbours.push(grid[i][j - 1]);
        }
        // if (i > 0 && j > 0) {
        //     this.neighbours.push(grid[i - 1][j - 1]);
        // }
        // if (i < cols - 1 && j > 0) {
        //     this.neighbours.push(grid[i + 1][j - 1]);
        // }
        // if (i > 0 && j < rows - 1) {
        //     this.neighbours.push(grid[i - 1][j + 1]);
        // }
        // if (i < cols - 1 && j < rows - 1) {
        //     this.neighbours.push(grid[i + 1][j + 1]);
        // }
    }
}

/**
 * Remove current element from array
 * @param arr - array
 * @param elt - element to be removed
 */
function removeFromArray(arr, elt) {
    // here reverse for loop is because, elements can be skipped
    // if remove items from array inside forward for loop
    for(let i = arr.length -1; i >= 0; i--) {
        if (arr[i] === elt) {
            arr.splice(i, 1);
        }
    }
}

/**
 * returns euclidean distance
 * @param a
 * @param b
 * @returns {*}
 */
function heuristic(a, b) {
    /*
        Below getting heuristic from euclidean distance has removed.
        Instead taking manhattan distance
     */
    // d is the length of the line / euclidean distance
    // dist(x1, y1, x2, y2) gives distance from point x to point y.
    return dist(a.i, a.j, b.i, b.j);

    // getting manhattan distance
    // return abs(a.i - b.i) + abs(a.j + b.j);
}

function setup() {
    createCanvas(400, 400);

    // init width and height of cells
    w = width/cols;
    h = height/rows;

    // Making a 2D array
    for(let i=0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // fill the grid with spots
    for(let i=0; i < cols; i++) {
        for(let j=0; j < rows; j++) {
            grid[i][j] = new Spot(i,j);
        }
    }

    // add neighbours
    for(let i=0; i < cols; i++) {
        for(let j=0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }

    // initialize start and end nodes
    start = grid[0][0];
    end = grid[cols-1][rows-1];

    // add the first element to openset
    openSet.push(start);
}

function draw() {

    let winner, current;

    background(0);
    /**
     * as long as openSet has items to be evaluated, evaluate them
     * SPECIAL: The reason it has added below open checker inside draw
     * method rather than a while loop is, draw is also a loop.
     */
    if(openSet.length > 0) {
        // assuming that 1st element is the lowest, he's the winner ;-)
        winner = 0;
        for(let i=0; i< openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        // current is the Node or Spot having lowest f
        current = openSet[winner];

        // if openSet of index winner goes to end, it is done
        if (current === end) {
            // stop the loop
            noLoop();

            console.log('DONE!!!');
        }

        // add the `current` to the closedSet and remove from openSet
        removeFromArray(openSet, current);
        closedSet.push(current);

        // get neighbours of current
        let neighbours = current.neighbours;

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            // console.log('neighbour'+i+" : "+ neighbour);

            /**
             * neighbour should not be in closedList, since it should not be already visited.
             */
            if (!closedSet.includes(neighbour)) {
                // assumed that g between current to neighbours(in horizontal and vertical) is 1.
                let tempG = current.g+1;

                // if neighbour in openSet, neighbour should always having a g value
                if (openSet.includes(neighbour)) {
                    // if calculated g is less than G in neighbour already change to it to new G
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                    }
                } else {
                    neighbour.g = tempG;
                    console.log('adding ', neighbour);
                    openSet.push(neighbour);
                    console.log(openSet);
                }

                // set neighbour's heuristic - educated guess
                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                // set parent
                neighbour.previous = current;
            }
        }

    } else {
        // no solution
    }

    for(let i=0; i < cols; i++) {
        for(let j=0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    // make closedSet items red
    for(let i=0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    // make openSet items green
    for(let i=0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    path =[];
    let temp = current;
    // push last
    path.push(temp);

    // if temp has a previous we need to append that to the path array
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    // path mark in blue
    for(let i=0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}