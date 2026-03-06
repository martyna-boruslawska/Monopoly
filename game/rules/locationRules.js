export const locationRules = {
  handle(players, tile, currentPlayer) {

    this._handleIncomeTax(currentPlayer, tile);
    this._handleBuyProperty(currentPlayer, tile);
    this._handlePayRent(currentPlayer, tile, players);
  },

  _handlePayRent(player, tile, players) {
    if (tile.ownerId !== player.id) {
      const rent = tile.rent || 0;
      if (tile.ownerId == null) return;

      const owner = players.find((p) => p.id === tile.ownerId);
      if (!owner) return;

      player.money -= rent;
      owner.money += rent;
      console.log(`${player.name} pays $${rent} rent to ${owner.name}`);
    }
  },

  _handleBuyProperty(player, tile) {
    if (tile.ownerId === null) {
      const hasPrice = !tile || !tile.price;
      if (hasPrice && tile.ownerId === null) {
        console.log(`${tile.name} is available for $${tile.price}`);
      }

      if (tile.price <= player.money) {
        player.money -= tile.price;
        tile.ownerId = player.id;
        player.properties = player.properties || [];
        player.properties.push(tile.id);
        console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
      }
    }
  },

  _handleIncomeTax(player, tile) {
    if (tile.type === "tax") {
      player.money -= tile.amount; // Deduct tax amount from player's money
      console.log(
        `${player.name} landed on Income Tax and lost $${tile.amount}`,
      );
    }
  },
};
