import { buyProperty } from "./buyProperty.js";

export function movePlayer(player, steps, board, players) {
  const passStart = (player.position+steps) >= board.length; 

  player.position = (player.position + steps) % board.length;
  const currentSquare = board[player.position];
  console.log(`${player.name} moves to ${currentSquare.name}`);

  if (currentSquare.type === "tax") {
    player.money -= currentSquare.amount; // Deduct tax amount from player's money
    console.log(`${player.name} landed on Income Tax and lost $${currentSquare.amount}`);
  }

  if (currentSquare.price) { // If the square is a property
    if (!currentSquare.owner) { // If the property is unowned
      buyProperty(player, currentSquare);
    }
    
    if (currentSquare.owner && currentSquare.owner !== player.id) { // If the property is owned by another player
      player.money -= currentSquare.rent; // Deduct rent from player's money
      const propertyOwner = players.find((boardPlayer) => boardPlayer.id === currentSquare.owner); // Find the owner of the property
      if (propertyOwner) { // If the owner exists, add rent to their money
        propertyOwner.money += currentSquare.rent;
      }
      console.log(`${player.name} pays $${currentSquare.rent} rent to ${propertyOwner.name}`);
    }
  }

  if (passStart) {
    player.money += 200; // Collect $200 when passing Start
    console.log(`${player.name} passes Start and collects $200`);
  }
}