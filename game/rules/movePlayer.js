export function movePlayer(game, steps) {
  const player = game.currentPlayer();
  const passStart = (player.position + steps) >= game.board.length; 

  const oldPosition = player.position;

  // Move player position
  player.position = (player.position + steps) % game.board.length;
  if (!Number.isInteger(player.position) || player.position < 0) {
    throw new Error(`Invalid board position: ${player.position}`);
  }


  const currentSquare = game.board[player.position];

  if (!currentSquare) {
    throw new Error(`Invalid board position: ${player.position}`);
  }

  console.log(`${player.name} moves to ${currentSquare.name}`);

  if (passStart) {
    player.money += 200;
    console.log(`${player.name} passes Start and collects $200`);
  }
}
