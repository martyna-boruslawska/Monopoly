import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js";
import { playRound } from "./game/playRound.js";

const board = createBoard();

let players = createPlayers(["Martyna", "Jarek"]);

console.log(`Players in the game: ${players.map(player => player.name).join(", ")}.

=================================
🎲 MONOPOLY GAME STARTED! 🎲
=================================
`);

const numberOfTurns = 10; // You can adjust the number of turns as needed
for (let turn = 0; turn < numberOfTurns; turn++) {
  playRound(players, board);
}
