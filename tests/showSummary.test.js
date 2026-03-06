import test from "node:test";
import assert from "node:assert/strict";
import { showSummary } from "../game/showSummary.js";

test("displays player summary correctly", (context) => {
  const players = [
    {name: "Martyna", money: 1500, properties: []},
    {name: "Jarek", money: 1200, properties: [{id: 1}, {id: 2}, {id: 3}]},
    {name: "Ola Olaszewska", money: -200, properties: [{id: 4}]}
  ];

  context.mock.method(console, "log", (message) => {}); // mock console.log to capture output
  showSummary(players); // call the function being tested
  assert.equal(console.log.mock.calls.length, 4); // 1 for header, 3 for players
  
  const call1 = console.log.mock.calls[1]; // check the first player's summary (Martyna)
  assert.equal(call1.arguments.length, 1); // should log one message
  assert.equal(call1.arguments[0], "🏆  Martyna:         $1500 | 🏠  properties (0): []"); // check the message content

  const call2 = console.log.mock.calls[2]; // check the second player's summary (Jarek)
  assert.equal(call2.arguments.length, 1); // should log one message
  assert.equal(call2.arguments[0], "💰  Jarek:           $1200 | 🏠  properties (3): [1, 2, 3]"); // check the message content

  const call3 = console.log.mock.calls[3]; // check the third player's summary (Ola Olaszewska)
  assert.equal(call3.arguments.length, 1); // should log one message
  assert.equal(call3.arguments[0], "💀  Ola Olaszewska:  -$200 | 🏠  properties (1): [4]"); // check the message content
});
