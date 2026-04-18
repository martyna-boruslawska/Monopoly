import { locationRules } from "./rules/locationRules.js";
import type { Game } from "./types.js";

export function movePlayer(game: Game, steps: number): void {
  const player = game.currentPlayer();
  if (player === null) {
    return;
  }

  const passStart = player.position + steps >= game.board.length;

  player.position = (player.position + steps) % game.board.length;
  const currentSquare = game.board[player.position];

  console.log(`${player.name} moves to ${currentSquare.name}`);

  if (passStart) {
    player.money += 200;
    console.log(`${player.name} passes Start and collects $200`);
  }

  locationRules.handle(game);
}
