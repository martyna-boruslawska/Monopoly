import { gameUtils } from "../../utils/gameUtils.js";
import { sendCurrentPlayerToJail } from "../jailRules.js";

/**
 * Handles the "Go To Jail" tile - sends the player to jail if they land on it.
 * @param {Object} game - The game object
 * @returns {boolean} - True if player was sent to jail, false otherwise
 */
export function handleGoToJail(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  if (!tile || tile.type !== "go-to-jail") {
    return false;
  }
  
  console.log(`${player.name} is sent to jail for landing on Go To Jail.`);
  sendCurrentPlayerToJail(game);
  return true;
}
