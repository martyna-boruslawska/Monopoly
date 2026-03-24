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
  { id: 1, name: "Mediterranean Avenue", type: "property", color: "dark-purple", price: 60, rent: 2 },
  { id: 2, name: "Chance", type: "chance" },
  { id: 3, name: "Baltic Avenue", type: "property", color: "dark-purple", price: 60, rent: 4 },
  { id: 4, name: "Income Tax", type: "tax", amount: 200 },
  { id: 5, name: "Reading Railroad", type: "railroad", price: 200, rent: 25 },
  { id: 6, name: "Oriental Avenue", type: "property", color: "light-blue", price: 100, rent: 6 },
  { id: 7, name: "Chance", type: "chance" },
  { id: 8, name: "Vermont Avenue", type: "property", color: "light-blue", price: 100, rent: 6 },
  { id: 9, name: "Connecticut Avenue", type: "property", color: "light-blue", price: 120, rent: 8 },
  { id: 10, name: "Jail", type: "jail" },
  { id: 11, name: "St. Charles Place", type: "property", color: "purple", price: 140, rent: 10 },
  { id: 12, name: "Electric Company", type: "utility", price: 150 },
  { id: 13, name: "States Avenue", type: "property", color: "purple", price: 140, rent: 10 },
  { id: 14, name: "Virginia Avenue", type: "property", color: "purple", price: 160, rent: 12 },
  { id: 15, name: "Pennsylvania Railroad", type: "railroad", price: 200, rent: 25 },
  { id: 16, name: "St. James Place", type: "property", color: "orange", price: 180, rent: 14 },
  { id: 17, name: "Community Chest", type: "community-chest" },
  { id: 18, name: "Tennessee Avenue", type: "property", color: "orange", price: 180, rent: 14 },
  { id: 19, name: "New York Avenue", type: "property", color: "orange", price: 200, rent: 16 },
  { id: 20, name: "Free Parking", type: "free-parking" },
  { id: 21, name: "Kentucky Avenue", type: "property", color: "red", price: 220, rent: 18},
  { id: 22, name: "Chance", type: "chance"},
  { id: 23, name: "Indiana Avenue", type: "property", color: "red", price: 220, rent: 18},
  { id: 24, name: "Illinois Avenue", type: "property", color: "red", price: 240, rent: 20},
  { id: 25, name: "B & O Railroad", type: "railroad", price: 200, rent: 25},
  { id: 26, name: "Atlantic Avenue", type: "property", color: "yellow", price: 260, rent: 22},
  { id: 27, name: "Ventnor Avenue", type: "property", color: "yellow", price: 260, rent: 22},
  { id: 28, name: "Waterworks", type: "utility", price: 150},
  { id: 29, name: "Marvin Gardens", type: "property", color: "yellow", price: 280, rent: 24},
  { id: 30, name: "Go To Jail", type: "go-to-jail"},
  { id: 31, name: "Pacific Avenue", type: "property", color: "green", price: 300, rent: 26},
  { id: 32, name: "North Carolina Avenue", type: "property", color: "green", price: 300, rent: 26},
  { id: 33, name: "Community Chest", type: "community-chest"},
  { id: 34, name: "Pennsylvania Avenue", type: "property", color: "green", price: 320, rent: 28},
  { id: 35, name: "Short Line", type: "railroad", price: 200, rent: 25},
  { id: 36, name: "Chance", type: "chance"},
  { id: 37, name: "Park Place", type: "property", color: "dark-blue", price: 350, rent: 35},
  { id: 38, name: "Luxury Tax", type: "tax", amount: 100},
  { id: 39, name: "Boardwalk", type: "property", color: "dark-blue", price: 400, rent: 50},
];

export function createBoard() {
  return board.map(createLocation);
}

function createLocation(locationDef) {
  if (locationDef.price) {
    const location = {
      ...locationDef,
      ownerId: null,
    };

    if (locationDef.type === "property") {
      return {
        ...location,
        houses: 0,
        hasHotel: false,
      };
    }

    return location;
  }

  return { ...locationDef };
}
