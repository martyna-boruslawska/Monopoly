import { createGame } from "./game/createGame.js";
import { playRound } from "./game/playRound.js";
import { showIntro } from "./game/showIntro.js";
import { showSummary } from "./game/showSummary.js";

const game = createGame(["Martyna", "Jarek"]);

showIntro(game.players);

const numberOfTurns = 10;
for (let turn = 0; turn < numberOfTurns; turn++) {
  playRound(game);
}

showSummary(game.players);
