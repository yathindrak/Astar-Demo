let cols = 5;
let rows = 5;
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

function Spot(i, j) {
    // x,y coordinates of each spot, for displaying purposes
    this.x = i;
    this.y = j;
    // properties of a spot
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.show = function (color) {
        fill(color);
        noStroke();
        // stroke(255, 0, 200);
        // strokeWeight(w / 2);
        rect(this.x * w, this.y * h, w-1, h-1);
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
    
    // initialize start and end nodes
    start = grid[0][0];
    end = grid[cols-1][rows-1];

    // add the first element to openset
    openSet.push(start);
}

function draw() {

    background(0);
    /**
    * as long as openSet has items to be evaluated, evaluate them
    * SPECIAL: The reason it has added below open checker inside draw 
    * method rather than a while loop is, draw is also a loop.
    */
   if(openSet.length > 0) {
       // assuming that 1st element is the lowest, he's the winner ;-)
       let winner = 0;
        for(let i=0; i< openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        // current is the Node or Spot having lowest f
        let current = openSet[winner];

        // if openset of index winner goes to end, it is done
       if (openSet[winner] === end) {
            console.log('DONE!!!');
       }

       // add the `current` to the closedSet and remove from openSet
       removeFromArray(openSet, current);
       closedSet.push(current);

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
}