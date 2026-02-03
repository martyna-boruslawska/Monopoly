/**
* Monopoly game board configuration containing all board spaces.
* 
* @type {Array<Object>}
* @property {number} id - Unique identifier for the board space (0-19)
* @property {string} name - Display name of the board space
* @property {string} type - Type of space: "start", "property", "chance", "tax", or "jail"
* @property {number} [price] - Purchase price for properties (optional)
* @property {number} [rent] - Base rent amount for properties (optional)
* @property {number} [amount] - Tax amount for tax spaces (optional)
* 
* @example
* // Access a specific board space
* const startLocation = board[0];
* 
* @example
* // Find a property by name
* const location = board.find(location => location.name === "Baltic Avenue");
*/
const board = [
  { id: 0, name: "Start", type: "start" },
  { id: 1, name: "Mediterranean Avenue", type: "property", price: 60, rent: 2 },
  { id: 2, name: "Chance", type: "chance" },
  { id: 3, name: "Baltic Avenue", type: "property", price: 60, rent: 4 },
  { id: 4, name: "Income Tax", type: "tax", amount: 200 },
  { id: 5, name: "Reading Railroad", type: "railroad", price: 200, rent: 25 },
  { id: 6, name: "Oriental Avenue", type: "property", price: 100, rent: 6 },
  { id: 7, name: "Chance", type: "chance" },
  { id: 8, name: "Vermont Avenue", type: "property", price: 100, rent: 6 },
  { id: 9, name: "Connecticut Avenue", type: "property", price: 120, rent: 8 },
  { id: 10, name: "Chance", type: "chance" },
  { id: 11, name: "St. Charles Place", type: "property", price: 140, rent: 10 },
  { id: 12, name: "Chance", type: "chance" },
  { id: 13, name: "States Avenue", type: "property", price: 140, rent: 10 },
  { id: 14, name: "Virginia Avenue", type: "property", price: 160, rent: 12 },
  { id: 15, name: "Pennsylvania Railroad", type: "railroad", price: 200, rent: 25 },
  { id: 16, name: "St. James Place", type: "property", price: 180, rent: 14 },
  { id: 17, name: "Chance", type: "chance" },
  { id: 18, name: "Tennessee Avenue", type: "property", price: 180, rent: 14 },
  { id: 19, name: "New York Avenue", type: "property", price: 200, rent: 16 }
];

export function createBoard() {
  return board.map(createLocation);
}

function createLocation(locationDef) {
  if (locationDef.type === "property") {
    return {
      ...locationDef,
      owner: null,
      houses: 0,
      hotel: false
    };
  }
  if (locationDef.type === "railroad") {
    return {
      ...locationDef, 
      owner: null,
      railroadsOwned: 0
    };
  }

  return { ...locationDef };
}
 