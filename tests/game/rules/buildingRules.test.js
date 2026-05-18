import test from "node:test";
import assert from "node:assert/strict";
import { buildingRules } from "../../../game/rules/buildingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("buildingRules - player without a street monopoly", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 18] }
  ]);

  // no full set owned, so no houses can be bought
  game.board[1].houses = 0;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = false;
  game.board[18].houses = 0;
  game.board[18].hasHotel = false;
  game.board[18].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[18].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[18].hasHotel, false);
});

test("buildingRules - player with a 2-street monopoly, no houses, no hotel, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, spend cap = 200
  game.board[1].houses = 0;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = false;
  game.board[3].houses = 0;
  game.board[3].hasHotel = false;
  game.board[3].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 400);
  assert.strictEqual(game.board[1].houses, 2);
  assert.strictEqual(game.board[3].houses, 2);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 3-street monopoly, no houses, no hotel, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1100, propertyIds: [6, 8, 9, 18] }
  ]);

  // houseCost = 50, spend cap = 450
  game.board[6].houses = 0;
  game.board[6].hasHotel = false;
  game.board[6].isMortgaged = false;
  game.board[8].houses = 0;
  game.board[8].hasHotel = false;
  game.board[8].isMortgaged = false;
  game.board[9].houses = 0;
  game.board[9].hasHotel = false;
  game.board[9].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 650);
  assert.strictEqual(game.board[6].houses, 3);
  assert.strictEqual(game.board[8].houses, 3);
  assert.strictEqual(game.board[9].houses, 3);
  assert.strictEqual(game.board[6].hasHotel, false);
  assert.strictEqual(game.board[8].hasHotel, false);
  assert.strictEqual(game.board[9].hasHotel, false);
});

test("buildingRules - player with a 3-street monopoly, HAS houses, no hotel, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1100, propertyIds: [11, 13, 14, 18] }
  ]);

  // houseCost = 100, spend cap = 450
  game.board[11].houses = 1;
  game.board[11].hasHotel = false;
  game.board[11].isMortgaged = false;
  game.board[13].houses = 2;
  game.board[13].hasHotel = false;
  game.board[13].isMortgaged = false;
  game.board[14].houses = 0;
  game.board[14].hasHotel = false;
  game.board[14].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 700);
  assert.strictEqual(game.board[11].houses, 3);
  assert.strictEqual(game.board[13].houses, 2);
  assert.strictEqual(game.board[14].houses, 2);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 2-street monopoly, no houses, no hotel, HAS mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, but one property in set has mortgage, so no houses can be bought in this set
  game.board[1].houses = 0;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = true;
  game.board[3].houses = 0;
  game.board[3].hasHotel = false;
  game.board[3].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[3].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 2-street and 3-street monopoly, HAS houses, BUYS hotel, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 6, 8, 9, 18] }
  ]);

  // 2-street monopoly:houseCost = 50, spend cap = 200, chooses first set in board order, so buys only on 2-street monopoly
  // 3-street monopoly: houseCost = 50
  game.board[1].houses = 1;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = false;
  game.board[3].houses = 4;
  game.board[3].hasHotel = false;
  game.board[3].isMortgaged = false;

  game.board[6].houses = 1;
  game.board[6].hasHotel = false;
  game.board[6].isMortgaged = false;
  game.board[8].houses = 2;
  game.board[8].hasHotel = false;
  game.board[8].isMortgaged = false;
  game.board[9].houses = 0;
  game.board[9].hasHotel = false;
  game.board[9].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 400);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[3].houses, 4);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].hasHotel, false);
  assert.strictEqual(game.board[6].houses, 1);
  assert.strictEqual(game.board[8].houses, 2);
  assert.strictEqual(game.board[9].houses, 0);
  assert.strictEqual(game.board[6].hasHotel, false);
  assert.strictEqual(game.board[8].hasHotel, false);
  assert.strictEqual(game.board[9].hasHotel, false);
});

test("buildingRules - player with a 2-street and 3-street monopoly, HAS houses, no hotel, one set HAS mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 550, propertyIds: [1, 3, 11, 13, 14, 18] }
  ]);

  // 2-street monopoly: houseCost = 50, but one property in set has mortgage, so no houses can be bought in this set
  // 3-street monopoly: houseCost = 100, spend cap = 200, no mortgage, so buys only on 3-street monopoly
  game.board[1].houses = 4;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = false;
  game.board[3].houses = 3;
  game.board[3].hasHotel = false;
  game.board[3].isMortgaged = true;

  game.board[11].houses = 4;
  game.board[11].hasHotel = false;
  game.board[11].isMortgaged = false;
  game.board[13].houses = 3;
  game.board[13].hasHotel = false;
  game.board[13].isMortgaged = false;
  game.board[14].houses = 0;
  game.board[14].hasHotel = false;
  game.board[14].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 350);
  assert.strictEqual(game.board[1].houses, 4);
  assert.strictEqual(game.board[3].houses, 3);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].hasHotel, false);
  assert.strictEqual(game.board[11].houses, 4);
  assert.strictEqual(game.board[13].houses, 3);
  assert.strictEqual(game.board[14].houses, 2);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 2-street and 3-street monopoly, HAS houses, one set FULLY hotelled, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 550, propertyIds: [1, 3, 11, 13, 14, 18] }
  ]);

  // 2-street monopoly: houseCost = 50, but already fully hotelled, so no houses can be bought in this set
  // 3-street monopoly: houseCost = 100, spend cap = 200, no mortgage, so buys only on 3-street monopoly
  game.board[1].houses = 0;
  game.board[1].hasHotel = true;
  game.board[1].isMortgaged = false;
  game.board[3].houses = 0;
  game.board[3].hasHotel = true;
  game.board[3].isMortgaged = false;

  game.board[11].houses = 4;
  game.board[11].hasHotel = false;
  game.board[11].isMortgaged = false;
  game.board[13].houses = 3;
  game.board[13].hasHotel = false;
  game.board[13].isMortgaged = false;
  game.board[14].houses = 0;
  game.board[14].hasHotel = false;
  game.board[14].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 350);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[3].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].hasHotel, true);
  assert.strictEqual(game.board[11].houses, 4);
  assert.strictEqual(game.board[13].houses, 3);
  assert.strictEqual(game.board[14].houses, 2);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 2-street monopoly, no houses, no hotel, no mortgage, reaches reserve", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 460, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, reserve = 300
  // player needs to keep reserve = 300 after buying
  game.board[1].houses = 0;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = false;
  game.board[3].houses = 0;
  game.board[3].hasHotel = false;
  game.board[3].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 310);
  assert.strictEqual(game.board[1].houses, 2);
  assert.strictEqual(game.board[3].houses, 1);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 2-street monopoly, no houses, no hotel, no mortgage, too poor to buy", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 340, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, reserve = 300
  // player needs to keep reserve = 300 after buying
  game.board[1].houses = 0;
  game.board[1].hasHotel = false;
  game.board[1].isMortgaged = false;
  game.board[3].houses = 0;
  game.board[3].hasHotel = false;
  game.board[3].isMortgaged = false;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 340);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[3].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].hasHotel, false);
});
