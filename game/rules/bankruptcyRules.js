export function markPlayerBankrupt(game, player) {
  player.isBankrupt = true;
  _releasePlayerProperties(game, player);
  console.log(`${player.name} is bankrupt and out of the game.`);
}

export function markBankruptIfNeeded(game) {
  const player = game.currentPlayer();
  if (player.isBankrupt || player.money >= 0) return;
  markPlayerBankrupt(game, player);
}

function _releasePlayerProperties(game, player) {
  for (const tile of game.board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }
  player.propertyIds = [];
}
