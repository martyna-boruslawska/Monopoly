import test from "node:test";
import assert from "node:assert/strict";
import { movePlayer } from "./movePlayer.js";

const board = [
  { name: "Start" },
  { name: "Mediterranean Avenue" },
  { name: "Baltic Avenue" },
  { name: "Reading Railroad" }
];

test("moves player forward by steps without passing Start", () => {
  const player = { name: "Martyna", position: 1, money: 1500 };

  movePlayer(player, 2, board);

  assert.equal(player.position, 3);
  assert.equal(player.money, 1500);
});

test("wraps around board and gives $200 when passing Start", () => {
  const player = { name: "Jarek", position: 3, money: 1500 };

  movePlayer(player, 2, board);

  assert.equal(player.position, 1);
  assert.equal(player.money, 1700);
});