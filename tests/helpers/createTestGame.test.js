import test from "node:test";
import assert from "node:assert/strict";
import { createTestGame } from "./createTestGame.js";

test("creates a game with provided player setup and ownership on the board", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 7, money: 900, propertyIds: [1, 5] },
    { name: "Darth Vader", position: 12, money: 1200, propertyIds: [12] },
  ]);

  assert.deepStrictEqual(game.players, [
    { id: 1, name: "Luke Skywalker", position: 7, money: 900, propertyIds: [1, 5], isBankrupt: false, isInJail: false, failedJailRolls: 0, getOutOfJailCards: [] },
    { id: 2, name: "Darth Vader", position: 12, money: 1200, propertyIds: [12], isBankrupt: false, isInJail: false, failedJailRolls: 0, getOutOfJailCards: [] },
  ]);
  assert.strictEqual(game.board[1].ownerId, 1);
  assert.strictEqual(game.board[5].ownerId, 1);
  assert.strictEqual(game.board[12].ownerId, 2);
  assert.strictEqual(game.currentPlayerId, 1);
  assert.deepStrictEqual(game.currentPlayer(), game.players[0]);
});

test("copies propertyIds input without keeping a mutable reference", () => {
  const propertyIds = [1, 3];
  const game = createTestGame([
    { name: "Luke Skywalker", propertyIds },
    { name: "Darth Vader" },
  ]);

  propertyIds.push(5);

  assert.deepStrictEqual(game.players[0].propertyIds, [1, 3]);
  assert.strictEqual(game.board[1].ownerId, 1);
  assert.strictEqual(game.board[3].ownerId, 1);
  assert.strictEqual(game.board[5].ownerId, null);
});

test("applies zero money overrides instead of falling back to defaults", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 0 },
    { name: "Darth Vader" },
  ]);

  assert.strictEqual(game.players[0].money, 0);
  assert.strictEqual(game.players[1].money, 1500);
});

test("throws on unknown property ids instead of silently ignoring them", () => {
  assert.throws(
    () => createTestGame([
      { name: "Luke Skywalker", propertyIds: [999] },
      { name: "Darth Vader" },
    ]),
    /Unknown property id: 999/,
  );
});

test("throws when a property id is assigned to multiple players", () => {
  assert.throws(
    () => createTestGame([
      { name: "Luke Skywalker", propertyIds: [5] },
      { name: "Darth Vader", propertyIds: [5] },
    ]),
    /Duplicate property id assignment: 5/,
  );
});

test("throws when a player is assigned the same property id twice", () => {
  assert.throws(
    () => createTestGame([
      { name: "Luke Skywalker", propertyIds: [5, 5] },
      { name: "Darth Vader" },
    ]),
    /Duplicate property id assignment: 5/,
  );
});

test("throws when assigning a non-ownable tile", () => {
  assert.throws(
    () => createTestGame([
      { name: "Luke Skywalker", propertyIds: [0] },
      { name: "Darth Vader" },
    ]),
    /Tile 0 is not ownable/,
  );
});