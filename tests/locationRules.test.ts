import test from "node:test";
import assert from "node:assert/strict";
import { locationRules } from "../game/rules/locationRules.js";
import { createTestGame } from "./helpers/createTestGame.js";
import type {
  PropertyLocation,
  RailroadLocation,
  TaxLocation,
  UtilityLocation,
} from "../game/types.js";

test("buys unowned property when player has enough funds", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 1 }, { name: "Darth Vader" }]);
  const tile = game.board[1] as PropertyLocation; // Mediterranean Avenue: price 60

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer()!.id);
  assert.strictEqual(game.currentPlayer()!.money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer()!.propertyIds, [tile.id]);
});

test("skips purchase when funds are insufficient", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 100 },
    { name: "Darth Vader" },
  ]);
  const tile = game.board[39] as PropertyLocation; // Boardwalk: price 400

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, null);
  assert.strictEqual(game.currentPlayer()!.money, 100);
  assert.deepStrictEqual(game.currentPlayer()!.propertyIds, []);
});

test("buys unowned railroad when player has enough funds", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 5 }, { name: "Darth Vader" }]);
  const tile = game.board[5] as RailroadLocation; // Reading Railroad: price 200

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer()!.id);
  assert.strictEqual(game.currentPlayer()!.money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer()!.propertyIds, [tile.id]);
});

test("buys unowned utility when player has enough funds", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 12 }, { name: "Darth Vader" }]);
  const tile = game.board[12] as UtilityLocation; // Electric Company: price 150

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer()!.id);
  assert.strictEqual(game.currentPlayer()!.money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer()!.propertyIds, [tile.id]);
});

test("skips railroad purchase when funds are insufficient", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 5, money: 150 },
    { name: "Darth Vader" },
  ]);
  const tile = game.board[5] as RailroadLocation;

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, null);
  assert.strictEqual(game.currentPlayer()!.money, 150);
  assert.deepStrictEqual(game.currentPlayer()!.propertyIds, []);
});

test("pays property rent to another player", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 1 },
    { name: "Darth Vader", propertyIds: [1] },
  ]);

  locationRules.handle(game);

  const tile = game.board[1] as PropertyLocation;
  assert.strictEqual(game.currentPlayer()!.money, 1500 - tile.rent);
  assert.strictEqual(game.players[1].money, 1500 + tile.rent);
});

test("pays railroad rent to another player with 1 railroad owned", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5] },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - 25);
  assert.strictEqual(game.players[1].money, 1500 + 25);
});

test("pays railroad rent to another player with 2 railroads owned", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5, 15] },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - 50);
  assert.strictEqual(game.players[1].money, 1500 + 50);
});

test("pays railroad rent to another player with 3 railroads owned", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5, 15, 25] },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - 100);
  assert.strictEqual(game.players[1].money, 1500 + 100);
});

test("pays railroad rent to another player with 4 railroads owned", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", propertyIds: [5, 15, 25, 35] },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - 200);
  assert.strictEqual(game.players[1].money, 1500 + 200);
});

test("pays utility rent to another player with 1 utility owned", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader", propertyIds: [12] },
  ]);
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - game.lastRoll.total * 4);
  assert.strictEqual(game.players[1].money, 1500 + game.lastRoll.total * 4);
});

test("pays utility rent to another player with 2 utilities owned", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader", propertyIds: [12, 28] },
  ]);
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - game.lastRoll.total * 10);
  assert.strictEqual(game.players[1].money, 1500 + game.lastRoll.total * 10);
});

test("skips utility rent payment when last roll total is unavailable", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 12 },
    { name: "Darth Vader", propertyIds: [12] },
  ]);
  game.lastRoll = null;

  assert.doesNotThrow(() => locationRules.handle(game));
  assert.strictEqual(game.currentPlayer()!.money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("does not pay rent on self-owned properties", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 1, propertyIds: [1] },
    { name: "Darth Vader" },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("does not pay rent on self-owned railroad", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 5, propertyIds: [5] },
    { name: "Darth Vader" },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("does not pay rent on self-owned utility", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 12, propertyIds: [12] },
    { name: "Darth Vader" },
  ]);
  game.lastRoll = { dice1: 1, dice2: 2, total: 3, isDouble: false };

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("handles missing owner safely when ownerId does not match any player", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 1 }, { name: "Darth Vader" }]);
  const tile = game.board[1] as PropertyLocation;
  tile.ownerId = 999;

  assert.doesNotThrow(() => locationRules.handle(game));
  assert.strictEqual(game.currentPlayer()!.money, 1500);
  assert.ok(!game.currentPlayer()!.propertyIds.includes(tile.id));
});

test("applies income tax deduction", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 4 }, { name: "Darth Vader" }]);
  const tile = game.board[4] as TaxLocation; // Income Tax: 200

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - tile.amount);
});

test("applies income tax down to zero without marking player bankrupt", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 200 },
    { name: "Darth Vader" },
  ]);

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 0);
  assert.strictEqual(game.currentPlayer()!.isBankrupt, false);
});

test("applies luxury tax deduction", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 38 }, { name: "Darth Vader" }]);
  const tile = game.board[38] as TaxLocation; // Luxury Tax: 100

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.money, 1500 - tile.amount);
});

test("marks player bankrupt and releases owned properties when money drops below zero", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 50, propertyIds: [1] },
    { name: "Darth Vader" },
  ]);
  const ownedTile = game.board[1] as PropertyLocation;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer()!.isBankrupt, true);
  assert.strictEqual(game.currentPlayer()!.money, -150);
  assert.strictEqual(ownedTile.ownerId, null);
  assert.deepStrictEqual(game.currentPlayer()!.propertyIds, []);
});

test("marks player bankrupt after paying rent and releases owned properties", ctx => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 1, propertyIds: [3] },
    { name: "Darth Vader", propertyIds: [39] },
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39] as PropertyLocation; // Boardwalk, rent 50

  locationRules.handle(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 1 - rentedTile.rent);
  assert.strictEqual(owner.money, 1500 + rentedTile.rent);
  assert.strictEqual((game.board[3] as PropertyLocation).ownerId, null);
  assert.deepStrictEqual(tenant.propertyIds, []);
});
