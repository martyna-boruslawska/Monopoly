import { rollDice } from "./rollDice.js";
import { movePlayer } from "./movePlayer.js";

export function playRound(game) {
  const activePlayers = game.getActivePlayers();  

  for (const player of activePlayers) {
    game.currentPlayerId = player.id; // Set current player for the turn
    executePlayerTurn(player, game);
  }
}

function executePlayerTurn(player, game) {
  let doublesCount = 0;
  let hasDouble = true;
  while (hasDouble && doublesCount < 3 && !player.isBankrupt) {
    const roll = rollDice();
    movePlayer(game, roll.total);
    hasDouble = roll.isDouble;
    if (hasDouble) {
      console.log(
        `${player.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`,
      );
      doublesCount++;
    }
  }
}
