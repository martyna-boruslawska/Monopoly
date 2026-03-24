import test from "node:test";
import assert from "node:assert/strict";
import { createBoard } from "../game/createBoard.js";

test("board has exactly 40 spaces", () => {
  const board = createBoard();
  assert.strictEqual(board.length, 40);
});

test("all purchasable locations are initialized with ownerId: null", () => {
  const board = createBoard();
  const purchasableLocations = board.filter((location) => location.price);

  assert.ok(purchasableLocations.length > 0);
  assert.ok(purchasableLocations.every((location) => location.ownerId === null));
});

test("board contains key locations in expected positions", () => {
  const board = createBoard();

  assert.strictEqual(board[0].name, "Start");
  assert.strictEqual(board[0].type, "start");

  assert.strictEqual(board[4].name, "Income Tax");
  assert.strictEqual(board[4].type, "tax");
  assert.strictEqual(board[4].amount, 200);

  assert.strictEqual(board[10].name, "Jail");
  assert.strictEqual(board[10].type, "jail");

  assert.strictEqual(board[30].name, "Go To Jail");
  assert.strictEqual(board[30].type, "go-to-jail");

  assert.strictEqual(board[39].name, "Boardwalk");
  assert.strictEqual(board[39].type, "property");
  assert.strictEqual(board[39].price, 400);
  assert.strictEqual(board[39].rent, 50);
});

test("initializes purchasable and property-specific fields correctly", () => {
  const board = createBoard();

  const railroad = board[5];
  const utility = board[12];
  const property = board[1];
  const tax = board[4];

  assert.strictEqual(railroad.ownerId, null);
  assert.strictEqual(utility.ownerId, null);
  assert.strictEqual(property.ownerId, null);

  assert.strictEqual(property.houses, 0);
  assert.strictEqual(property.hasHotel, false);

  assert.strictEqual("houses" in railroad, false);
  assert.strictEqual("hasHotel" in railroad, false);
  assert.strictEqual("houses" in utility, false);
  assert.strictEqual("hasHotel" in utility, false);
  assert.strictEqual("ownerId" in tax, false);
});

test("creates a fresh board on each call", () => {
  const boardA = createBoard();
  const boardB = createBoard();

  boardA[1].ownerId = 123;
  boardA[1].houses = 2;

  assert.strictEqual(boardB[1].ownerId, null);
  assert.strictEqual(boardB[1].houses, 0);
});
