import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("landingRules - landingRules - pays property rent to another player", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 1 },
    { name: "Darth Vader", propertyIds: [1] }
  ]);

  landingRules(game);

  const tile = game.board[1];
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.rent);
  assert.strictEqual(game.players[1].money, 1500 + tile.rent);
});

test("landingRules - pays railroad rent to another player with 1 railroad owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5] }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 25);
  assert.strictEqual(game.players[1].money, 1500 + 25);
});

test("landingRules - pays railroad rent to another player with 2 railroads owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5, 15] }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 50);
  assert.strictEqual(game.players[1].money, 1500 + 50);
});

test("landingRules - pays railroad rent to another player with 3 railroads owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5, 15, 25] }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 100);
  assert.strictEqual(game.players[1].money, 1500 + 100);
});

test("landingRules - pays railroad rent to another player with 4 railroads owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5, 15, 25, 35] }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 200);
  assert.strictEqual(game.players[1].money, 1500 + 200);
});

test("landingRules - pays utility rent to another player with 1 utility owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader", propertyIds: [12] }
  ]);
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - game.lastRoll.total * 4);
  assert.strictEqual(game.players[1].money, 1500 + game.lastRoll.total * 4);
});

test("landingRules - pays utility rent to another player with 2 utilities owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader", propertyIds: [12, 28] }
  ]);
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - game.lastRoll.total * 10);
  assert.strictEqual(game.players[1].money, 1500 + game.lastRoll.total * 10);
});

test("landingRules - skips utility rent payment when last roll total is unavailable", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader", propertyIds: [12] }
  ]);
  game.lastRoll = null;

  assert.doesNotThrow(() => landingRules(game));
  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("landingRules - does not pay rent on self-owned properties", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 1, propertyIds: [1] },
    { name: "Darth Vader" }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("landingRules - does not pay rent on self-owned railroad", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5, propertyIds: [5] },
    { name: "Darth Vader" }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("landingRules - does not pay rent on self-owned utility", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 12, propertyIds: [12] },
    { name: "Darth Vader" }
  ]);
  game.lastRoll = { dice1: 1, dice2: 2, total: 3, isDouble: false };

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});
