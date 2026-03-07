/**
 * Creates an array of player objects based on the provided names.
 *
 * @param {Array<string>} names - An array of player names.
 * @returns {Array<{id: number, name: string, position: number, money: number, propertyIds: Array<number>, isBankrupt: boolean}>} An array of player objects.
 * 
 * Each player object has the following properties:
 * - id: A unique identifier for the player (starting from 1).
 * - name: The name of the player.
 * - position: The current position of the player on the board (initially 0).
 * - money: The amount of money the player has (initially 1500).
 * - propertyIds: An array of property IDs owned by the player (initially empty).
 * - isBankrupt: A boolean indicating whether the player is bankrupt (initially false).
 * 
 * @example
 * const players = createPlayers(["Alice", "Bob"]);
 * console.log(players);
 * // Output:
 * // [
 * //   { id: 1, name: "Alice", position: 0, money: 1500, propertyIds: [], isBankrupt: false },
 * //   { id: 2, name: "Bob", position: 0, money: 1500, propertyIds: [], isBankrupt: false }
 * // ]
 */
export function createPlayers(names) {
  let id = 1;
  return names.map( name => createPlayer(name, id++));
}

/**
 * Creates a new player object with the given name and ID.
 *
 * @param {string} name - The name of the player.
 * @param {number} id - The unique ID of the player.
 * @returns {{id: number, name: string, position: number, money: number, propertyIds: Array<number>, isBankrupt: boolean}} The newly created player object.
 */
function createPlayer(name, id) {
  return {
    id,
    name,
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false
  };
}
 