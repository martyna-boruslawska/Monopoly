import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createBoard } from "../game/createBoard.js";
import { createPlayers } from "../game/createPlayers.js";

test("skips players who are already bankrupt", (context) => {
  context.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Martyna", "Jarek"]);

  players[0].isBankrupt = true;
  players[0].position = 5;

  const randomValues = [0, 0.2]; // dice: 1 and 2
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(players, board);

  assert.equal(players[0].position, 5);
  assert.equal(players[1].position, 3);
});

test("plays one turn for a non-bankrupt player", (context) => {
  context.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke"]);

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(players, board);

  assert.equal(players[0].position, 3);
});

test("gives another turn after rolling doubles", (context) => {
  context.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke"]);

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(players, board);

  assert.equal(players[0].position, 7);
});

test("stops after three doubles", (context) => {
  context.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke"]);

  const randomValues = [0, 0, 0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(players, board);

  assert.equal(players[0].position, 6);
  assert.equal(index, 6);
});

test("stops extra turns when player becomes bankrupt after a double", (context) => {
  context.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke"]);
  const player = players[0];

  player.position = 36;
  player.money = 50;

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  playRound(players, board);

  assert.equal(player.position, 38);
  assert.equal(player.money, -50);
  assert.equal(player.isBankrupt, true);
  assert.equal(index, 2);
});

