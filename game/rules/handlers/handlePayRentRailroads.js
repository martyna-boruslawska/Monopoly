import { gameUtils } from "../../utils/gameUtils.js";

const RAILROAD_RENT_BY_COUNT = {
  1: 25,
  2: 50,
  3: 100,
  4: 200,
};

export function handlePayRentRailroads(game) {
    const player = game.currentPlayer();
    const tile = gameUtils.getTile(game);
    const owner = gameUtils.getOwner(game);

    const railroadsOwned = countOwnedTiles(game.board, owner.id, "railroad");
    const rent = RAILROAD_RENT_BY_COUNT[railroadsOwned] ?? tile.rent;
    const railroadsLabel = railroadsOwned === 1 ? "railroad" : "railroads";

    transferMoney(player, owner, rent);
    console.log(
        `${player.name} pays ${owner.name} $${rent} for landing on ${tile.name} (${railroadsOwned} ${railroadsLabel} owned).`
    );
}

function transferMoney(fromPlayer, toPlayer, amount) {
  fromPlayer.money -= amount;
  toPlayer.money += amount;
}

function countOwnedTiles(board, ownerId, type) {
  return board.filter((tile) => tile.type === type && tile.ownerId === ownerId).length;
}
