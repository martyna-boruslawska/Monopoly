import test from "node:test";
import assert from "node:assert/strict";
import { createTestGame } from "../helpers/createTestGame.js";
import { playGame } from "../../game/playGame.js";
import { rollDice } from "../../game/utils/rollDice.js";

test("playGame - validate generated logs", (context) => {
  context.mock.method(console, "log", (message) => {});
  // Arrange
  const game = createTestGame([
    { name: "Luke Skywalker", money: 1500 },
    { name: "Darth Vader", money: 1500 },
    { name: "Leia Organa", money: 1500 },
  ]);
  game.rollDice = () => rollDice(createDeterministicRandom(12345));
  
  // Act
  playGame(game);

  // Assert
  const logs = console.log.mock.calls.map((call) =>
    call.arguments.map((arg) => arg.toString()).join("|"),
  );

  assert.ok(logs.length > 50, "Expected more than 50 log entries, but got " + logs.length);
  assert.equal(logs[1], "Darth Vader moves to Vermont Avenue");
  assert.equal(logs[logs.length-8], "Reached maximum number of rounds: 40. Ending game.");
  assert.equal(logs[logs.length-7], "=================================");
  assert.equal(logs[logs.length-6], "🏁  Game Summary 🏁");
});

// --------------------------------------------------------------------------------

function createDeterministicRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
