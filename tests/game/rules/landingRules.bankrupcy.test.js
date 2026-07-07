import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("landingRules - marks player bankrupt and releases owned assets", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 50, propertyIds: [1] },
    { name: "Darth Vader" }
  ]);
  const ownedTile = game.board[1];

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, true);
  assert.strictEqual(game.currentPlayer().money, 0);
  assert.strictEqual(ownedTile.ownerId, null);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});

test("landingRules - marks player bankrupt after paying rent and transfers owned assets", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 10, propertyIds: [3] },
    { name: "Darth Vader", propertyIds: [39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent 50

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 0);
  assert.strictEqual(owner.money, 1500 + 10 + 30 - 1.1*0.5*game.board[3].price);
  assert.strictEqual(game.board[3].ownerId, owner.id);
  assert.deepStrictEqual(tenant.propertyIds, []);
  assert.deepStrictEqual(owner.propertyIds, [39, 3]);
});
