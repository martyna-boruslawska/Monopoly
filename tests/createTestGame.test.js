import test from "node:test";
import assert from "node:assert/strict";
import { createTestGame } from "./helpers/createTestGame.js";

test("creates a valid game through createGame and sets the first player as current", () => {
  const game = createTestGame([
    { name: "Luke Skywalker" },
    { name: "Darth Vader" },
  ]);

  assert.equal(typeof game.currentPlayer, "function");
  assert.equal(game.players.length, 2);
  assert.equal(game.board.length, 40);
  assert.equal(game.currentPlayerId, game.players[0].id);
});

test("applies position, money, and property overrides to players", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 200 },
    { name: "Darth Vader", position: 4, money: 1300, propertyIds: [39] },
  ]);

  assert.equal(game.players[0].position, 39);
  assert.equal(game.players[0].money, 200);
  assert.equal(game.players[1].position, 4);
  assert.equal(game.players[1].money, 1300);
  assert.deepEqual(game.players[1].propertyIds, [39]);
});

test("synchronizes board ownership for player propertyIds", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 200 },
    { name: "Darth Vader", propertyIds: [39] },
    { name: "Han Solo", position: 4, money: 1300 },
  ]);

  assert.equal(game.board[39].ownerId, game.players[1].id);
});

test("preserves explicit zero values in overrides", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 0, money: 0, propertyIds: [] },
    { name: "Darth Vader" },
  ]);

  assert.equal(game.players[0].position, 0);
  assert.equal(game.players[0].money, 0);
  assert.deepEqual(game.players[0].propertyIds, []);

  assert.equal(game.players[1].position, 0);
  assert.equal(game.players[1].money, 1500);
  assert.deepEqual(game.players[1].propertyIds, []);
});

test("fails fast when test fixture assigns the same property to multiple players", () => {
  assert.throws(
    () =>
      createTestGame([
        { name: "Luke Skywalker", propertyIds: [39] },
        { name: "Darth Vader", propertyIds: [39] },
      ]),
    {
      name: "AssertionError",
      message:
        "Property 39 is assigned to multiple players: Luke Skywalker and Darth Vader.",
    },
  );
});

test("fails fast when test fixture gives one player duplicate propertyIds", () => {
  assert.throws(
    () =>
      createTestGame([
        { name: "Luke Skywalker", propertyIds: [39, 39] },
        { name: "Darth Vader" },
      ]),
    {
      name: "AssertionError",
      message: "Player Luke Skywalker has duplicate propertyId 39.",
    },
  );
});

test("fails fast when test fixture references a non-existent board location", () => {
  assert.throws(
    () =>
      createTestGame([
        { name: "Luke Skywalker", propertyIds: [999] },
        { name: "Darth Vader" },
      ]),
    {
      name: "AssertionError",
      message: "Property 999 does not exist on the board.",
    },
  );
});

test("fails fast when test fixture references board length as a propertyId", () => {
  assert.throws(
    () =>
      createTestGame([
        { name: "Luke Skywalker", propertyIds: [40] },
        { name: "Darth Vader" },
      ]),
    {
      name: "AssertionError",
      message: "Property 40 does not exist on the board.",
    },
  );
});

test("fails fast when test fixture references a non-ownable board location", () => {
  assert.throws(
    () =>
      createTestGame([
        { name: "Luke Skywalker", propertyIds: [4] },
        { name: "Darth Vader" },
      ]),
    {
      name: "AssertionError",
      message: "Location 4 (Income Tax) cannot be assigned to a player.",
    },
  );
});