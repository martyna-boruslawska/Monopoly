import test from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../game/createGame.js";

test("board has exactly 40 spaces", () => {
  // Arrange & Act
  const game = createGame([]);
  const board = game.board;

  // Assert
  assert.equal(board.length, 40);
});

test("all purchasable locations are initialized with ownerId: null", () => {
  // Arrange & Act
  const game = createGame([]);
  const board = game.board;
  const purchasableLocations = board.filter((location) => location.price);

  // Assert
  assert.ok(purchasableLocations.length > 0);
  assert.ok(purchasableLocations.every((location) => location.ownerId === null));
});

test("board contains key locations in expected positions", () => {
  // Arrange & Act
  const game = createGame([]);
  const board = game.board;

  // Assert
  assert.equal(board[0].name, "Start");
  assert.equal(board[0].type, "start");

  assert.equal(board[4].name, "Income Tax");
  assert.equal(board[4].type, "tax");
  assert.equal(board[4].amount, 200);

  assert.equal(board[10].name, "Jail");
  assert.equal(board[10].type, "jail");

  assert.equal(board[30].name, "Go To Jail");
  assert.equal(board[30].type, "go-to-jail");

  assert.equal(board[39].name, "Boardwalk");
  assert.equal(board[39].type, "property");
  assert.equal(board[39].price, 400);
  assert.equal(board[39].rent, 50);
});

test("initializes purchasable and property-specific fields correctly", () => {
  // Arrange & Act
  const game = createGame([]);
  const board = game.board;

  const railroad = board[5];
  const utility = board[12];
  const property = board[1];
  const tax = board[4];

  // Assert
  assert.equal(railroad.ownerId, null);
  assert.equal(utility.ownerId, null);
  assert.equal(property.ownerId, null);

  assert.equal(property.houses, 0);
  assert.equal(property.hasHotel, false);

  assert.equal("houses" in railroad, false);
  assert.equal("hasHotel" in railroad, false);
  assert.equal("houses" in utility, false);
  assert.equal("hasHotel" in utility, false);
  assert.equal("ownerId" in tax, false);
});

test("creates a fresh board on each call", () => {
  // Arrange & Act
  const gameA = createGame([]);
  const boardA = gameA.board;
  const gameB = createGame([]);
  const boardB = gameB.board;

  boardA[1].ownerId = 123;
  boardA[1].houses = 2;

  // Assert
  assert.equal(boardA[1].ownerId, 123);
  assert.equal(boardA[1].houses, 2);
  assert.equal(boardB[1].ownerId, null);
  assert.equal(boardB[1].houses, 0);
});
