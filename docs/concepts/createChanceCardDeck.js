const ChanceCards = [
  {
    type: "advance",
    location: "Boardwalk",
    text: "Advance to Boardwalk. If you pass Go, collect $200.",
  },
  { type: "advance", location: "Go", text: "Advance to Go (Collect $200)" },
  {
    type: "advance",
    location: "Illinois Avenue",
    text: "Advance to Illinois Avenue. If you pass Go, collect $200.",
  },
  {
    type: "advance",
    location: "St. Charles Place",
    text: "Advance to St. Charles Place. If you pass Go, collect $200.",
  },
  {
    type: "advance-nearest-railroad",
    text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled.",
  },
  {
    type: "advance-nearest-railroad",
    text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled.",
  },
  {
    type: "advance-nearest-utility",
    text: "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown.",
  },
  { type: "collect", value: 50, text: "Bank pays you dividend of $50." },
  { type: "get-out-jail", text: "Get Out of Jail Free" },
  { type: "go-back-3", name: "Go Back 3 Spaces." },
  {
    type: "get-to-jail",
    text: "Go to Jail. Go directly to Jail, do not pass Go, do not collect $200.",
  },
  {
    type: "property-repairs",
    text: "Make general repairs on all your property. For each house pay $25. For each hotel pay $100.",
  },
  { type: "pay", value: 15, text: "Speeding fine $15." },
  {
    type: "advance",
    location: "Reading Railroad",
    text: "Take a trip to Reading Railroad. If you pass Go, collect $200.",
  },
  {
    type: "pay-each-player",
    value: 50,
    text: "You have been elected Chairman of the Board. Pay each player $50.",
  },
  {
    type: "collect",
    value: 150,
    text: "Your building loan matures. Collect $150",
  },
];

export function createChanceCardDeck() {
  const deck = new Deck(ChanceCards);
  deck.shuffle();
  return deck;
}

// ---------------------------------------------------------------------------------------------------
// module: Deck.js

/**
  * A class representing a deck of Monopoly cards. It allows you to draw a card, return a card to the bottom of the deck, and shuffle the deck. 
  * Dedicated for Chance and Community Chest cards in Monopoly, but can be used for any card-based game.
  * @class Deck
  * @param {Array} cards - An array of Chance cards to initialize the deck with.
  * @method drawCard - Draws the top card from the deck and returns it. Throws an error if the deck is empty.
  * @method returnCard - Takes a card and returns it to the bottom of the deck.
  * @method shuffle - Shuffles the cards in the deck using the Fisher-Yates algorithm. Accepts an optional random function for testing purposes. 
 */
class Deck {
  // TODO: Implement
}
