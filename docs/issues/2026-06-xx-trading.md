Issue: Negotiate and execute property trades

Milestone 1 needs the first property trading rule so future AI-only games can exchange assets without human prompts. The current engine has no trade model, no strategy abstraction, and no Get Out of Jail Free card ownership model, so the first version must stay narrow.

1. Add a first trade flow
  - A player may propose a trade to exactly one other player at the end of their turn
  - A trade may exchange cash for one property
  - The traded property must be owned by the other player
  - Streets in a developed color set cannot be traded
  - Accepted trades transfer both cash and property ownership atomically
  - Rejected trades do nothing
2. Keep trade logic separate from purchase logic
  - Ownership is currently tracked by `ownerId` on tiles and `propertyIds` on players
  - The existing purchase handler mentions trade, but actual trading should not be coupled to landing on an unowned tile
  - Prefer a separate trade helper or phase hook at end of turn
3. Use one simple deterministic trading strategy
  - Run the trade check once at the end of the current player's turn, after any building step
  - Look for the first street color set in board order where the current player owns all but one street and another single player owns the missing street
  - Propose a cash-only trade for that missing street
  - Offer amount is the printed purchase price plus 10%
  - Make the offer only if the buyer keeps at least `$300` cash after payment
  - The seller accepts only if the traded street is not developed, not mortgaged, and not part of the seller's own complete set
  - If accepted, transfer cash and the property. Otherwise do nothing
4. Add focused tests
  - Cover monopoly-completing offers, seller rejection when the seller's own set would be broken, developed-street blocking, reserve checks, and no-op rejection behavior

# Acceptance Criteria

[ ] A player can propose a cash-for-one-property trade at the end of their turn.
[ ] A trade that would complete the buyer's color set can be accepted when the seller does not own the full set and the tile is eligible.
[ ] Accepted trades move both the property and cash in one step.
[ ] Rejected trades leave money and ownership unchanged.
[ ] Streets in developed sets cannot be traded.
[ ] The simple strategy only proposes trades that complete a color set and preserve a `$300` cash reserve.

# Notes

- Keep the first trade model serializable and explicit so later AI strategy work can replace the decision rule.
- Out of scope: multi-property packages, counter-offers, Get Out of Jail Free card trades, loans, gifts, and trading during another player's turn.
- If mortgage support lands first, keep the V1 trade scope limited to unmortgaged properties unless this issue is explicitly broadened later.
