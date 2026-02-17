/**
 * Rolls two dice and returns the result.
 * 
 * @returns {Object} An object containing the individual dice values and their sum
 * @property {number} dice1 - Value of the first dice (1-6)
 * @property {number} dice2 - Value of the second dice (1-6)
 * @property {number} total - Sum of both dice
 * @property {boolean} isDouble - Whether both dice show the same value
 */
export function rollDice() {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  
  return {
    dice1,
    dice2,
    total: dice1 + dice2,
    isDouble: dice1 === dice2
  };
}
