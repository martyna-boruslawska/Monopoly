import { createPlayers } from "./game/createPlayers.js";
import { createBoard } from "./game/createBoard.js";
import { playTheTurns } from "./game/playTheTurns.js";

const board = createBoard();

let players = createPlayers(["Martyna", "Jarek"]);

let theGame = playTheTurns(players, board, 10);