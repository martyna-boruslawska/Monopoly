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

test("landingRules - player in jail can collect rent - property", (ctx) => {
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
  assert.strictEqual(otherPlayer.money, 1500 - 2);
  assert.strictEqual(playerInJail.money, 1500 + 2);
  assert.notStrictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is in jail and cannot collect rent from Darth Vader.");
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Darth Vader pays $2 rent to Luke Skywalker");
});

test("landingRules - player in jail can collect rent - railroad", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", propertyIds: [5] },
    { name: "Darth Vader", position: 5 }
  ]);
  const playerInJail = game.players[0];
  const otherPlayer = game.players[1];
  playerInJail.isInJail = true;
  game.currentPlayerId = otherPlayer.id;
  
  landingRules(game);

  assert.strictEqual(playerInJail.isInJail, true);
  assert.strictEqual(otherPlayer.money, 1500 - 25);
  assert.strictEqual(playerInJail.money, 1500 + 25);
  assert.notStrictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is in jail and cannot collect rent from Darth Vader.");
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Darth Vader pays Luke Skywalker $25 for landing on Reading Railroad (1 railroad owned).");
});

test("landingRules - player in jail can collect rent - utility", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", propertyIds: [12] },
    { name: "Darth Vader", position: 12 }
  ]);
  const playerInJail = game.players[0];
  const otherPlayer = game.players[1];
  playerInJail.isInJail = true;
  game.currentPlayerId = otherPlayer.id;
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  landingRules(game);

  assert.strictEqual(playerInJail.isInJail, true);
  assert.strictEqual(otherPlayer.money, 1500 - game.lastRoll.total * 4);
  assert.strictEqual(playerInJail.money, 1500 + game.lastRoll.total * 4);
  assert.notStrictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is in jail and cannot collect rent from Darth Vader.");
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Darth Vader pays Luke Skywalker $28 for landing on Electric Company (1 utility owned).");
});
