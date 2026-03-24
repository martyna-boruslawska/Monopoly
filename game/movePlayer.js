import { locationRules } from "./rules/locationRules.js";

export function movePlayer(game, steps) {
  const passStart = (game.currentPlayer().position+steps) >= game.board.length; 

  // Move player position
  game.currentPlayer().position = (game.currentPlayer().position + steps) % game.board.length;
  const currentSquare = game.board[game.currentPlayer().position];

  console.log(`${game.currentPlayer().name} moves to ${currentSquare.name}`);

  if (passStart) {
    game.currentPlayer().money += 200;
    console.log(`${game.currentPlayer().name} passes Start and collects $200`);
  }

  locationRules.handle(game);
}
