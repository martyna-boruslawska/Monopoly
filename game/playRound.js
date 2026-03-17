import { rollDice } from "./rollDice.js";
import { movePlayer } from "./movePlayer.js";

export function playRound(players, board) {
  for (const player of players) {
    if (player.isBankrupt) {
      continue;
    }

    executePlayerTurn(player, board, players);
  }
}

function executePlayerTurn(player, board, players) {
  let doublesCount = 0;
  let hasDouble = true;
  while (hasDouble && doublesCount < 3 && !player.isBankrupt) {
    const roll = rollDice();
    movePlayer(player, roll.total, board, players);
    hasDouble = roll.isDouble;
    if (hasDouble) {
      console.log(
        `${player.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`,
      );
      doublesCount++;
    }
  }
}
