Issue: Auction unpurchased properties after a declined buy

Milestone 1 needs a first auction flow so unowned purchasable tiles are not silently left untouched when the landing player declines to buy. The current engine auto-buys when a player can afford a tile, so this issue also introduces the smallest decision seam for purchase and auction entry.

1. Change the unowned-property flow
  - When a player lands on an unowned purchasable tile, they may decline to buy it
  - If they decline, the Bank starts an auction for that tile
  - Any non-bankrupt player may bid, including the player who declined
  - The auction ends when no player is willing to increase the current bid
  - The winning player pays the Bank and becomes the owner
  - If nobody bids, the tile remains unowned
2. Keep design local to current pipeline
  - Start from `handleBuyOrTrade()` because the landing rules pipeline already routes purchase handling through that single handler
  - Introduce one purchase decision hook for unowned tiles rather than a wider strategy system in this issue
  - Keep first auction fully deterministic because there is no interactive input layer in the engine
3. Use one simple deterministic auction strategy
  - A player buys the landed tile immediately only if they can afford it and would keep at least `$300` cash after purchase
  - Otherwise they decline and the tile goes to auction
  - During auction, each active player stays in while the next minimum bid is less than or equal to both:
    - the tile's printed price
    - the player's cash minus the `$300` reserve
  - Bid increments are fixed at `$10`
  - Players take turns in table order starting with the player after the one who declined
  - The last remaining bidder wins at the current bid
4. Out of scope in this issue
  - Human bidding prompts
  - Tie-breaking by timing or UI interaction
  - Complex bidding heuristics per profile
  - $1 increment simulation
  - Auctions for houses and hotels, including scarce-building variants
  - Bankruptcy-triggered property auctions
5. Add focused tests
  - A player with enough cash but less than `$300 + price` declines the landed tile and triggers auction
  - The next player wins the auction at the minimum winning bid when only one bidder can afford it
  - The original landing player can decline and still win the auction later
  - No bids leaves the tile unowned
  - Railroad and utility tiles also use the same auction flow

## Acceptance Criteria

[ ] A landing player can decline to buy an unowned purchasable tile even when they can afford it.
[ ] Declining starts an auction for that tile.
[ ] The declining player may still participate in the auction.
[ ] The winning bidder pays the final bid and receives ownership.
[ ] If no player is willing to bid, the tile remains unowned.
[ ] The deterministic auction strategy uses `$10` bid increments and preserves a `$300` cash reserve.

## Notes

- Prefer a pure helper that computes the auction winner and final bid from current players, tile, and strategy rule.
- Keep logging deterministic so tests can assert ownership and cash without depending on console text.
