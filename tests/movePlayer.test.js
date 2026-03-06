import test from "node:test";
import assert from "node:assert/strict";
import { movePlayer } from "../game/movePlayer.js";
import { createBoard } from "../game/createBoard.js";

test("moves player forward by steps without passing Start", () => {
  const board = createBoard();
  const player = { name: "Luke Skywalker", position: 1, money: 1500, properties: [] };

  movePlayer(player, 2, board);

  assert.equal(player.position, 3);
  assert.equal(player.money, 1500 - 60); // Baltic Avenue's price is 60
});

test("complete move at Start gives $200", () => {
  const board = createBoard();
  const player = { name: "Yoda", position: 31, money: 1500, properties: [] };

  movePlayer(player, 9, board);

  assert.equal(player.position, 0);
  assert.equal(player.money, 1700);
});

test("wraps around board and gives $200 when passing Start", () => {
  const board = createBoard();
  const player = { name: "Obi-Wan", position: 31, money: 1500, properties: [] };

  movePlayer(player, 10, board);

  assert.equal(player.position, 1);
  assert.equal(player.money, 1700 - 60); // Passed Start and landed on Mediterranean Avenue, price is $60
});