import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createBoard } from "../game/createBoard.js";
import { createPlayers } from "../game/createPlayers.js";

test("skips players who are already bankrupt", (context) => {
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
