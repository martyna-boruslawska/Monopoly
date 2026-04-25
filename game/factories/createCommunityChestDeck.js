import { Deck } from "../utils/Deck.js";

const CommunityChestCards = [
  { type: "advance", location: "Go", text: "Advance to Go (Collect $200)" },
  { type: "collect", value: 200, text: "Bank error in your favour. Collect $200" },
  { type: "pay", value: 50, text: "Doctor\'s fee. Pay $50" },
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
  { type: "street-repairs", text: "You are assessed for street repairs. Pay $40 per house and $115 per hotel" },
  { type: "collect", value: 100, text: "You have won second prize in a beauty contest. Collect $100" },
  { type: "collect", value: 10, text: "Interest on cash loan. Receive $10 from the bank" },
  { type: "pay", value: 100, text: "Pay tax of $100" },
  { type: "collect", value: 20, text: "Your share of the lottery prize. Collect $20 from the bank" },
];

export function createCommunityChestCardDeck() {
  const deck = new Deck(CommunityChestCards);
  deck.shuffle();
  return deck;
}
