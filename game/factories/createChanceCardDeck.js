import { Deck } from "../utils/Deck.js";

const ChanceCards = [
  { type: "advance", location: "Boardwalk", text: "Advance to Boardwalk. If you pass Go, collect $200." },
  { type: "advance", location: "Go", text: "Advance to Go (Collect $200)" },
  { type: "advance", location: "Illinois Avenue", text: "Advance to Illinois Avenue. If you pass Go, collect $200." },
  { type: "advance", location: "St. Charles Place", text: "Advance to St. Charles Place. If you pass Go, collect $200." },
  { type: "advance-nearest-railroad", text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled." },
  { type: "advance-nearest-railroad", text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled." },
  { type: "advance-nearest-utility", text: "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown." },
  { type: "collect", value: 50, text: "Bank pays you dividend of $50." },
  { type: "get-out-jail", text: "Get Out of Jail Free" },
  { type: "go-back-3", name: "Go Back 3 Spaces." },
  { type: "get-to-jail", text: "Go to Jail. Go directly to Jail, do not pass Go, do not collect $200." },
  { type: "property-repairs", text: "Make general repairs on all your property. For each house pay $25. For each hotel pay $100." },
  { type: "pay", value: 15, text: "Speeding fine $15." },
  { type: "advance", location: "Reading Railroad", text: "Take a trip to Reading Railroad. If you pass Go, collect $200." },
  { type: "pay-each-player", value: 50, text: "You have been elected Chairman of the Board. Pay each player $50." },
  { type: "collect", value: 150, text: "Your building loan matures. Collect $150" },
];

export function createChanceCardDeck() {
  const deck = new Deck(ChanceCards);
  deck.shuffle();
  return deck;
}
