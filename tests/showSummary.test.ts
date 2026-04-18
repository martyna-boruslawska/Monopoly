import test from "node:test";
import assert from "node:assert/strict";
import { showSummary } from "../game/showSummary.js";

test("displays player summary correctly", (context) => {
  // Arrange
  const players = [
    { name: "Luke Skywalker", money: 1500, propertyIds: [] },
    { name: "Darth Vader", money: 1200, propertyIds: [1, 2, 3] },
    { name: "Leia Organa", money: -200, propertyIds: [4] },
  ];
  const mockLog = context.mock.method(console, "log", () => {}); // mock console.log to capture output

  // Act
  showSummary(players);

  // Assert
  const logs = mockLog.mock.calls.map(call =>
    call.arguments.map(arg => String(arg)).join("|"),
  );

  assert.strictEqual(logs.length, 7);
  assert.strictEqual(logs[1], "🏁  Game Summary 🏁");
  assert.strictEqual(logs[3], "");
  assert.strictEqual(logs[4], "🏆  Luke Skywalker:  $1500 | 🏠  properties (0): []");
  assert.strictEqual(logs[5], "💰  Darth Vader:     $1200 | 🏠  properties (3): [1, 2, 3]");
  assert.strictEqual(logs[6], "💀  Leia Organa:     -$200 | 🏠  properties (1): [4]");
});
