import { createGame } from "./game/createGame.js";
import { playRound } from "./game/playRound.js";
import { showSummary } from "./game/showSummary.js";
import { showIntro } from "./game/showIntro.js";

const game = createGame(["Martyna", "Jarek"]);

showIntro(game.players);

const numberOfTurns = 10; // You can adjust the number of turns as needed
for (let turn = 0; turn < numberOfTurns; turn++) {
  playRound(game);
}

showSummary(game.players);
