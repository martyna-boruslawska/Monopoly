import { Deck } from "./Deck.js";

const chanceCards = [
  { type: "advance", location: "Boardwalk", text: "Advance to Boardwalk. If you pass Go, collect $200." },
  { type: "advance", location: "Go", text: "Advance to Go (Collect $200)" },
  { type: "advance", location: "Illinois Avenue", text: "Advance to Illinois Avenue. If you pass Go, collect $200." },
  { type: "advance", location: "St. Charles Place", text: "Advance to St. Charles Place. If you pass Go, collect $200." },
  { type: "advance-nearest-railroad", text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay twice the rental to which they are otherwise entitled." },
  { type: "advance-nearest-railroad", text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay twice the rental to which they are otherwise entitled." },
  { type: "advance-nearest-utility", text: "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown." },
  { type: "collect", value: 50, text: "Bank pays you dividend of $50." },
  { type: "get-out-jail", text: "Get Out of Jail Free" },
  { type: "go-back-3", text: "Go Back 3 Spaces." },
  { type: "get-to-jail", text: "Go to Jail. Go directly to Jail, do not pass Go, do not collect $200." },
  { type: "property-repairs", text: "Make general repairs on all your property. For each house pay $25. For each hotel pay $100." },
  { type: "pay", value: 15, text: "Speeding fine $15." },
  { type: "advance", location: "Reading Railroad", text: "Take a trip to Reading Railroad. If you pass Go, collect $200." },
  { type: "pay-each-player", value: 50, text: "You have been elected Chairman of the Board. Pay each player $50." },
  { type: "collect", value: 150, text: "Your building loan matures. Collect $150" },
];

const communityChestCards = [
  { type: "advance", location: "Go", text: "Advance to Go (Collect $200)" },
  { type: "collect", value: 200, text: "Bank error in your favour. Collect $200" },
  { type: "pay", value: 50, text: "Doctor's fee. Pay $50" },
  { type: "collect", value: 50, text: "From sale of stock you get $50" },
  { type: "get-out-jail", text: "Get Out of Jail Free" },
  { type: "get-to-jail", text: "Go to Jail. Go directly to Jail, do not pass Go, do not collect $200." },
  { type: "collect", value: 100, text: "Holiday fund matures. Receive $100" },
  { type: "collect", value: 20, text: "Income tax refund. Collect $20" },
  { type: "gift-from-players", value: 10, text: "It is your birthday. Collect $10 from every player" },
  { type: "collect", value: 100, text: "Life insurance matures. Collect $100" },
  { type: "pay", value: 100, text: "Pay hospital fees of $100" },
  { type: "pay", value: 50, text: "Pay school fees of $50" },
  { type: "collect", value: 25, text: "Receive $25 consultancy fee" },
  { type: "street-repairs", text: "You are assessed for street repair. $40 per house. $115 per hotel" },
  { type: "collect", value: 10, text: "You have won second prize in a beauty contest. Collect $10" },
  { type: "collect", value: 100, text: "You inherit $100" },
];

export function createChanceDeck() {
  const deck = new Deck(chanceCards);
  deck.shuffle();
  return deck;
}

export function createCommunityChestDeck() {
  const deck = new Deck(communityChestCards);
  deck.shuffle();
  return deck;
}

export function createDecks() {
  const chance = createChanceDeck();
  const communityChest = createCommunityChestDeck();

  return {
    chance,
    communityChest,
  };
}
