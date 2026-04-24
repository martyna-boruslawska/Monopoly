Issue: Auction unpurchased properties after a declined buy

Milestone 1 needs a first auction flow so unowned purchasable tiles are not silently left untouched when the landing player declines to buy. The current engine auto-buys when a player can afford a tile, so this issue also introduces the smallest decision seam for purchase and auction entry.

## Current Project Fit

- `handleBuyOrTrade()` currently auto-buys any affordable unowned purchasable tile.
- The landing rules pipeline already routes purchase handling through a single handler, which is the narrowest place to introduce auctions.
- There is no interactive input layer in the engine, so the first auction must be fully deterministic.

## Scope

Implement only these auction rules in V1:

1. When a player lands on an unowned purchasable tile, they may decline to buy it.
2. If they decline, the Bank starts an auction for that tile.
3. Any non-bankrupt player may bid, including the player who declined.
4. The auction ends when no player is willing to increase the current bid.
5. The winning player pays the Bank and becomes the owner.
6. If nobody bids, the tile remains unowned.

Out of scope for this issue:

- Human bidding prompts
- Tie-breaking by timing or UI interaction
- Complex bidding heuristics per profile
- Auctions for houses and hotels
- Bankruptcy-triggered property auctions

## Simple Strategy

Use one deterministic auction strategy for all players in this milestone:

- Introduce one purchase decision hook for unowned tiles.
- A player buys the landed tile immediately only if they can afford it and would keep at least $300 cash after purchase.
- Otherwise they decline and the tile goes to auction.
- During auction, each active player stays in while the next minimum bid is less than or equal to both:
  - the tile's printed price
  - the player's cash minus the $300 reserve
- Bid increments are fixed at $10.
- Players take turns in table order starting with the player after the one who declined.
- The last remaining bidder wins at the current bid.

This is intentionally simple and deterministic. It creates the auction seam that later strategy profiles can replace.

## Acceptance Criteria

[ ] A landing player can decline to buy an unowned purchasable tile even when they can afford it.
[ ] Declining starts an auction for that tile.
[ ] The declining player may still participate in the auction.
[ ] The winning bidder pays the final bid and receives ownership.
[ ] If no player is willing to bid, the tile remains unowned.
[ ] The deterministic auction strategy uses $10 bid increments and preserves a $300 cash reserve.

## Suggested Tests

1. A player with enough cash but less than `$300 + price` declines the landed tile and triggers auction.
2. The next player wins the auction at the minimum winning bid when only one bidder can afford it.
3. The original landing player can decline and still win the auction later.
4. No bids leaves the tile unowned.
5. Railroad and utility tiles also use the same auction flow.

## Notes

- Start from `handleBuyOrTrade()` and keep auction entry there.
- Prefer a pure helper that computes the auction winner and final bid from current players, tile, and strategy rule.
- Keep logging deterministic so tests can assert ownership and cash without depending on console text.
