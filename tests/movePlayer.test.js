import test from "node:test";
import assert from "node:assert/strict";
import { movePlayer } from "../game/movePlayer.js";
import { createBoard } from "../game/createBoard.js";
import { createPlayers } from "../game/createPlayers.js";

test("moves player forward by steps without passing Start", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke Skywalker", "Leia"]);
  const player = players[0];
  player.position = 1;

  movePlayer(player, 2, board, players);

  assert.equal(player.position, 3);
  assert.equal(player.money, 1500 - 60); // Baltic Avenue's price is 60
});

test("complete move at Start gives $200", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Yoda", "Mace Windu"]);
  const player = players[0];
  player.position = 31;

  movePlayer(player, 9, board, players);

  assert.equal(player.position, 0);
  assert.equal(player.money, 1700);
});

test("wraps around board and gives $200 when passing Start", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Obi-Wan", "Anakin"]);
  const player = players[0];
  player.position = 31;

  movePlayer(player, 10, board, players);

  assert.equal(player.position, 1);
  assert.equal(player.money, 1700 - 60); // Passed Start and landed on Mediterranean Avenue, price is $60
});

test("lands on the last board tile without wrapping", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke Skywalker", "Leia"]);
  const player = players[0];
  player.position = 37;

  movePlayer(player, 2, board, players);

  assert.equal(player.position, 39);
  assert.equal(player.money, 1500 - 400);
});

test("moving from Start does not collect $200", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  const board = createBoard();
  const players = createPlayers(["Luke Skywalker", "Leia"]);
  const player = players[0];
  player.position = 0;

  movePlayer(player, 3, board, players);

  assert.equal(player.position, 3);
  assert.equal(player.money, 1500 - 60);
});
