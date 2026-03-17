import test from "node:test";
import assert from "node:assert/strict";
import { locationRules } from "../game/rules/locationRules.js";
import { createBoard } from "../game/createBoard.js";
import { createPlayers } from "../game/createPlayers.js";

test("buys unowned property when player has enough funds", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const player = players[0];
  const tile = board[1]; // Mediterranean Avenue: price 60

  locationRules.handle(players, board, tile, player);

  assert.equal(tile.ownerId, player.id);
  assert.equal(player.money, 1500 - tile.price);
  assert.deepEqual(player.propertyIds, [tile.id]);
});

test("skips purchase when funds are insufficient", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const player = players[0];
  const tile = board[39]; // Boardwalk: price 400
  player.money = 100;

  locationRules.handle(players, board, tile, player);

  assert.equal(tile.ownerId, null);
  assert.equal(player.money, 100);
  assert.deepEqual(player.propertyIds, []);
});

test("pays rent to another player", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const currentPlayer = players[0];
  const owner = players[1];
  const tile = board[1]; // rent 2
  tile.ownerId = owner.id;

  locationRules.handle(players, board, tile, currentPlayer);

  assert.equal(currentPlayer.money, 1500 - tile.rent);
  assert.equal(owner.money, 1500 + tile.rent);
});

test("does not pay rent on self-owned properties", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const currentPlayer = players[0];
  const tile = board[1];
  tile.ownerId = currentPlayer.id;

  locationRules.handle(players, board, tile, currentPlayer);

  assert.equal(currentPlayer.money, 1500);
  assert.equal(players[1].money, 1500);
});

test("handles missing owner safely when ownerId does not match any player", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const currentPlayer = players[0];
  const tile = board[1];
  tile.ownerId = 999;

  assert.doesNotThrow(() => locationRules.handle(players, board, tile, currentPlayer));
  assert.equal(currentPlayer.money, 1500);
  assert.ok(!currentPlayer.propertyIds.includes(tile.id));
});

test("applies income tax deduction", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const player = players[0];
  const tile = board[4]; // Income Tax: 200

  locationRules.handle(players, board, tile, player);

  assert.equal(player.money, 1500 - tile.amount);
});

test("applies luxury tax deduction", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const player = players[0];
  const tile = board[38]; // Luxury Tax: 100

  locationRules.handle(players, board, tile, player);

  assert.equal(player.money, 1500 - tile.amount);
});

test("marks player bankrupt and releases owned properties when money drops below zero", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const player = players[0];

  const ownedTile = board[1];
  ownedTile.ownerId = player.id;
  player.propertyIds = [ownedTile.id];
  player.money = 50;

  const taxTile = board[4]; // Income Tax: 200

  locationRules.handle(players, board, taxTile, player);

  assert.equal(player.isBankrupt, true);
  assert.equal(player.money, -150);
  assert.equal(ownedTile.ownerId, null);
  assert.deepEqual(player.propertyIds, []);
});

test("marks player bankrupt after paying rent and releases owned properties", () => {
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);
  const tenant = players[0];
  const owner = players[1];

  tenant.money = 1;
  const tenantProperty = board[3];
  tenantProperty.ownerId = tenant.id;
  tenant.propertyIds = [tenantProperty.id];

  const rentedTile = board[39]; // Boardwalk, rent 50
  rentedTile.ownerId = owner.id;

  locationRules.handle(players, board, rentedTile, tenant);

  assert.equal(tenant.isBankrupt, true);
  assert.equal(tenant.money, 1 - rentedTile.rent);
  assert.equal(owner.money, 1500 + rentedTile.rent);
  assert.equal(tenantProperty.ownerId, null);
  assert.deepEqual(tenant.propertyIds, []);
});
