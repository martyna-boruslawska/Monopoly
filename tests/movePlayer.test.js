import test from "node:test";
import assert from "node:assert/strict";
import { movePlayer } from "../game/movePlayer.js";
import { createTestGame } from "./helpers/createTestGame.js";

test("moves player forward by steps without passing Start", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Luke Skywalker", position: 1 },
    { name: "Leia" },
  ]);

  // Act
  movePlayer(game, 2);

  // Assert
  assert.equal(game.players[0].position, 3);
  assert.equal(game.players[0].money, 1500 - 60); // Baltic Avenue's price is 60
  assert.deepStrictEqual(game.players[0].propertyIds, [3]); // Should own Baltic Avenue (id: 3)
});

test("complete move at Start gives $200", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Yoda", position: 31 },
    { name: "Mace Windu" },
  ]);

  // Act
  movePlayer(game, 9);

  // Assert
  assert.equal(game.players[0].position, 0);
  assert.equal(game.players[0].money, 1500 + 200); // Passed Start and collected $200
});

test("wraps around board and gives $200 when passing Start", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Obi-Wan", position: 31 },
    { name: "Anakin" },
  ]);

  // Act
  movePlayer(game, 10);

  // Assert
  assert.equal(game.players[0].position, 1);
  assert.equal(game.players[0].money, 1700 - 60); // Passed Start and landed on Mediterranean Avenue and buy it for $60
  assert.deepStrictEqual(game.players[0].propertyIds, [1]); // Should own Mediterranean Avenue (id: 1)
});

test("lands on the last board tile without wrapping", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Luke Skywalker", position: 37 },
    { name: "Leia" },
  ]);

  // Act
  movePlayer(game, 2);

  // Assert
  assert.equal(game.players[0].position, 39);
  assert.equal(game.players[0].money, 1500 - 400);
  assert.deepStrictEqual(game.players[0].propertyIds, [39]); // Should own Boardwalk (id: 39)
});

test("moving from Start does not collect $200", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Luke Skywalker" },
    { name: "Leia" },
  ]);

  // Act
  movePlayer(game, 3);

  // Assert
  assert.equal(game.players[0].position, 3);
  assert.equal(game.players[0].money, 1500 - 60);
  assert.deepStrictEqual(game.players[0].propertyIds, [3]); // Should own Baltic Avenue (id: 3)
});

test("landing on Go to Jail does not collect $200 when passing Start", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Luke Skywalker", position: 28 },
    { name: "Leia" },
  ]);

  // Act
  movePlayer(game, 2); // Move 2 steps to land on Go to Jail (id: 30)

  // Assert
  assert.equal(game.players[0].money, 1500);
});

test("landing on Go to Jail moves player to Jail", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Luke Skywalker", position: 28 },
    { name: "Leia" },
  ]);

  // Act
  movePlayer(game, 2); // Move 2 steps to land on Go to Jail (id: 30)

  // Assert
  assert.equal(game.players[0].position, 10); // Jail position
});

test("logs a message when a player is sent to jail", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Vader", position: 28 },
    { name: "Leia" },
  ]);

  // Act
  movePlayer(game, 2); // Move 2 steps to land on Go to Jail (id: 30)

  // Assert
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
});
