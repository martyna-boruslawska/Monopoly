import test from "node:test";
import assert from "node:assert/strict";
import { buildingRules } from "../../../game/rules/buildingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";
import { truncate } from "node:fs";

test("buildingRules - player with all utilities cannot build on them", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [12, 28] }
  ]);

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual("houses" in game.board[12], false);
  assert.strictEqual("hasHotel" in game.board[12], false);
  assert.strictEqual("houses" in game.board[28], false);
  assert.strictEqual("hasHotel" in game.board[28], false);
});

test("buildingRules - player with all railroads cannot build on them", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [5, 15, 25, 35] }
  ]);

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual("houses" in game.board[5], false);
  assert.strictEqual("hasHotel" in game.board[5], false);
  assert.strictEqual("houses" in game.board[15], false);
  assert.strictEqual("hasHotel" in game.board[15], false);
  assert.strictEqual("houses" in game.board[25], false);
  assert.strictEqual("hasHotel" in game.board[25], false);
  assert.strictEqual("houses" in game.board[35], false);
  assert.strictEqual("hasHotel" in game.board[35], false);
});

test("buildingRules - player without a full street set cannot build", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 18] }
  ]);

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[18].houses, 0);
  assert.strictEqual(game.board[18].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, builds houses evenly", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1000, propertyIds: [21, 23, 24, 39] }
  ]);

  // houseCost = 150, spend cap = 450

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 550);
  assert.strictEqual(game.board[21].houses, 1);
  assert.strictEqual(game.board[21].hasHotel, false);
  assert.strictEqual(game.board[23].houses, 1);
  assert.strictEqual(game.board[23].hasHotel, false);
  assert.strictEqual(game.board[24].houses, 1);
  assert.strictEqual(game.board[24].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, builds hotels evenly after houses", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1200, propertyIds: [31, 32, 34, 39] }
  ]);

  // houseCost = 200, spend cap = 450

  game.board[31].houses = 4;
  game.board[32].houses = 4;
  game.board[34].houses = 3;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 800);
  assert.strictEqual(game.board[31].houses, 0);
  assert.strictEqual(game.board[31].hasHotel, true);
  assert.strictEqual(game.board[32].houses, 4);
  assert.strictEqual(game.board[32].hasHotel, false);
  assert.strictEqual(game.board[34].houses, 4);
  assert.strictEqual(game.board[34].hasHotel, false);
});

test("buildingRules - player with a 2-street set, no houses, no hotel, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, spend cap = 200
  
  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 400);
  assert.strictEqual(game.board[1].houses, 2);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].houses, 2);
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 3-street set, HAS houses, no hotel, no mortgage, starts with lowest building level", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1100, propertyIds: [11, 13, 14, 18] }
  ]);

  // houseCost = 100, spend cap = 450
  game.board[11].houses = 1;
  game.board[13].houses = 1;
  game.board[14].houses = 0;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 700);
  assert.strictEqual(game.board[11].houses, 2);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].houses, 2);
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].houses, 2);  
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 2-street set, no houses, no hotel, HAS mortgage so cannot build", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, but one property in set has mortgage
  game.board[1].isMortgaged = true;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].houses, 0);  
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 2-street set, no houses, set FULLY hotelled, no mortgage, so cannot build", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, but both properties in set have hotel
  game.board[1].hasHotel = true;
  game.board[3].hasHotel = true;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 600);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].houses, 0);  
  assert.strictEqual(game.board[3].hasHotel, true);
});

test("buildingRules - player with a 2-street set, HAS houses, BUYS hotel -> hotel conversion costs houseCost and resets houses to 0", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 600, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, spend cap = 200
  game.board[1].hasHotel = true;
  game.board[3].houses = 4;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 550);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].houses, 0);  
  assert.strictEqual(game.board[3].hasHotel, true);
});

test("buildingRules - player with a 2-street and 3-street set, HAS houses, no hotel, no mortgage, both sets buildable with the same houseCost, starts with first set in board order, then continues with next set", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1600, propertyIds: [1, 3, 6, 8, 9, 18] }
  ]);

  // houseCost = 50, spend cap = 450
  game.board[1].houses = 4;
  game.board[3].houses = 3;

  // houseCost = 50, spend cap = 450
  game.board[6].houses = 0;
  game.board[8].houses = 0;
  game.board[9].houses = 0;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1150);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].houses, 0);  
  assert.strictEqual(game.board[3].hasHotel, true);
  assert.strictEqual(game.board[6].houses, 2);
  assert.strictEqual(game.board[6].hasHotel, false);
  assert.strictEqual(game.board[8].houses, 2);
  assert.strictEqual(game.board[8].hasHotel, false);
  assert.strictEqual(game.board[9].houses, 2);  
  assert.strictEqual(game.board[9].hasHotel, false);
});

test("buildingRules - player with a 2-street and 3-street set, HAS houses, no hotel, one set HAS mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 550, propertyIds: [1, 3, 11, 13, 14, 18] }
  ]);

  // houseCost = 50, but one property in set has mortgage
  game.board[1].houses = 4;
  game.board[3].houses = 3;
  game.board[3].isMortgaged = true;

  // houseCost = 100, spend cap = 200
  game.board[11].houses = 3;
  game.board[13].houses = 3;
  game.board[14].houses = 3;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 350);
  assert.strictEqual(game.board[1].houses, 4);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].houses, 3);  
  assert.strictEqual(game.board[3].hasHotel, false);
  assert.strictEqual(game.board[11].houses, 4);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].houses, 4);
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].houses, 3);  
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 2-street and 3-street set, HAS houses, one set FULLY hotelled, no mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 550, propertyIds: [1, 3, 11, 13, 14, 18] }
  ]);

  // houseCost = 50, but already fully hotelled
  game.board[1].hasHotel = true;
  game.board[3].hasHotel = true;
  
  // houseCost = 100, spend cap = 200
  game.board[11].houses = 3;
  game.board[13].houses = 3;
  game.board[14].houses = 3;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 350);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].houses, 0);
  assert.strictEqual(game.board[3].hasHotel, true);
  assert.strictEqual(game.board[11].houses, 4);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].houses, 4);
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].houses, 3);  
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, has more than 1000, so spend cap 450", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1600, propertyIds: [31, 32, 34, 39] }
  ]);

  // houseCost = 200, spend cap = 450, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1200);
  assert.strictEqual(game.board[31].houses, 1);
  assert.strictEqual(game.board[31].hasHotel, false);
  assert.strictEqual(game.board[32].houses, 1);  
  assert.strictEqual(game.board[32].hasHotel, false);
  assert.strictEqual(game.board[34].houses, 0);  
  assert.strictEqual(game.board[34].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, has exactly 1000, so spend cap 450", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 1000, propertyIds: [6, 8, 9, 18] }
  ]);

  // houseCost = 50, spend cap = 450, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 550);
  assert.strictEqual(game.board[6].houses, 3);
  assert.strictEqual(game.board[6].hasHotel, false);
  assert.strictEqual(game.board[8].houses, 3);  
  assert.strictEqual(game.board[8].hasHotel, false);
  assert.strictEqual(game.board[9].houses, 3);  
  assert.strictEqual(game.board[9].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, has more than 500 but below 1000, so spend cap 200", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 999, propertyIds: [21, 23, 24, 39] }
  ]);

  // houseCost = 150, spend cap = 200, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 849);
  assert.strictEqual(game.board[21].houses, 1);
  assert.strictEqual(game.board[21].hasHotel, false);
  assert.strictEqual(game.board[23].houses, 0);  
  assert.strictEqual(game.board[23].hasHotel, false);
  assert.strictEqual(game.board[24].houses, 0);  
  assert.strictEqual(game.board[24].hasHotel, false);
});

test("buildingRules - player with a 2-street set, no houses, no hotel, no mortgage, has exactly 500, so spend cap 200, can buy one expensive house", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 500, propertyIds: [18, 37, 39] }
  ]);

  // houseCost = 200, spend cap = 200, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 300);
  assert.strictEqual(game.board[37].houses, 1);
  assert.strictEqual(game.board[37].hasHotel, false);
  assert.strictEqual(game.board[39].houses, 0);  
  assert.strictEqual(game.board[39].hasHotel, false);
});

test("buildingRules - player with a 2-street set, HAS houses, no hotel, no mortgage, has exactly 500, so spend cap 200, can buy cheap houses", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 500, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, spend cap = 200, reserve = 300

  game.board[1].houses = 1;
  game.board[3].houses = 1;

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 300);
  assert.strictEqual(game.board[1].houses, 3);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].houses, 3);  
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, started below 500, so buys only once", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 499, propertyIds: [26, 27, 29, 39] }
  ]);

  // houseCost = 150, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 349);
  assert.strictEqual(game.board[26].houses, 1);
  assert.strictEqual(game.board[26].hasHotel, false);
  assert.strictEqual(game.board[27].houses, 0);
  assert.strictEqual(game.board[27].hasHotel, false);
  assert.strictEqual(game.board[29].houses, 0);
  assert.strictEqual(game.board[29].hasHotel, false);
});

test("buildingRules - player with a 2-street set, no houses, no hotel, no mortgage, has exactly 350, so can buy cheap house once", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 350, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 300);
  assert.strictEqual(game.board[1].houses, 1);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].houses, 0);  
  assert.strictEqual(game.board[3].hasHotel, false);
});

test("buildingRules - player with a 3-street set, no houses, no hotel, no mortgage, has exactly 350, so cannot buy expensive house", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 350, propertyIds: [11, 13, 14, 18] }
  ]);

  // houseCost = 100, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 350);
  assert.strictEqual(game.board[11].houses, 0);
  assert.strictEqual(game.board[11].hasHotel, false);
  assert.strictEqual(game.board[13].houses, 0);  
  assert.strictEqual(game.board[13].hasHotel, false);
  assert.strictEqual(game.board[14].houses, 0);  
  assert.strictEqual(game.board[14].hasHotel, false);
});

test("buildingRules - player with a 2-street set, no houses, no hotel, no mortgage, has less than 350, so cannot buy", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 349, propertyIds: [1, 3, 18] }
  ]);

  // houseCost = 50, reserve = 300

  buildingRules(game);

  assert.strictEqual(game.currentPlayer().money, 349);
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].houses, 0);  
  assert.strictEqual(game.board[3].hasHotel, false);
});

