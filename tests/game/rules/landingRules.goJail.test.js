import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("landingRules - player goes to jail when landing on Go To Jail tile", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 30 }, // Go To Jail tile
    { name: "Darth Vader" }
  ]);
  const player = game.players[0];

  landingRules(game);

  assert.strictEqual(player.isInJail, true);
  assert.strictEqual(player.position, 10); // Jail tile
  assert.strictEqual(player.money, 1500); // No bonus for passing Start when sent to jail
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is sent to jail for landing on Go To Jail.");
});

test("landingRules - player in jail cannot collect rent", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", propertyIds: [1] },
    { name: "Darth Vader", position: 1 }
  ]);
  const playerInJail = game.players[0];
  const otherPlayer = game.players[1];
  playerInJail.isInJail = true;
  game.currentPlayerId = otherPlayer.id;
  
  landingRules(game);

  assert.strictEqual(playerInJail.isInJail, true);
  assert.strictEqual(otherPlayer.money, 1500);
  assert.strictEqual(playerInJail.money, 1500);
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is in jail and cannot collect rent from Darth Vader.");
});
