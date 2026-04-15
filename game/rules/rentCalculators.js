const RAILROAD_RENT_BY_COUNT = { 1: 25, 2: 50, 3: 100, 4: 200 };
const UTILITY_MULTIPLIER_BY_COUNT = { 1: 4, 2: 10 };

export const rentCalculators = {
  railroad(game, tile, owner) {
    const railroadsOwned = game.board.filter(
      (t) => t.type === "railroad" && t.ownerId === owner.id
    ).length;
    const rent = RAILROAD_RENT_BY_COUNT[railroadsOwned] ?? tile.rent;
    const label = railroadsOwned === 1 ? "railroad" : "railroads";

    game.currentPlayer().money -= rent;
    owner.money += rent;
    console.log(
      `${game.currentPlayer().name} pays ${owner.name} $${rent} for landing on ${tile.name} (${railroadsOwned} ${label} owned).`
    );
  },

  utility(game, tile, owner) {
    const diceRollTotal = game.lastRoll && game.lastRoll.total;
    if (typeof diceRollTotal !== "number") {
      console.log(
        `Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`
      );
      return;
    }

    const utilitiesOwned = game.board.filter(
      (t) => t.type === "utility" && t.ownerId === owner.id
    ).length;
    const multiplier = UTILITY_MULTIPLIER_BY_COUNT[utilitiesOwned] ?? UTILITY_MULTIPLIER_BY_COUNT[1];
    const rent = diceRollTotal * multiplier;
    const label = utilitiesOwned === 1 ? "utility" : "utilities";

    game.currentPlayer().money -= rent;
    owner.money += rent;
    console.log(
      `${game.currentPlayer().name} pays ${owner.name} $${rent} for landing on ${tile.name} (${utilitiesOwned} ${label} owned).`
    );
  },

  property(game, tile, owner) {
    const rent = tile.rent;
    game.currentPlayer().money -= rent;
    owner.money += rent;
    console.log(
      `${game.currentPlayer().name} pays $${rent} rent to ${owner.name}`
    );
  },
};
