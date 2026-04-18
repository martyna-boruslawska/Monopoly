import test from "node:test";
import assert from "node:assert/strict";
import { createBoard } from "../game/createBoard.js";
import { isOwnableLocation } from "../game/types.js";
import type {
  PropertyLocation,
  RailroadLocation,
  TaxLocation,
  UtilityLocation,
} from "../game/types.js";

test("createBoard - board has exactly 40 spaces", () => {
  const board = createBoard();
  assert.strictEqual(board.length, 40);
});

test("createBoard - all purchasable locations are initialized with ownerId: null", () => {
  const board = createBoard();
  const purchasableLocations = board.filter(isOwnableLocation);

  assert.ok(purchasableLocations.length > 0);
  assert.ok(purchasableLocations.every(location => location.ownerId === null));
});

test("createBoard - board contains key locations in expected positions", () => {
  const board = createBoard();

  assert.strictEqual(board[0].name, "Start");
  assert.strictEqual(board[0].type, "start");

  const incomeTax = board[4] as TaxLocation;
  assert.strictEqual(incomeTax.name, "Income Tax");
  assert.strictEqual(incomeTax.type, "tax");
  assert.strictEqual(incomeTax.amount, 200);

  assert.strictEqual(board[10].name, "Jail");
  assert.strictEqual(board[10].type, "jail");

  assert.strictEqual(board[30].name, "Go To Jail");
  assert.strictEqual(board[30].type, "go-to-jail");

  const boardwalk = board[39] as PropertyLocation;
  assert.strictEqual(boardwalk.name, "Boardwalk");
  assert.strictEqual(boardwalk.type, "property");
  assert.strictEqual(boardwalk.price, 400);
  assert.strictEqual(boardwalk.rent, 50);
});

test("createBoard - initializes purchasable and property-specific fields correctly", () => {
  const board = createBoard();

  const railroad = board[5] as RailroadLocation;
  const utility = board[12] as UtilityLocation;
  const property = board[1] as PropertyLocation;
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

test("createBoard - creates a fresh board on each call", () => {
  const boardA = createBoard();
  const boardB = createBoard();

  const boardAProperty = boardA[1] as PropertyLocation;
  const boardBProperty = boardB[1] as PropertyLocation;

  boardAProperty.ownerId = 123;
  boardAProperty.houses = 2;

  assert.strictEqual(boardBProperty.ownerId, null);
  assert.strictEqual(boardBProperty.houses, 0);
});
