export function calculateUtilityRent(game, tile) {
  const diceRollTotal = game.lastRoll && game.lastRoll.total;
  if (typeof diceRollTotal !== "number") return null;
  const owner = game.players.find((p) => p.id === tile.ownerId);
  const utilitiesOwned = game.board.filter(
    (t) => t.type === "utility" && t.ownerId === owner.id
  ).length;
  return utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;
}
