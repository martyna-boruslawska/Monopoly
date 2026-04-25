import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("landingRules - buys unowned property when player has enough funds", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createTestGame([
    { name: "Luke Skywalker", position: 1 },
    { name: "Darth Vader" }
  ]);
  const tile = game.board[1]; // Mediterranean Avenue: price 60

  landingRules(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer().id);
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [tile.id]);
});

test("landingRules - skips purchase when funds are insufficient", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 100 },
    { name: "Darth Vader" }
  ]);
  const tile = game.board[39]; // Boardwalk: price 400

  landingRules(game);

  assert.strictEqual(tile.ownerId, null);
  assert.strictEqual(game.currentPlayer().money, 100);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});

test("landingRules - buys unowned railroad when player has enough funds", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader" }
  ]);
  const tile = game.board[5]; // Reading Railroad: price 200

  landingRules(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer().id);
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [tile.id]);
});

test("landingRules - buys unowned utility when player has enough funds", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader" }
  ]);
  const tile = game.board[12]; // Electric Company: price 150

  landingRules(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer().id);
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [tile.id]);
});

test("landingRules - skips railroad purchase when funds are insufficient", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5, money: 150 },
    { name: "Darth Vader" }
  ]);
  const tile = game.board[5];

  landingRules(game);

  assert.strictEqual(tile.ownerId, null);
  assert.strictEqual(game.currentPlayer().money, 150);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});
