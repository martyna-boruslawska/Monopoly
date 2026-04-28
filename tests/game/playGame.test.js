import test from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../../game/factories/createGame.js";
import { playGame } from "../../game/playGame.js";
import { rollDice } from "../../game/utils/rollDice.js";

test("playGame - validate generated logs", (context) => {
  context.mock.method(console, "log", (message) => {});
  const randomFunc = createDeterministicRandom(1524135366)
  // Arrange
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);
  game.rollDice = () => rollDice(randomFunc);
  
  // Act
  playGame(game);

  // Assert
  const logs = console.log.mock.calls.map((call) =>
    call.arguments.map((arg) => arg.toString()).join("|"),
  );

  assert.ok(logs.length > 50, "Expected more than 50 log entries, but got " + logs.length);
  assert.equal(logs[1], "Luke Skywalker moves to Vermont Avenue");
  assert.equal(logs[2], "Vermont Avenue is available for $100");
  assert.equal(logs[logs.length-8], "Reached maximum number of rounds: 40. Ending game.");
  assert.equal(logs[logs.length-7], "=================================");
  assert.equal(logs[logs.length-6], "🏁  Game Summary 🏁");
});

// --------------------------------------------------------------------------------

function createDeterministicRandom(seed) {
  const mulberry32 = (a) => {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }
  return mulberry32(seed);
}
