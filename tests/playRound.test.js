import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createGame } from "../game/createGame.js";

test("skips players who are already bankrupt", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Martyna", "Jarek"]);

  game.players[0].isBankrupt = true;
  game.players[0].position = 5;
  game.currentPlayerId = game.players[0].id; // Set current player to Jarek for the test

  const randomValues = [0, 0.2]; // dice: 1 and 2
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 5);
  assert.equal(game.players[1].position, 3);
});

test("plays one turn for a non-bankrupt player", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 3);
});

test("gives another turn after rolling doubles", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 7);
});

test("stops after three doubles", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test

  const randomValues = [0, 0, 0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 6);
  assert.equal(index, 6);
});

test("stops extra turns when player becomes bankrupt after a double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test
  game.players[0].position = 36;
  game.players[0].money = 50;

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 38);
  assert.equal(game.players[0].money, -50);
  assert.equal(game.players[0].isBankrupt, true);
  assert.equal(index, 2);
});
