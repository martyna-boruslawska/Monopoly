import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js";

const board = createBoard();

let players = createPlayers(["Martyna", "Jarek"]);
players[1].money=150;
players[1].position=12;
players[0].money+=200;
players[0].position=10;
console.log(players);

function rollDice() {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return { total: die1 + die2, isDouble: die1 === die2 };
}
console.log("Rolled dice:", rollDice());
