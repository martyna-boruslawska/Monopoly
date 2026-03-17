import { locationRules } from "./rules/locationRules.js";

export function movePlayer(player, steps, board, players) {
  const passStart = (player.position+steps) >= board.length; 

  // Move player position
  player.position = (player.position + steps) % board.length;
  const currentSquare = board[player.position];

  console.log(`${player.name} moves to ${currentSquare.name}`);

  if (passStart) {
    player.money += 200;
    console.log(`${player.name} passes Start and collects $200`);
  }

  locationRules.handle(players, board, currentSquare, player);
}