import { gameUtils } from "../utils/gameUtils.js";
import { landingRulesPipeline } from "./patterns/landingRulesPipeline.js";
import { markPlayerBankrupt } from '../utils/markPlayerBankrupt.js';

/**
 * Handles the actions that occur when a player lands on a tile, including: 
 * paying rent, buying properties, and handling income tax.
 * @param {Object} game - The game object
 */
export function landingRules(game) {
  for (const landingRulePipelineStep of landingRulesPipeline) {
    const currentPlayer = game.currentPlayer();
    const tile = gameUtils.getTile(game);
    
    if (landingRulePipelineStep.activator(tile, currentPlayer)) {
      landingRulePipelineStep.handler(game);
    }

    if (currentPlayer.money < 0) {
      markPlayerBankrupt(currentPlayer, game.board);
    }

    if(currentPlayer.isInJail || currentPlayer.isBankrupt) {
      return;
    }
  }
}
