export function markBankruptIfNeeded(game) {
  const player = game.currentPlayer();
  if (player.isBankrupt || player.money >= 0) {
    return;
  }

  markPlayerBankrupt(game, player);
}

export function markPlayerBankrupt(game, player) {
  player.isBankrupt = true;

  for (const tile of game.board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }

  player.propertyIds = [];
  console.log(`${player.name} is bankrupt and out of the game.`);
}
