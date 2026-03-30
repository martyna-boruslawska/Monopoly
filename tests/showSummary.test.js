import test from "node:test";
import assert from "node:assert/strict";
import { showSummary } from "../game/showSummary.js";
import { createGame } from "../game/createGame.js";

test("displays player summary correctly", (context) => {
  // Arrange
  const game = createGame(["Martyna", "Jarek", "Ola Olaszewska"]);
  const players = game.players;
  players[0].money = 1500;
  players[1].money = 1200;
  players[1].propertyIds = [1, 2, 3];
  players[2].money = -200;
  players[2].propertyIds = [4];
  context.mock.method(console, "log", (message) => {}); // mock console.log to capture output

  // Act
  showSummary(players);

  // Assert
  const logs = console.log.mock.calls.map(call => call.arguments.map(arg => arg.toString()).join("|"));

  assert.equal(logs.length, 7);
  assert.equal(logs[1], "🏁  Game Summary 🏁");
  assert.equal(logs[3], "");
  assert.equal(logs[4], "🏆  Martyna:         $1500 | 🏠  properties (0): []");
  assert.equal(logs[5], "💰  Jarek:           $1200 | 🏠  properties (3): [1, 2, 3]");
  assert.equal(logs[6], "💀  Ola Olaszewska:  -$200 | 🏠  properties (1): [4]");
});
