import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createGame } from "../game/createGame.js";

test("skips players who are already bankrupt", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Martyna", "Jarek"]);

  game.players[0].isBankrupt = true;
  game.players[0].position = 5;
  game.currentPlayerId = game.players[0].id; // Set current player to Jarek for the test

  const randomValues = [0, 0.2]; // dice: 1 and 2
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 5);
  assert.equal(game.players[1].position, 3);
});

test("plays one turn for a non-bankrupt player", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 3);
});

test("gives another turn after rolling doubles", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 7);
});

test("stops after three doubles", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test

  const randomValues = [0, 0, 0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 6);
  assert.equal(index, 6);
});

test("stops extra turns when player becomes bankrupt after a double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test
  game.players[0].position = 36;
  game.players[0].money = 50;

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 38);
  assert.equal(game.players[0].money, -50);
  assert.equal(game.players[0].isBankrupt, true);
  assert.equal(index, 2);
});

test("logs a message when a player is transferred to jail", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Darth Vader", "Han Solo"]);
  game.players[0].position = 27; // Put Darth Vader in Jail (id: 10)
  game.currentPlayerId = game.players[0].id; // Set current player to Darth Vader for the test

  const randomValues = 
  [
    0, 0.2,     0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail

  // Assert
  assert.equal(game.players[0].position, 10);
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
});

test("stops extra turns when player goes to jail after a double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test
  game.players[0].position = 28;

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 10);
  assert.equal(game.players[0].inJail, true);
});

test("stops extra turns when player goes to jail after a second double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createGame(["Luke"]);
  game.currentPlayerId = game.players[0].id; // Set current player to Luke for the test
  game.players[0].position = 26;

  const randomValues = [0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 10);
  assert.equal(game.players[0].inJail, true);
});

test("logs a message when a player is in jail they cannot collect rent", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Darth Maul", "Obi-Wan"]);
  game.players[0].position = 28; // Put Darth Maul in Jail (id: 10)
  game.players[0].propertyIds = [6]; // Own Mediterranean Avenue to ensure rent would be collected if not in jail 
  game.board[6].ownerId = game.players[0].id; // Set ownership of Mediterranean Avenue to Darth Maul
  game.currentPlayerId = game.players[0].id; // Set current player to Obi-Wan for the test
  game.players[1].position = 1; // Move Obi-Wan to Mediterranean Avenue (id: 1) to ensure rent would be collected if not in jail

  const randomValues = 
  [
    0, 0,     0.2, 0.4
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  
  // Assert
  assert.equal(game.players[0].money, 1500); // Should not pay rent because Darth Maul is in jail
  assert.equal(game.players[1].position, 6); // Should move to Oriental Avenue (id: 6)
  assert(logMessages.some((msg) => msg.includes("is in jail and cannot collect rent from")));
});

// wariant aa)
test("logs a message when a player pays $50 to get out of jail (player rolls non doubles before and after jail)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Darth Sidious", "Han Solo"]);
  game.players[0].position = 27; // Put Darth Sidious in Jail (id: 10)
  game.players[0].money = 50;
  game.currentPlayerId = game.players[0].id; // Set current player to Darth Sidious for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail

  const randomValues = 
  [
    0, 0.2,     0, 0.2, 
    0.6, 0.99
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail after rolling 1 and 2
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // 1st player pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 20);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});

// wariant ab)
test("logs a message when a player pays $50 to get out of jail (player rolls doubles before jail and non doubles after)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Darth Sidious", "Han Solo"]);
  game.players[0].position = 28; // Put Darth Sidious in Jail (id: 10)
  game.players[0].money = 50;
  game.currentPlayerId = game.players[0].id; // Set current player to Darth Sidious for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail

  const randomValues = 
  [
    0, 0,     0, 0.2, 
    0.6, 0.99
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // his 1st pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 20);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});


// wariant ac)
test("logs a message when a player pays $50 to get out of jail (player rolls non doubles before jail and doubles after)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Darth Sidious", "Han Solo"]);
  game.players[0].position = 27; // Put Darth Sidious in Jail (id: 10)
  game.players[0].money = 50;
  game.currentPlayerId = game.players[0].id; // Set current player to Darth Sidious for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail

  const randomValues = 
  [
    0, 0.2,     0, 0.2, 
    0.8, 0.8,   0, 0.2,
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail after rolling 1 and 2
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // 1st player pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 23);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});

// wariant ad)
test("logs a message when a player pays $50 to get out of jail (player rolls doubles before and after jail)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Darth Sidious", "Han Solo"]);
  game.players[0].position = 28; // Put Darth Sidious in Jail (id: 10)
  game.players[0].money = 50;
  game.currentPlayerId = game.players[0].id; // Set current player to Darth Sidious for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail

  const randomValues = 
  [
    0, 0,     0, 0.2, 
    0.8, 0.8,   0, 0.2,
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail after rolling 1 and 2
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // 1st player pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 23);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});

// wariant ba) (1)
test("logs a message when a player rolls doubles to get out of jail in 1st jail round", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Boba Fett", "Han Solo"]);
  game.players[0].position = 28;
  game.players[0].money = 49;
  game.currentPlayerId = game.players[0].id; // Set current player to Boba Fett for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
    [
    0, 0,   0, 0.2, 
    0, 0,   0, 0.2,
    0, 0.2, 0, 0.2,
    ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // his 1st attempt to get out of jail - succeeds

  // Assert
  assert.equal(game.players[0].position, 12);
  assert(logMessages.some((msg) => msg.includes("rolls doubles and gets out of jail")));
});

// wariant bb) (2)
test("logs a message when a player rolls doubles to get out of jail in 2nd jail round", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Boba Fett", "Han Solo"]);
  game.players[0].position = 28; // Put Boba Fett in Jail (id: 10)
  game.players[0].money = 49;
  game.currentPlayerId = game.players[0].id; // Set current player to Boba Fett for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0, 0, 0.2, 
    0, 0.2, 0, 0.2,
    0, 0, 0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // his 1st attempt to get out of jail - fails
  playRound(game);  // his 2nd attempt to get out of jail - succeeds

  // Assert
  assert.equal(game.players[0].position, 12);       
  assert(logMessages.some((msg) => msg.includes("rolls doubles and gets out of jail")));
});

// wariant bc) (3a)
test("logs a message when a player rolls doubles to get out of jail in 3rd jail round", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Boba Fett", "Han Solo"]);
  game.players[0].position = 28; // Put Boba Fett in Jail (id: 10)
  game.players[0].money = 49;
  game.currentPlayerId = game.players[0].id; // Set current player to Boba Fett for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0,   0, 0.2, 
    0, 0.2, 0, 0.2,
    0, 0.2, 0, 0.2,
    0, 0,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // his 1st attempt to get out of jail - fails
  playRound(game);  // his 2nd attempt to get out of jail - fails
  playRound(game);  // his 3rd attempt to get out of jail - succeeds

  // Assert
  assert.equal(game.players[0].position, 12);       
  assert(logMessages.some((msg) => msg.includes("rolls doubles and gets out of jail")));
});

// wariant bd) (3b)
test("logs a message when a player fails to roll doubles to get out of jail", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Luke Skywalker", "Han Solo"]);
  game.players[0].position = 28; // Put Luke Skywalker in Jail (id: 10)
  game.players[0].money = 49;
  game.currentPlayerId = game.players[0].id; // Set current player to Luke Skywalker for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0,     0, 0.2, 
    0, 0.2,   0, 0.2,
    0, 0.2,   0, 0.2,
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // 1st attempt to get out of jail - fails
  playRound(game);  // 2nd attempt to get out of jail - fails
  playRound(game);  // 3rd attempt to get out of jail - fails

  // Assert
  assert.equal(game.players[0].position, 10);       
  assert.ok(game.players[0].isBankrupt); // Player should be bankrupt after failing to roll doubles 3 times in jail with only $49
  assert(logMessages.some((msg) => msg.includes("fails to roll doubles and remains in jail")));
});

// wariant ca)
test("player moves on after landing on Jail tile", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createGame(["Leia", "Han Solo"]);
  game.players[0].position = 7;               // Put Leia in Jail (id: 10)
  game.currentPlayerId = game.players[0].id;  // Set current player to Leia for the test
  game.players[1].position = 6;               // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0.2,   0, 0.2,
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player moves out of jail tile

  // Assert
  assert.equal(game.players[0].position, 13); 
});

// wariant cb)
test("player gets another turn after landing on Jail tile and rolling doubles", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Leia", "Han Solo"]);
  game.players[0].position = 7;               // Put Leia in Jail (id: 10)
  game.currentPlayerId = game.players[0].id;  // Set current player to Leia for the test
  game.players[1].position = 6;               // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0,     
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player rolls doubles and moves out of jail
  
  // Assert
  assert.equal(game.players[0].position, 15); 
});

// wariant cc)
test("player gets another turn after landing on Jail tile and rolling doubles twice", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Leia", "Han Solo"]);
  game.players[0].position = 7; // Put Leia in Jail (id: 10)
  game.currentPlayerId = game.players[0].id; // Set current player to Leia for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0,     
    0, 0,
    0, 0.2,   0, 0
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player rolls doubles twice and moves out of jail tile
  
  // Assert
  assert.equal(game.players[0].position, 17); 
});

// wariant cc)
test("player gets another turn after landing on Jail tile and rolling doubles 3 times", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createGame(["Leia", "Han Solo"]);
  game.players[0].position = 7; // Put Leia in Jail (id: 10)
  game.currentPlayerId = game.players[0].id; // Set current player to Leia for the test
  game.players[1].position = 6; // Move Han Solo to Oriental Avenue (id: 6) to ensure rent would be collected if not in jail  

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0,     
    0, 0,
    0, 0,     0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player rolls doubles 3 times and moves out of jail tile
  
  // Assert
  assert.equal(game.players[0].position, 16); 
});
