export function movePlayer(player, steps, board) {
  const passStart = (player.position+steps) >= board.length; 

  player.position = (player.position + steps) % board.length;
  const currentSquare = board[player.position];
  console.log(`${player.name} moves to ${currentSquare.name}`);

  if (passStart) {
    player.money += 200; // Collect $200 when passing Start
    console.log(`${player.name} passes Start and collects $200`);
  }
}