import { movePlayer } from "./rules/movePlayer.js";
import { jailRules } from "./rules/jailRules.js";
import { landingRules } from './rules/landingRules.js';
import { sendCurrentPlayerToJail } from "./rules/jailRules.js";

export function playTurn(game) {
  let doublesCount = 0;
  let hasDouble = true;
  while (hasDouble && doublesCount < 3) {
    const player = game.currentPlayer();
    if (!player || player.isBankrupt) {
      return;
    }

    const jailResult = jailRules(game);
    if (!jailResult.canMove) {
      return;
    }

    const roll = jailResult.roll ?? game.rollDice();
    game.lastRoll = roll;

    hasDouble = roll.isDouble && !jailResult.usedJailRoll;
    if (hasDouble) {
      doublesCount++;
    }
    if (doublesCount === 3) {
      console.log(`${player.name} rolled doubles three times in a row and goes to jail!`,);
      sendCurrentPlayerToJail(game);
      return true;
    }

    movePlayer(game, roll.total);

    landingRules(game);

    if (!player || player.isBankrupt || player.isInJail) {
      return;
    }

    if (hasDouble) {
      console.log(`${player.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`);
    }  
  }
}
