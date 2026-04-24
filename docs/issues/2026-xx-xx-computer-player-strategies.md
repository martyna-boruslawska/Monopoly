Homework: Computer player profiles and strategy hooks

The project goal is to simulate Monopoly games played only by computer-controlled players with distinct personalities. The current engine still hard-codes decision-making in places like property buying and jail exit. Introduce configurable player profiles and a strategy contract for automated decisions.

Implement the first version of AI player support.

1. Add AI-only match configuration
  - A game can be created from computer-player definitions, not only plain player names
  - Each computer player has a profile identifier or strategy configuration that can be serialized and reused
2. Add strategy hooks for the decision points that already exist in the engine
  - Property purchase decisions when landing on unowned purchasable tiles
  - Jail exit decisions when a player can choose whether to pay to leave jail
  - Keep the strategy API open for future hooks such as houses, hotels, mortgages, and trades, but do not implement those mechanics in this issue
3. Ship the first profile set
  - `Aggressive Buyer`: buys every affordable property
  - `Monopolist`: prefers moves that help complete color sets
  - `Cash Hoarder`: buys conservatively and preserves cash
  - `Railroad Baron`: prioritizes railroads and utilities
  - `Risk-Averse`: avoids expensive purchases and high-cash-risk situations
  - `Builder`: reserves cash to support future building behavior, even though houses and hotels are not implemented yet
4. Make profile behavior testable
  - Different profiles should make different decisions from the same game state when their rules differ
  - Tests should use deterministic setup and mocked dice where necessary

# Acceptance Criteria

[ ] A game can be configured with computer-player profiles instead of plain names only.
[ ] Buying behavior no longer depends on a single hard-coded rule.
[ ] Jail exit behavior no longer depends on a single hard-coded rule.
[ ] The six initial computer-player profiles are available.
[ ] Tests prove that at least two profiles make different purchase decisions from the same state.
[ ] Tests prove that jail decisions can differ by profile when the rules allow a choice.

# Notes

- Start from `game/createGame.js`, `game/createPlayers.js`, `game/rules/handlers/handleBuyOrTrade.js`, and `game/rules/jailRules.js`.
- Keep profile definitions serializable. Avoid embedding opaque runtime-only callbacks directly in saved match definitions.
- Scope for this issue is only decision-making on rules that already exist in the engine.
- This issue depends on the reusable simulation contract from `2026-04-24-simulation-history-and-replay.md`.