const RAILROAD_RENT = { 1: 25, 2: 50, 3: 100, 4: 200 };

export function calculateRailroadRent(game, tile) {
  const owner = game.players.find((p) => p.id === tile.ownerId);
  const railroadsOwned = game.board.filter(
    (t) => t.type === "railroad" && t.ownerId === owner.id
  ).length;
  return RAILROAD_RENT[railroadsOwned] ?? tile.rent;
}
