let nextPlayerId = 1;

const Tokens = [
  "cannon",
  "thimble",
  "top hat",
  "iron",
  "battleship",
  "boot"
];

export function createPlayer(name, token) {
  if (!name || typeof name !== "string") {
    throw new Error("Player name is required and must be a string.");
  }

  if (!Tokens.includes(token)) {
    throw new Error(
      `Invalid token "${token}". Valid tokens are: ${Tokens.join(", ")}`
    );
  }

  return {
    id: nextPlayerId++,
    name,
    token,
    position: 1,
    money: 1500,
    inJail: false,
    getOutOfJailFree: 0,
    properties: [],
    utilities: [],
    railroads: []
  };
}
