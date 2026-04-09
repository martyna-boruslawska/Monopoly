/**
 * Handles the rules for landing on different types of locations on the board,
 * such as paying rent, buying properties, and handling income tax.
 */
export const locationRules = {
  /**
   * Handles the actions that occur when a player lands on a tile, including:
   * paying rent, buying properties, and handling income tax.
   * @param {Array<Object>} players - The list of all players in the game
   * @param {Object} tile - The tile that the player landed on
   * @param {Object} currentPlayer - The player who landed on the tile
   */

  handle(game, tile) {
    const currentPlayer = game.currentPlayer();
    this._handleTaxLocations(currentPlayer, tile);
    this._markBankruptIfNeeded(currentPlayer, game.board);
    if (currentPlayer.isBankrupt) return;

    this._handleBuyProperty(currentPlayer, tile);
    this._markBankruptIfNeeded(currentPlayer, game.board);
    if (currentPlayer.isBankrupt) return;

    this._handlePayRent(currentPlayer, tile, game.players, game);
    this._markBankruptIfNeeded(currentPlayer, game.board);

    this._handleGoToJail(currentPlayer, tile);
  },

  _markBankruptIfNeeded(player, board) {
    if (player.isBankrupt || player.money >= 0) {
      return;
    }

    player.isBankrupt = true;
    this._releasePlayerProperties(player, board);
    console.log(`${player.name} is bankrupt and out of the game.`);
  },

  _releasePlayerProperties(player, board) {
    for (const tile of board) {
      if (tile.ownerId === player.id) {
        tile.ownerId = null;
      }
    }

    player.propertyIds = [];
  },

  _handlePayRent(player, tile, players, game) {
    let isRentPaymentRequired = false;
    if (tile.type === "utility") {
      isRentPaymentRequired = tile && tile.ownerId != null && tile.ownerId !== player.id;
    } else {
      isRentPaymentRequired = tile && tile.rent && tile.ownerId != null && tile.ownerId !== player.id;
    }
    if (!isRentPaymentRequired) return;

    const owner = players.find((p) => p.id === tile.ownerId);
    if (!owner) return;

    if (owner.inJail) {
      console.log(`${owner.name} is in jail and cannot collect rent from ${player.name}`);
      return;
    }

    const rent = this._calculateRentForTile(game, tile);

    player.money -= rent;
    owner.money += rent;
  },

  _handleBuyProperty(player, tile) {
    const isLocationAvailableForPurchase = tile && tile.ownerId === null && tile.price;
    if (!isLocationAvailableForPurchase) {
      return;
    }

    console.log(`${tile.name} is available for $${tile.price}`);

    if (tile.price > player.money) {
      return;
    }

    player.money -= tile.price;
    tile.ownerId = player.id;
    player.propertyIds = player.propertyIds || [];
    player.propertyIds.push(tile.id);
    console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
  },

  _handleTaxLocations(player, tile) {
    if (tile.type === "tax") {
      player.money -= tile.amount; // Deduct tax amount from player's money
      console.log(
        `${player.name} landed on ${tile.name} and lost $${tile.amount}`,
      );
    }
  },

  _handleGoToJail(player, tile) {
    if (tile.type === "go-to-jail") {
      player.position = 10; // Move player to Jail position
      player.inJail = true; // Mark player as in jail
      player.jailTurns = 0; // Reset jail turn counter
      console.log(`${player.name} is sent to jail for landing on Go To Jail`);
    }
  },

  _calculateRentForTile(game, tile) {
    const playerName = game.currentPlayer().name;
    const owner = game.players.find((p) => p.id === tile.ownerId);
    const ownerName = owner.name;
    let rentAmount = 0;
    let rentMessage = "";

    if (tile.type === "property") {

      rentAmount = tile.rent;
      rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name}`;
    }

    else if (tile.type === "railroad") {

      const railroadsOwned = game.board.filter(
        (t) => t.type === "railroad" && t.ownerId === tile.ownerId,
      ).length;

      switch (railroadsOwned) {
        case 1:
          rentAmount = 25; // Base rent for 1 railroad
          rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name} (${railroadsOwned} railroad owned)`;
          break;

        case 2:
          rentAmount = 50; // Rent doubles with 2 railroads
          rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name} (${railroadsOwned} railroads owned)`;
          break;

        case 3:
          rentAmount = 100; // Rent quadruples with 3 railroads
          rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name} (${railroadsOwned} railroads owned)`;
          break;

        case 4:
          rentAmount = 200; // Rent octuples with 4 railroads
          rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name} (${railroadsOwned} railroads owned)`;
          break;

        default:
          rentAmount = 0; // No rent if owner has no railroads
          rentMessage = `Number of railroads owned by ${ownerName} is improper: ${railroadsOwned}. No rent is due for landing on ${tile.name}`;
          break;
      }
    }

    else if (tile.type === "utility") {

      const diceTotal = game.rollDice.total;
      const utilitiesOwned = game.board.filter(
        (t) => t.type === "utility" && t.ownerId === tile.ownerId,
      ).length;

      switch (utilitiesOwned) {
        case 1:
          rentAmount = diceTotal * 4; // Rent is 4x dice total for 1 utility
          rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name} (${utilitiesOwned} utility owned)`;
          break;

        case 2:
          rentAmount = diceTotal * 10; // Rent is 10x dice total for 2 utilities
          rentMessage = `${playerName} pays ${ownerName} $${rentAmount} for landing on ${tile.name} (${utilitiesOwned} utilities owned)`;
          break;

        default:
          rentAmount = 0; // No rent if owner has no utilities
          rentMessage = `Number of utilities owned by ${ownerName} is improper: ${utilitiesOwned}. No rent is due for landing on ${tile.name}`;
          break;
      }
    }

    console.log(rentMessage);
    return rentAmount;
  }
};
