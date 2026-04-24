Issue: Negotiate and execute property trades

Milestone 1 needs the first property trading rule so future AI-only games can exchange assets without human prompts. The current engine has no trade model, no strategy abstraction, and no Get Out of Jail Free card ownership model, so the first version must stay narrow.

## Current Project Fit

- Ownership is currently tracked by `ownerId` on tiles and `propertyIds` on players.
- There is no card inventory on players yet beyond deck resolution side effects.
- The existing purchase handler is the only place that mentions trade, but actual trading should not be coupled to landing on an unowned tile.
- The current test helpers can already set up exact ownership layouts, which is enough for deterministic trade tests.

## Scope

Implement only these trade behaviors in V1:

1. A player may propose a trade to exactly one other player at the end of their turn.
2. A trade may exchange cash for one property.
3. The traded property must be owned by the other player.
4. Streets in a developed color set cannot be traded.
5. Accepted trades transfer both cash and property ownership atomically.
6. Rejected trades do nothing.

Out of scope for this issue:

- Multi-property packages
- Get Out of Jail Free cards in trades
- Counter-offers
- Trading during another player's turn
- Trading mortgaged property with forced immediate mortgage decisions
- Loans, gifts, or zero-value transfers

## Simple Strategy

Use one deterministic trading strategy for all players in this milestone:

- Run the trade check once at the end of the current player's turn, after any building step.
- Look for the first street color set in board order where the current player owns all but one street and another single player owns the missing street.
- Propose a cash-only trade for that missing street.
- Offer amount is the printed purchase price plus 10%.
- Make the offer only if the buyer keeps at least $300 cash after payment.
- The seller accepts only if the traded street is not developed, not mortgaged, and not part of the seller's own complete set.
- If accepted, transfer cash and the property. Otherwise do nothing.

This creates one clear baseline behavior: players only trade to complete a monopoly and only for a simple cash premium.

## Acceptance Criteria

[ ] A player can propose a cash-for-one-property trade at the end of their turn.
[ ] A trade that would complete the buyer's color set can be accepted when the seller does not own the full set and the tile is eligible.
[ ] Accepted trades move both the property and cash in one step.
[ ] Rejected trades leave money and ownership unchanged.
[ ] Streets in developed sets cannot be traded.
[ ] The simple strategy only proposes trades that complete a color set and preserve a $300 cash reserve.

## Suggested Tests

1. A player who owns two of three streets offers cash for the missing third street and completes the set when accepted.
2. A seller who also owns the rest of that color set rejects the offer.
3. A developed street cannot be traded.
4. A player without enough post-trade reserve does not make an offer.
5. A rejected trade leaves both players' money and `propertyIds` unchanged.

## Notes

- Do not overload `handleBuyOrTrade()` with end-of-turn trade negotiation. Prefer a separate trade helper or phase hook.
- Keep the first trade model serializable and explicit so later AI strategy work can replace the decision rule.
- If mortgage support lands first, keep the V1 trade scope limited to unmortgaged properties unless you explicitly choose to broaden it.
