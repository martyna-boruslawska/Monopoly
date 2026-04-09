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
  payToGetOutOfJailIfNeeded(player);

  if (player.inJail) {
    tryToGetOutOfJailByRollingDoubles(player, game);
    return; // End turn if still in jail after attempt to roll doubles
  }

  executeTypicalTurn(player, game);
}

function payToGetOutOfJailIfNeeded(player) {
if (player.inJail) {
  if (player.money >= 50) {
    player.money -= 50; // Pay $50 to get out of jail
    player.inJail = false; // Mark player as no longer in jail
    player.jailTurns = 0; // Reset jail turn counter
    console.log(`${player.name} pays $50 to get out of jail`);
    } else {
      console.log(`${player.name} has to throw doubles to get out of jail`);
    }
  } 
}

function tryToGetOutOfJailByRollingDoubles(player, game) {
  const roll = rollDice();
  const hasDouble = roll.isDouble;

  if (hasDouble) {
    console.log(`${player.name} rolls doubles and gets out of jail.`);
    player.inJail = false;
    player.jailTurns = 0;
    movePlayer(game, roll.total);
  }
  else {
    player.jailTurns++;
    console.log(`${player.name} fails to roll doubles and remains in jail.`);
    if (player.jailTurns >= 3) {
      player.isBankrupt = true; // Mark player as bankrupt if they fail to get out of jail after 3 turns
    }
  }
}

function executeTypicalTurn(player, game) {
  let doublesCount = 0;
  let hasDouble = true;

  while (hasDouble && doublesCount < 3 && !player.isBankrupt) {
    const roll = rollDice();
    game.rollDice = roll; // Store the current roll in the game state for reference in rules
    movePlayer(game, roll.total);

    let tile = game.board[player.position];
    if (player.inJail) {
      break; // End turn if sent to jail
    }

    hasDouble = roll.isDouble;
    if (hasDouble) {
      console.log(
        `${player.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`,
      );
      doublesCount++;
    }
  }
}
