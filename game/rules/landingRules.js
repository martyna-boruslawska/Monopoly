import { landingRulesPipeline } from "./patterns/landingRulesPipeline.js";

/**
 * Handles the actions that occur when a player lands on a tile, including: 
 * paying rent, buying properties, and handling income tax.
 * @param {Object} game - The game object
 */
export function landingRules(game) {
  for (const landingRulePipelineStep of landingRulesPipeline) {
    const currentPlayer = game.currentPlayer();
    const tile = game.getPlayerTile(currentPlayer);
    
    if (landingRulePipelineStep.activator(tile, currentPlayer)) {
      landingRulePipelineStep.handler(game);
    }

    if(currentPlayer.isInJail || currentPlayer.isBankrupt) {
      return;
    }
  }
}
