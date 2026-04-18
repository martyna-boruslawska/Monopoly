import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createTestGame } from "./helpers/createTestGame.js";

test("skips players who are already bankrupt", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 5 }, { name: "Darth Vader" }]);
  game.players[0].isBankrupt = true;

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[1].position, 3);
});

test("plays one turn for a non-bankrupt player", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker" }]);

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 3);
});

test("gives another turn after rolling doubles", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker" }]);

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 7);
});

test("stops after three doubles", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker" }]);

  const randomValues = [0, 0, 0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 6);
  assert.strictEqual(index, 6);
});

test("stops extra turns when player becomes bankrupt after a double", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 36, money: 50 }]);

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);
  assert.strictEqual(game.players[0].position, 38);
  assert.strictEqual(game.players[0].money, -50);
  assert.strictEqual(game.players[0].isBankrupt, true);
  assert.strictEqual(index, 2);
});

test("skips a jailed player's turn when they cannot pay and fail to roll doubles", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 10, money: 30 }]);
  game.players[0].isInJail = true;

  const randomValues = [0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 10);
  assert.strictEqual(game.players[0].isInJail, true);
  assert.strictEqual(game.players[0].failedJailRolls, 1);
  assert.strictEqual(index, 2);
});

test("uses the jail escape roll to move and does not grant an extra turn", context => {
  context.mock.method(console, "log", () => {});

  const game = createTestGame([{ name: "Luke Skywalker", position: 10, money: 30 }]);
  game.players[0].isInJail = true;

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 12);
  assert.strictEqual(game.players[0].isInJail, false);
  assert.strictEqual(game.players[0].failedJailRolls, 0);
  assert.strictEqual(index, 2);
});
