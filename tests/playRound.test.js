import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createGame } from "../game/createGame.js";

test("skips players who are already bankrupt", (context) => {
  context.mock.method(console, "log", () => {});
  const game = createGame(["Martyna", "Jarek"]);

  game.players[0].isBankrupt = true;
  game.players[0].position = 5;

  const randomValues = [0, 0.2]; // dice: 1 and 2
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[1].position, 3);
});

test("plays one turn for a non-bankrupt player", (context) => {
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 3);
});

test("gives another turn after rolling doubles", (context) => {
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 7);
});

test("stops after three doubles", (context) => {
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);

  const randomValues = [0, 0, 0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);

  assert.strictEqual(game.players[0].position, 6);
  assert.strictEqual(index, 6);
});

test("stops extra turns when player becomes bankrupt after a double", (context) => {
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  const player = game.players[0];

  player.position = 36;
  player.money = 50;

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(game);
  assert.strictEqual(player.position, 38);
  assert.strictEqual(player.money, -50);
  assert.strictEqual(player.isBankrupt, true);
  assert.strictEqual(index, 2);
});
