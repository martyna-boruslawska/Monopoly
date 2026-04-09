import test from "node:test";
import assert from "node:assert/strict";
import { locationRules } from "../game/rules/locationRules.js";
import { createTestGame } from "./helpers/createTestGame.js";

test("buys unowned property when player has enough funds", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna" },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[1]; // Mediterranean Avenue: price 60

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(tile.ownerId, player.id);
  assert.equal(player.money, 1500 - tile.price);
  assert.deepStrictEqual(player.propertyIds, [tile.id]);
  assert.strictEqual(game.board[1].ownerId, player.id);
});

test("skips purchase when funds are insufficient", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", money: 100 },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[39]; // Boardwalk: price 400

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(tile.ownerId, null);
  assert.equal(player.money, 100);
  assert.deepStrictEqual(player.propertyIds, []);
  assert.strictEqual(game.board[39].ownerId, null);
});

test("buys unowned railroad when player has enough funds", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna" },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[5]; // Reading Railroad: price 200

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(tile.ownerId, player.id);
  assert.equal(player.money, 1500 - tile.price);
  assert.deepStrictEqual(player.propertyIds, [tile.id]);
  assert.strictEqual(game.board[5].ownerId, player.id);
});

test("skips railroad purchase when funds are insufficient", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", money: 150 },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[5];

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(tile.ownerId, null);
  assert.equal(player.money, 150);
  assert.deepStrictEqual(player.propertyIds, []);
  assert.strictEqual(game.board[5].ownerId, null);
});

test("pays rent to another player", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Luke Skywalker" },
    { name: "Darth Vader", propertyIds: [1] },
  ]);
  const currentPlayer = game.players[0];
  const owner = game.players[1];
  const tile = game.board[1]; // rent 2

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(currentPlayer.money, 1500 - tile.rent);
  assert.equal(owner.money, 1500 + tile.rent);
});

test("pays railroad rent to another player", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna" },
    { name: "Jarek", propertyIds: [5] },
  ]);
  const currentPlayer = game.players[0];
  const owner = game.players[1];
  const tile = game.board[5];

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(currentPlayer.money, 1500 - tile.rent);
  assert.equal(owner.money, 1500 + tile.rent);
});

test("does not pay rent on self-owned properties", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", propertyIds: [1] },
    { name: "Jarek" },
  ]);
  const currentPlayer = game.players[0];
  const tile = game.board[1];

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(currentPlayer.money, 1500);
  assert.equal(game.players[1].money, 1500);
});

test("handles missing owner safely when ownerId does not match any player", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna" },
    { name: "Jarek" },
  ]);
  const currentPlayer = game.players[0];
  const tile = game.board[1];
  tile.ownerId = 999; // Non-existent owner ID

  // Act & Assert
  assert.doesNotThrow(() => locationRules.handle(game, tile));
  assert.equal(currentPlayer.money, 1500);
  assert.ok(!currentPlayer.propertyIds.includes(tile.id));
});

test("applies income tax deduction", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna" },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[4]; // Income Tax: 200

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(player.money, 1500 - tile.amount);
});

test("applies income tax down to zero without marking player bankrupt", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", money: 200 },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[4];

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(player.money, 0);
  assert.equal(player.isBankrupt, false);
});

test("applies luxury tax deduction", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna" },
    { name: "Jarek" },
  ]);
  const player = game.players[0];
  const tile = game.board[38]; // Luxury Tax: 100

  // Act
  locationRules.handle(game, tile);

  // Assert
  assert.equal(player.money, 1500 - tile.amount);
});

test("marks player bankrupt and releases owned properties when money drops below zero", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", money: 50, propertyIds: [1] },
    { name: "Jarek" },
  ]);
  const player = game.players[0];

  const ownedTile = game.board[1];

  const taxTile = game.board[4]; // Income Tax: 200

  // Act
  locationRules.handle(game, taxTile);

  // Assert
  assert.equal(player.isBankrupt, true);
  assert.equal(player.money, -150);
  assert.strictEqual(ownedTile.ownerId, null);
  assert.deepEqual(player.propertyIds, []);
});

test("marks player bankrupt after paying rent and releases owned properties", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", money: 1, propertyIds: [3] },
    { name: "Jarek", propertyIds: [39] },
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];

  const tenantProperty = game.board[3];
  const rentedTile = game.board[39]; // Boardwalk, rent 50

  // Act
  locationRules.handle(game, rentedTile);

  // Assert
  assert.equal(tenant.isBankrupt, true);
  assert.equal(tenant.money, 1 - rentedTile.rent);
  assert.equal(owner.money, 1500 + rentedTile.rent);
  assert.equal(tenantProperty.ownerId, null);
  assert.deepEqual(tenant.propertyIds, []);
});
