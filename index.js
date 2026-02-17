import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js";
import { rollDice } from "./game/rollDice.js";

const board = createBoard();

let players = createPlayers(["Martyna", "Jarek"]);

function movePlayer(player, steps, board) {
  const passStart = (player.position+steps) >= board.length; 

  player.position = (player.position + steps) % board.length;
  const currentSquare = board[player.position];
  console.log(`${player.name} moves to ${currentSquare.name}`);

  if (passStart) {
    player.money += 200; // Collect $200 when passing Start
    console.log(`${player.name} passes Start and collects $200`);
  }
}

for (let turn = 0; turn < 10; turn++) {
  movePlayer(players[0], rollDice().total, board);
  movePlayer(players[1], rollDice().total, board);
}
