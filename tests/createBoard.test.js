import test from "node:test";
import assert from "node:assert/strict";
import { createBoard } from "../game/createBoard.js";

test("board has exactly 40 spaces", () => {
  const board = createBoard();
  assert.equal(board.length, 40);
});

test("all purchasable locations are initialized with ownerId: null", () => {
  const board = createBoard();
  const purchasableLocations = board.filter((location) => location.price);

  assert.ok(purchasableLocations.length > 0);
  assert.ok(purchasableLocations.every((location) => location.ownerId === null));
});
