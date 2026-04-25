import test from "node:test";
import assert from "node:assert/strict";
import { gameUtils, getPlayerTile } from "../../../game/utils/gameUtils.js";
import { createTestGame } from "../../helpers/createTestGame.js";
import { createBoard } from "../../../game/factories/createBoard.js";

test("getPlayerTile - returns the tile for valid player", () => {
  // Arrange
  const game = createTestGame([
    { name: "Luke Skywalker", position: 30 }, // Go To Jail tile
    { name: "Darth Vader", position: 12 },
    { name: "Leia Organa", position: 0 },
  ]);

  // Act
  const tileLuke = getPlayerTile(game.players[0], game.board);
  // Assert
  assert.deepStrictEqual(tileLuke, game.board[30]);

  // Act
  const tileVader  = getPlayerTile(game.players[1], game.board);
  // Assert
  assert.deepStrictEqual(tileVader, game.board[12]);

  // Act
  const tileLeia = getPlayerTile(game.players[2], game.board);
  // Assert
  assert.deepStrictEqual(tileLeia, game.board[0]);
});

test("getPlayerTile - throws when player has no position", () => {
  const board = createBoard();
  const element = { id: 5, name: "invalid shape" };

  assert.throws(() => {
    getPlayerTile(element, board);
  }, /Invalid player object shape/);
});

test("getPlayerTile - throws when player.position is out of range", () => {
  const game = createTestGame([{ name: "Luke Skywalker" }]);
  game.players[0].position = 40;

  assert.throws(() => {
    getPlayerTile(game.players[0], game.board);
  }, /Player position has invalid value 40\. Expected: \[0\.\.39\]/);
});

test("getOwner returns the player who owns the current tile", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 5 },
    { name: "Darth Vader", position: 12 },
    { name: "Leia Organa", position: 0, propertyIds: [5] },
  ]);

  const owner = gameUtils.getOwner(game);

  assert.deepStrictEqual(owner, game.players[2]);
});

test("getOwner returns null for an unowned tile", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 6 },
    { name: "Darth Vader", position: 12 },
    { name: "Leia Organa", position: 0 },
  ]);

  const owner = gameUtils.getOwner(game);

  assert.strictEqual(owner, null);
});

test("getOwner returns null when the tile owner is missing from the game", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 15 },
    { name: "Darth Vader", position: 12 },
    { name: "Leia Organa", position: 0 },
  ]);
  game.board[15].ownerId = 99;

  const owner = gameUtils.getOwner(game);

  assert.strictEqual(owner, null);
});
