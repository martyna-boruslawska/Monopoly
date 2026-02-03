import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js"; //NEW

//console.log("Hello World!");
let players = createPlayers(["Martyna", "Jarek"]);
players[1].money=150;
players[1].position=12;
players[0].money+=200;
players[0].position=10;
console.log(players);


let board = createBoard();//NEW
console.log(board);//NEW
const location = board.find(location => location.name === "Baltic Avenue");//NEW
console.log(location);//NEW
const locationById = board.find(locationById => locationById.id === 5);//NEW
console.log(locationById);//NEW
players[0].properties.push(location); //NEW
location.owner = players[0].name;//NEW
players[1].properties.push(locationById); //NEW
locationById.owner = players[1].name;//NEW
console.log(location);//NEW
console.log(locationById);//NEW
console.log(players);//NEW