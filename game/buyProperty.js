export function buyProperty(player, tile) {
  if (player.money < tile.price) {
    console.log(`${player.name} does not have enough money to buy ${tile.name}.`);
    return;
  }
  player.money -= tile.price;
  tile.owner = player.id;
  player.propertyIds.push(tile.id);
  console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
}  