import { markPlayerBankrupt, releasePlayerAssets, transferPlayerAssets } from "./markBankrupt.js";
import { mortgageRules } from "../rules/mortgageRules.js";

export function transferMoneyBetweenPlayers(fromPlayer, toPlayer, amount, game) {
  if (amount <= 0) return;

  if (!fromPlayer) throw new Error("fromPlayer must be a valid player object.");
  if (!toPlayer) throw new Error("toPlayer must be a valid player object.");

  if (fromPlayer.money < amount) {
    const fundsRaised = mortgageRules(game, fromPlayer, amount);
    if (!fundsRaised) {
      markPlayerBankrupt(fromPlayer);
      transferPlayerAssets(fromPlayer, toPlayer, game);
      return;
    }
  }
  fromPlayer.money -= amount;
  if (fromPlayer.money < 0) throw new Error(`${fromPlayer.name} money went negative after transfer`);
  toPlayer.money += amount;
}

export function subtractMoneyFromPlayer(player, amount, game) {
  if (amount <= 0) return;

  if (!player) throw new Error("player must be a valid player object.");

  if (player.money < amount) {
    const fundsRaised = mortgageRules(game, player, amount);
    if (!fundsRaised) {
      markPlayerBankrupt(player);
      releasePlayerAssets(player, game.board);
      return;
    }
  }
  player.money -= amount;
  if (player.money < 0) throw new Error(`${player.name} money went negative after subtraction`);
}
