import test from "node:test";
import assert from "node:assert/strict";
import { movePlayer } from "../../../game/rules/movePlayer.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("movePlayer - moves player forward by steps without passing Start", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 1 },
    { name: "Darth Vader" }
  ]);
  
  movePlayer(game, 2);

  assert.strictEqual(game.players[0].position, 3);
});

test("movePlayer - complete move at Start gives $200", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 31 },
    { name: "Darth Vader" }
  ]);
  
  movePlayer(game, 9);
  
  assert.strictEqual(game.players[0].position, 0);
  assert.strictEqual(game.players[0].money, 1700);
});

test("movePlayer - wraps around board and gives $200 when passing Start", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 31 },
    { name: "Darth Vader" }
  ]);

  movePlayer(game, 10);

  assert.strictEqual(game.players[0].position, 1);
  assert.strictEqual(game.players[0].money, 1700);
});

test("movePlayer - lands on the last board tile without wrapping", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 37 },
    { name: "Darth Vader" }
  ]);

  movePlayer(game, 2);

  assert.strictEqual(game.players[0].position, 39);
  assert.strictEqual(game.players[0].money, 1500);
});

test("movePlayer - moving from Start does not collect $200", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 0 },
    { name: "Darth Vader" }
  ]);

  movePlayer(game, 3);

  assert.strictEqual(game.players[0].position, 3);
  assert.strictEqual(game.players[0].money, 1500);
});
