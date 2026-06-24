import { markPlayerBankrupt, releasePlayerAssets } from "../utils/markBankrupt.js";
import { subtractMoneyFromPlayer } from "../utils/transferMoney.js";
import { mortgageRules } from "./mortgageRules.js";

const JAIL_FINE = 50;
const JAIL_TILE_ID = 10;
const MAX_FAILED_JAIL_ROLLS = 3;

export function jailRules(game) {
  const player = game.currentPlayer();
  if (player === null || player === undefined || player.isBankrupt || !player.isInJail) {
    return {
      canMove: true,
      roll: null,
      usedJailRoll: false,
    };
  }

  if (player.getOutOfJailCards.length > 0) {
    const jailCard = player.getOutOfJailCards.shift();
    jailCard.deck.returnCard(jailCard.card);
    releasePlayerFromJail(player);
    console.log(`${player.name} uses a Get Out of Jail Free card.`);
    return { canMove: true, roll: null, usedJailRoll: false };
  }

  if (player.money >= JAIL_FINE) {
    releasePlayerFromJail(player);
    subtractMoneyFromPlayer(player, JAIL_FINE, game);
    console.log(`${player.name} pays $50 to get out of jail.`);

    return {
      canMove: true,
      roll: null,
      usedJailRoll: false,
    };
  }

  const roll = game.rollDice();
  if (roll.isDouble) {
    releasePlayerFromJail(player);
    console.log(`${player.name} rolls doubles and gets out of jail.`);

    return {
      canMove: true,
      roll,
      usedJailRoll: true,
    };
  }

  player.failedJailRolls += 1;
  console.log(`${player.name} fails to roll doubles and remains in jail.`);

  if (player.failedJailRolls < MAX_FAILED_JAIL_ROLLS) {
    return {
      canMove: false,
      roll,
      usedJailRoll: true,
    };
  }

  releasePlayerFromJail(player);

  if (player.money < JAIL_FINE) {
    const fundsRaised = mortgageRules(game, player, JAIL_FINE);
    if (!fundsRaised) {
      markPlayerBankrupt(player);
      releasePlayerAssets(player, game.board);
      return {
        canMove: false,
        roll: null,
        usedJailRoll: true,
      };
    }
  }

  subtractMoneyFromPlayer(player, JAIL_FINE, game);
  console.log(`${player.name} pays $50 to get out of jail.`);

  return {
    canMove: true,
    roll,
    usedJailRoll: true,
  };
}

export function sendCurrentPlayerToJail(game) {
  const player = game.currentPlayer();
  if (player === null || player === undefined) {
    return;
  }

  player.position = JAIL_TILE_ID;
  player.isInJail = true;
  player.failedJailRolls = 0;
}

function releasePlayerFromJail(player) {
  player.isInJail = false;
  player.failedJailRolls = 0;
}
