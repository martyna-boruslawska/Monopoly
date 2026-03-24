import { movePlayer } from "./movePlayer.js";

export function playRound(game) {
  const turnsToPlay = game.countActivePlayers();
  for (let turn = 0; turn < turnsToPlay; turn++) {
    const currentPlayer = game.nextActivePlayer();
    if (!currentPlayer || currentPlayer.isBankrupt) {
      continue;
    }
    game.currentPlayerId = currentPlayer.id;
    executePlayerTurn(game);
  }
}

function executePlayerTurn(game) {
  let doublesCount = 0;
  let hasDouble = true;
  while (hasDouble && doublesCount < 3) {
    const currentPlayer = game.currentPlayer();
    if (currentPlayer == null || currentPlayer.isBankrupt) {
      return;
    }

    const roll = game.rollDice();
    movePlayer(game, roll.total);
    hasDouble = roll.isDouble;
    if (hasDouble) {
      console.log(
        `${currentPlayer.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`,
      );
      doublesCount++;
    }
  }
}
