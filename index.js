import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js";
import { playTheTurns } from "./game/playTheTurns.js";

const board = createBoard();

let players = createPlayers(["Martyna Boruslawska", "Jarek Obrzut"]);

console.log(`Players in the game: ${players.map(player => player.name).join(", ")}\n
=================================\n
🎲 MONOPOLY GAME STARTED! 🎲\n
=================================\n\n`);

let theGame = playTheTurns(players, board, 10); // Set how many turns to play (e.g., 10 turns)