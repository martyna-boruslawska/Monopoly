import test from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../game/createGame.js";

test("initializes game with correct number of players", () => {
  // Arrange
  const playerNames = ["Alice", "Bob", "Charlie"];
  const game = createGame(playerNames);

  // Assert
  assert.strictEqual(game.players.length, playerNames.length);
});

test("initializes board with 40 spaces", () => {
  // Arrange
  const game = createGame(["Alice", "Bob"]);

  // Assert
  assert.strictEqual(game.board.length, 40);
});

test("currentPlayerId is initially null", () => {
  // Arrange
  const game = createGame(["Alice", "Bob"]);
  
  // Assert
  assert.strictEqual(game.currentPlayerId, null);
});

test("currentPlayer() returns null when currentPlayerId is null", () => {
  // Arrange
  const game = createGame(["Alice", "Bob"]);

  // Assert
  assert.strictEqual(game.currentPlayer(), null);
});

test("nextActivePlayer() sets currentPlayerId to first player on first call", () => {
  // Arrange
  const game = createGame(["Alice", "Bob"]);
  
  // Act
  const nextPlayer = game.nextActivePlayer();

  // Assert
  assert.strictEqual(nextPlayer.name, "Alice");
  assert.strictEqual(game.currentPlayerId, nextPlayer.id);
});

test("nextActivePlayer() cycles through active players", () => {
  // Arrange
  const game = createGame(["Alice", "Bob", "Charlie"]);

  // Act
  game.nextActivePlayer();
  game.nextActivePlayer();
  const thirdPlayer = game.nextActivePlayer();

  // Assert
  assert.strictEqual(game.currentPlayerId, thirdPlayer.id);
});

test("countActivePlayers() returns correct count", () => {
  // Arrange
  const game = createGame(["Alice", "Bob", "Charlie"]);
  assert.strictEqual(game.countActivePlayers(), 3);
  
  // Act
  game.players[0].isBankrupt = true;

  // Assert
  assert.strictEqual(game.countActivePlayers(), 2);
});

test("getActivePlayers() returns only active players", () => {
  // Arrange
  const game = createGame(["Alice", "Bob", "Charlie"]);

  // Act
  game.players[0].isBankrupt = true;
  const activePlayers = game.getActivePlayers();  

  // Assert
  assert.strictEqual(activePlayers.length, 2);    
  assert.strictEqual(activePlayers[0].name, "Bob");
  assert.strictEqual(activePlayers[1].name, "Charlie");
});

test("nextActivePlayer() skips bankrupt players", () => {
  // Arrange
  const game = createGame(["Alice", "Bob", "Charlie"]);

  // Act
  game.players[1].isBankrupt = true; // Bob is bankrupt
  game.nextActivePlayer(); // Alice
  const secondPlayer = game.nextActivePlayer(); // Should skip Bob and go to Charlie

  // Assert
  assert.strictEqual(secondPlayer.name, "Charlie");
});

test("handles empty player list", () => {
  // Arrange
  const game = createGame([]);
  
  // Assert
  assert.strictEqual(game.players.length, 0);
  assert.strictEqual(game.currentPlayerId, null);
  assert.strictEqual(game.nextActivePlayer(), null);
});
