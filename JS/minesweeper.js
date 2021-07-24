//logic that operates game




//populating board




//creating stauses(in css)[hidden,mine,number and marked] inside of const variable
export const TILE_STATUS = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}


//using boardSize for x,y since board is a square.
export function buildBoard(boardSize, numberOfMines){

    const board = [];
    //determining mine position for board(returns array of values(x,y coordinates))
    const minePositions = getMinePositions(boardSize, numberOfMines)

    //looping through the x direction of board
    for(let x=0; x < boardSize; x++) {

        //creating new row for every single x(empty array)
        const row = []

        //looping through the y direction of board
        for(let y=0; y < boardSize; y++){

            //creating element(tile)will display on screen(using div)
            const element = document.createElement("div");
            //making 'tile status' default hidden
            element.dataset.status = TILE_STATUS.HIDDEN;

            //creating tile object(has an x,y property)
            //'short-hand' notation to specify x,y
            const tile = {
                element,
                x,
                y,
                //populating the board with mines(boolian)
                //checks to seeif a mine position matches the current x,y coordinate if so, returns true,
                //otherwise returns false
                mine: minePositions.some(positionMatch.bind( null,{ x,y })),
                //get/set the status of the tile directly
                get status(){
                    return this.element.dataset.status;
                },
                set status(value){
                    this.element.dataset.status = value;
                }
            }
            //adding tile to row
            row.push(tile);
        }
        //adding row to the board
        board.push(row);
    }
    return board;
}


//function that will be sent to script.js, and will mark tiles triggered by eventListener function
export function markTile(tile){
    //checking if tile is 'eligable' to be marked,
    //can only mark a tile that's hidden or unmark a tile that's already marked
    if (
        tile.status != TILE_STATUS.HIDEN &&
        tile.status != TILE_STATUS.MARKED
        ){
            //if tile isnt't hidden or marked, it's either a mine(already revieled), 
            //or it's a tile  that has already been revealed(number)
            //if the tile is hidden or marked continue on,
            //if the tile is neither return 'prematurely'
            return;
        }
        //checking if tile is being marked for first time or unmarking tile
        if(tile.status === TILE_STATUS.MARKED) {
            //'hiding' tile if it was already marked
            tile.status = TILE_STATUS.HIDDEN;
        } else {
            //marking tile
            tile.status = TILE_STATUS.MARKED;
        }

}

//**added access to board in order to gain access to 'neighbour' tiles  */
export function revealTile(board, tile) {
    //checking to see that tile is 'eligable' to be revealed
    //can only reveal tiles that are hidden, so if the tile isn't hidden(marked or revealed),
    //the program will not reveal it
    if (tile.status !== TILE_STATUS.HIDDEN) {
        return;
    } 
    //if the tile is a mine we set it as a mine and exit out
    if (tile.mine) {
        tile.status = TILE_STATUS.MINE;
        return;
    }
    //if the tile is not a mine, assigning it a number
    tile.status = TILE_STATUS.NUMBER

    //using function to getnearby tiles fro the tile passed in a particular board
    const adjTiles = nearbyTiles(board, tile);

    //getting any tiles that are mines(anything that returns true is a mine)
    const mines = adjTiles.filter(t =>t.mine);
    //handle whenthere are no mines(clicking on an empty tile it reveals everything else that is empty(and adjacent))
    if (mines.length === 0 ) {
        //if the mines length is equal to 0 , call revealTile function for all adjacent neighbours
        //'forEach' automaticly adds in each individual adjacent tile as 3rd parameter
        //this function gets 'recursively' called
        adjTiles.forEach(revealTile.bind(null,board))

    } else {
        //setting up tiles so that when they are clicked the number revealed represents the number of mines nearby.
        tile.element.textContent = mines.length;    
    }

}
///########need to sheck ()
//checking every single tile, making sure every tile is either revealed(as a number), hidden or marked with a flag
//if tile is hidden or marked the function makes sure it is not a mine,
//if all tiles expect for those that are mines are revealed, the game is won
export function checkWin(board) {
//update smiley face
return board.every(row => {
    return row.every(tile => {
        return (
            //checks if every tile that is hidden or marked is a mine( in that case - gameWIN)
         tile.status === TILE_STATUS.NUMBER  ||
          (tile.mine &&
            tile.status === TILE_STATUS.HIDDEN || tile.status ===TILE_STATUS.MARKED))
   

       
    })
})  

}



// check tiles, if one or more is a mine, the game is lossed
export function checkLose(board) {
//update smiley face
return board.some(row=> {
    return row.some(tile => {
        //check if any tilea are mines
        var img = new Image();   // Create new img element
         img.src = "IMG/losingPepe.png"; // Set source path
        return tile.status === TILE_STATUS.MINE
        })
    })
}

function getMinePositions(boardSize, numberOfMines){
    var positions = [];
    //cant loop over with for loop because 2 entities(mines)can overlap
    //using while loop to avoid this scenario
    //set for mine number in lvl1- need to make it work for different board sizes
    while(positions.length < numberOfMines){
        var position = {
            //randon number between 0 and the size of the element
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }
        //checking to see if position already exists(for bomb)
        //'.some' returns true if atleast some of the elements inside the array match the value
        //creating new function to match position(positionMatch)
        //check if bomb position 'p' and 'position' are ***not a match
        //#####(p => positionMatch.bind( null,position )))
        if (!positions.some(positionMatch.bind( null,position ))) {
            //if they are not a match - add postion to board
            positions.push(position)

        }
    }

    return positions
}

//checking postions of two value (a - x,y and b - x,y)
function positionMatch (a,b) {
    //return if the position is identical
    return a.x === b.x && a.y === b.y;
}


// //return a random integer
// function randomNumber (size){
//     return math.floor(Math.random()*size);
// }

function randomNumber(size) {
    return Math.floor(Math.random() * size)
  }

function nearbyTiles(board,{x, y}) {
    //get all tiles that are adjacent(start with empty array and return)
    var tiles =[]
        //using offset loops since neighbour can be 1 tile away which is an index difference of +/- ,
        //through this function will loop through both rows and col (x,y) with index off by a mximum of 1,
        //than the current tile being checked for neighbours

        //looping for x
        for(let xOffset = -1; xOffset <= 1; xOffset++ ){
            //looping for y
            for(let yOffset = -1; yOffset <= 1; yOffset++ ){
                //create tile according x,y offset of original tile location
                //**added*** using optional chaning syntax(?.) to account for offset location being off the board
                //(for example if tile is a corner with a '-1' offset)

                //if an element exists in row then get the element in the 'y' direction
                var tile = board[x+xOffset]?.[y+yOffset]
                //adding to tile array
                if (tile)  tiles.push(tile)
               
             

            }

        }


    return tiles;
}

// function reset(){
//     buildBoard(boardSize, numberOfMines)
//   }