Homework: Utility and railroad rent rules

The board already contains two utilities: `Electric Company` and `Waterworks`. It also contains four railroads: `Reading Railroad`, `Pennsylvania Railroad`, `B&O Railroad`, and `Short Line`. They are currently purchasable because they have a `price`, but they do not charge rent because they have no `rent` field and the current rules engine only transfers rent from `tile.rent`. Implement rent payments for utilities and railroads.

1. Rules for utilities based on current dice rolls
  - Handles payments when player land on tiles owned by other players
  - When a player owns both utilities, the rent is higher than owning just one
  - Rent calculation:
      - with 1 utility: `4 x dice total`
      - with 2 utilities: `10 x dice total`
      - where `dice total` is the sum of the two dice rolled for the current player move (no additional dice rolled for rent payment)
2. Rules for railroads based on ownership
  - Handles payments when player land on tiles owned by other players
  - Rent calculation:
      - with 1 railroad: `$25`
      - with 2 railroads: `$50`
      - with 3 railroads: `$100`
      - with 4 railroads: `$200`
3. Log a clear console message describing the rent payment and the amount.
   ```
   Luke pays Obi-Wan $70 for landing on Electric Company (2 utilities owned).
   ```
   ```
   Kylo pays Rey $100 for landing on Reading Railroad (3 railroads owned).
   ```

# Acceptance Criteria

[ ] Utilities and railroads can be bought like other purchasable spaces.
[ ] Landing on another player’s utility transfers money using the rolled total.
[ ] Owning both utilities increases the payment multiplier.
[ ] Landing on your own utility does not charge rent.
[ ] Landing on another player’s railroad transfers money based on the number of railroads owned.
[ ] Landing on your own railroad does not charge rent.

# Notes

- Keep the implementation local to current modules where possible.
