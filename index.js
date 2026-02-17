import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js";
import { rollDice } from "./game/rollDice.js";
import { movePlayer } from "./game/movePlayer.js";

const board = createBoard();

let players = createPlayers(["Martyna", "Jarek"]);

for (let turn = 0; turn < 10; turn++) {
  movePlayer(players[0], rollDice().total, board);
  movePlayer(players[1], rollDice().total, board);
}
