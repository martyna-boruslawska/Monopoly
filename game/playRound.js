import { rollDice } from "./rollDice.js";
import { movePlayer } from "./movePlayer.js";

export function playRound(players, board) {
  for (const player of players) {
    executePlayerTurn(player, board);
  }
}

function executePlayerTurn(player, board) {
  let doublesCount = 0;
  let hasDouble = true;
  while (hasDouble && doublesCount < 3) {
    const roll = rollDice();
    movePlayer(player, roll.total, board);
    hasDouble = roll.isDouble;
    if (hasDouble) {
      console.log(
        `${player.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`,
      );
      doublesCount++;
    }
  }
}
