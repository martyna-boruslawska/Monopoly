import test from "node:test";
import assert from "node:assert/strict";
import { transferMoney } from "../../../game/utils/transferMoney.js";

test("transferMoney - transfers from one player to another", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  transferMoney(fromPlayer, toPlayer, 200);

  assert.strictEqual(fromPlayer.money, 1300);
  assert.strictEqual(toPlayer.money, 1700);
});

test("transferMoney - does nothing when the transfer amount is zero", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  transferMoney(fromPlayer, toPlayer, 0);

  assert.strictEqual(fromPlayer.money, 1500);
  assert.strictEqual(toPlayer.money, 1500);
});

test("transferMoney - does nothing when the transfer amount is negative", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  transferMoney(fromPlayer, toPlayer, -50);

  assert.strictEqual(fromPlayer.money, 1500);
  assert.strictEqual(toPlayer.money, 1500);
});

test("transferMoney - throws when fromPlayer is missing for a positive transfer", () => {
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  assert.throws(
    () => transferMoney(null, toPlayer, 100),
    { message: "fromPlayer must be a valid player object." },
  );
});

test("transferMoney - throws when toPlayer is missing for a positive transfer", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };

  assert.throws(
    () => transferMoney(fromPlayer, null, 100),
    { message: "toPlayer must be a valid player object." },
  );
});
