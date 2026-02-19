import { rollDice } from "./rollDice.js";
import { movePlayer } from "./movePlayer.js";

export function playTheTurns(players, board, numberOfTurns) {
    for (let turn = 0; turn < numberOfTurns; turn++) {
    // Player 0 turn
    let doublesCount = 0;
    let hasDouble = true;
    while (hasDouble && doublesCount < 3) {
        const roll = rollDice();
        movePlayer(players[0], roll.total, board);
        hasDouble = roll.isDouble;
        if (hasDouble) {
        console.log(`${players[0].name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`);
        doublesCount++;
        }
    }
    
    // Player 1 turn
    doublesCount = 0;
    hasDouble = true;
    while (hasDouble && doublesCount < 3) {
        const roll = rollDice();
        movePlayer(players[1], roll.total, board);
        hasDouble = roll.isDouble;
        if (hasDouble) {
        console.log(`${players[1].name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`);
        doublesCount++;
        }
    }
    }
}