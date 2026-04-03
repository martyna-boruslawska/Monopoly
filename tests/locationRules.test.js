import test from "node:test";
import assert from "node:assert/strict";
import { locationRules } from "../game/rules/locationRules.js";
import { createGame } from "../game/createGame.js";

test("buys unowned property when player has enough funds", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[1]; // Mediterranean Avenue: price 60
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().position = 1;

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer().id);
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [tile.id]);
});

test("skips purchase when funds are insufficient", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[39]; // Boardwalk: price 400
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().money = 100;
  game.currentPlayer().position = 39;

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, null);
  assert.strictEqual(game.currentPlayer().money, 100);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});

test("buys unowned railroad when player has enough funds", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[5]; // Reading Railroad: price 200
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer().id);
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [tile.id]);
});

test("buys unowned utility when player has enough funds", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[12]; // Electric Company: price 150
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().position = 12;

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, game.currentPlayer().id);
  assert.strictEqual(game.currentPlayer().money, 1500 - tile.price);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [tile.id]);
});

test("skips railroad purchase when funds are insufficient", (ctx) => {
  ctx.mock.method(console, "log", () => {});
 
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[5];
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().money = 150;
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(tile.ownerId, null);
  assert.strictEqual(game.currentPlayer().money, 150);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});

test("pays property rent to another player", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  const tile = game.board[1]; // rent 2
  tile.ownerId = owner.id;
  game.currentPlayer().position = 1;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - tile.rent);
  assert.strictEqual(owner.money, 1500 + tile.rent);
});

test("pays railroad rent to another player with 1 railroad owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[5].ownerId = owner.id; // Reading Railroad
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 25);
  assert.strictEqual(owner.money, 1500 + 25);
});

test("pays railroad rent to another player with 2 railroads owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[5].ownerId = owner.id; // Reading Railroad
  game.board[15].ownerId = owner.id; // Pennsylvania Railroad
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 50);
  assert.strictEqual(owner.money, 1500 + 50);
});

test("pays railroad rent to another player with 3 railroads owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[5].ownerId = owner.id; // Reading Railroad
  game.board[15].ownerId = owner.id; // Pennsylvania Railroad
  game.board[25].ownerId = owner.id; // B&O Railroad
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 100);
  assert.strictEqual(owner.money, 1500 + 100);
});

test("pays railroad rent to another player with 4 railroads owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[5].ownerId = owner.id; // Reading Railroad
  game.board[15].ownerId = owner.id; // Pennsylvania Railroad
  game.board[25].ownerId = owner.id; // B&O Railroad
  game.board[35].ownerId = owner.id; // Short Line
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - 200);
  assert.strictEqual(owner.money, 1500 + 200);
});

test("pays utility rent to another player with 1 utility owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[12].ownerId = owner.id; // Electric Company
  game.currentPlayer().position = 12;
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - game.lastRoll.total * 4);
  assert.strictEqual(owner.money, 1500 + game.lastRoll.total * 4);
});

test("pays utility rent to another player with 2 utilities owned", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[12].ownerId = owner.id; // Electric Company
  game.board[28].ownerId = owner.id; // Water Works
  game.currentPlayer().position = 12;
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - game.lastRoll.total * 10);
  assert.strictEqual(owner.money, 1500 + game.lastRoll.total * 10);
});

test("skips utility rent payment when last roll total is unavailable", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const owner = game.players[1];
  game.board[12].ownerId = owner.id;
  game.currentPlayer().position = 12;
  game.lastRoll = null;

  assert.doesNotThrow(() => locationRules.handle(game));
  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(owner.money, 1500);
});

test("does not pay rent on self-owned properties", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const tile = game.board[1];
  tile.ownerId = game.currentPlayer().id;
  game.currentPlayer().position = 1;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("does not pay rent on self-owned railroad", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  game.board[5].ownerId = game.currentPlayer().id;
  game.currentPlayer().position = 5;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("does not pay rent on self-owned utility", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  game.board[12].ownerId = game.currentPlayer().id;
  game.currentPlayer().position = 12;
  game.lastRoll = { dice1: 1, dice2: 2, total: 3, isDouble: false };

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.strictEqual(game.players[1].money, 1500);
});

test("handles missing owner safely when ownerId does not match any player", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const tile = game.board[1];
  tile.ownerId = 999;
  game.currentPlayer().position = 1;

  assert.doesNotThrow(() => locationRules.handle(game));
  assert.strictEqual(game.currentPlayer().money, 1500);
  assert.ok(!game.currentPlayer().propertyIds.includes(tile.id));
});

test("applies income tax deduction", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[4]; // Income Tax: 200
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().position = 4;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - tile.amount);
});

test("applies income tax down to zero without marking player bankrupt", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[4];
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().money = tile.amount;
  game.currentPlayer().position = 4;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 0);
  assert.strictEqual(game.currentPlayer().isBankrupt, false);
});

test("applies luxury tax deduction", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  const tile = game.board[38]; // Luxury Tax: 100
  game.currentPlayerId = game.players[0].id;
  game.currentPlayer().position = 38;

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().money, 1500 - tile.amount);
});

test("marks player bankrupt and releases owned properties when money drops below zero", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  game.currentPlayerId = game.players[0].id;
  const ownedTile = game.board[1];
  ownedTile.ownerId = game.currentPlayer().id;
  game.currentPlayer().propertyIds = [ownedTile.id];
  game.currentPlayer().money = 50;
  game.currentPlayer().position = 4; // Income Tax: 200

  locationRules.handle(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, true);
  assert.strictEqual(game.currentPlayer().money, -150);
  assert.strictEqual(ownedTile.ownerId, null);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});

test("marks player bankrupt after paying rent and releases owned properties", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createGame(["Martyna", "Jarek"]);
  const tenant = game.players[0];
  const owner = game.players[1];
  
  tenant.money = 1;
  const tenantProperty = game.board[3];
  tenantProperty.ownerId = tenant.id;
  tenant.propertyIds = [tenantProperty.id];
  
  const rentedTile = game.board[39]; // Boardwalk, rent 50
  rentedTile.ownerId = owner.id;
  tenant.position = 39;
  game.currentPlayerId = tenant.id;

  locationRules.handle(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 1 - rentedTile.rent);
  assert.strictEqual(owner.money, 1500 + rentedTile.rent);
  assert.strictEqual(tenantProperty.ownerId, null);
  assert.deepStrictEqual(tenant.propertyIds, []);
});
