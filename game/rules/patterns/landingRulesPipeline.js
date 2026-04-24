import { handleGoToJail } from "../handlers/handleGoToJail.js";
import { handlePayRent } from "../handlers/handlePayRent.js";
import { handleBuyOrTrade } from "../handlers/handleBuyOrTrade.js";
import { handlePayTax } from "../handlers/handlePayTax.js";
import { rentStrategies } from "./rentStrategies.js";

// Pipeline of location rules that execute in sequence when activator conditions are met
export const landingRulesPipeline = [
  {
    activator: (tile) => tile.type === "go-to-jail",
    handler: handleGoToJail,
  },
  { activator: (tile) => tile.type === "tax", handler: handlePayTax },
  {
    activator: (tile) => tile.ownerId === null && tile.price,
    handler: handleBuyOrTrade,
  },
  {
    activator: (tile, player) => tile.ownerId && tile.ownerId !== player.id,
    handler: (game) => {
      handlePayRent(game, rentStrategies);
    },
  },
  // Placeholder for chance card handling
  { activator: (tile) => tile.type === "chance", handler: () => {} },
];
