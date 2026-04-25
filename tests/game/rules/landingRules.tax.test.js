import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("landingRules - applies income tax deduction", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4 },
    { name: "Darth Vader" }
  ]);
  const tile = game.board[4]; // Income Tax: 200

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - tile.amount);
});

test("landingRules - applies income tax down to zero without marking player bankrupt", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 200 },
    { name: "Darth Vader" }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 0);
  assert.strictEqual(game.currentPlayer().isBankrupt, false);
});

test("landingRules - applies luxury tax deduction", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 38 },
    { name: "Darth Vader" }
  ]);

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 100);
});
