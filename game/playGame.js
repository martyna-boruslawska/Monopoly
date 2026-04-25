import { showIntro } from "./showIntro.js";
import { playTurn } from "./playTurn.js";
import { showSummary } from "./showSummary.js";

const MAX_ROUNDS = 40;

export function playGame(game) {
  if (!game) throw new Error(`Uninitialized game object: ${game}`);

  showIntro(game.players);

  let round = 1;
  let turns = 1;
  let activePlayers = game.countActivePlayers();

  while (activePlayers > 1) {
    const prevPlayerId = game.currentPlayerId ?? 0;
    const player = game.nextActivePlayer();
    if (!player || player.isBankrupt) {
      continue;
    }
    if (game.currentPlayerId < prevPlayerId) { round++; }
    if (round > MAX_ROUNDS) {
      console.log(`Reached maximum number of rounds: ${MAX_ROUNDS}. Ending game.`);
      break;
    }

    playTurn(game);
    
    activePlayers = game.countActivePlayers();
    turns++;
  }

  showSummary(game.players);
}
