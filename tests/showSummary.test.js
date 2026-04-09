import test from "node:test";
import assert from "node:assert/strict";
import { showSummary } from "../game/showSummary.js";
import { createTestGame } from "./helpers/createTestGame.js";

test("displays player summary correctly", (context) => {
  // Arrange
  const game = createTestGame([
    { name: "Martyna", money: 1500 },
    { name: "Jarek", money: 1200, propertyIds: [1, 3, 5] },
    { name: "Ola Olaszewska", money: -200, propertyIds: [6] },
  ]);
  const players = game.players;
  context.mock.method(console, "log", (message) => {}); // mock console.log to capture output

  // Act
  showSummary(players);

  // Assert
  const logs = console.log.mock.calls.map(call => call.arguments.map(arg => arg.toString()).join("|"));

  assert.equal(logs.length, 7);
  assert.equal(logs[1], "🏁  Game Summary 🏁");
  assert.equal(logs[3], "");
  assert.equal(logs[4], "🏆  Martyna:         $1500 | 🏠  properties (0): []");
  assert.equal(logs[5], "💰  Jarek:           $1200 | 🏠  properties (3): [1, 3, 5]");
  assert.equal(logs[6], "💀  Ola Olaszewska:  -$200 | 🏠  properties (1): [6]");
});
