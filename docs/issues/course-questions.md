# Course Questions

## Data

1. What is the practical difference between `const` and `let`?
2. Why is it worth keeping data initialization in a separate module?
3. What would happen if we used global variables?
4. Why should a function return data instead of logging it?
5. What happens if we call the function 1000 times?
6. How can we test randomness without automated tests?
7. Why is removing elements from an array risky? (removing a bankrupt player)
8. Mutable and immutable data. Which objects and arrays do we modify during iteration?
9. What are the alternatives? Is it possible to use immutable data?
10. What is the "source of truth" for the game state?

# Functions - Logic

1. Why `ownerId` instead of a player object?
2. What problems are caused by storing references?
3. How can we simplify the data model?
4. How can we check whether the money balance is correct? Do the funds "not disappear"?
5. What if a player does not have enough funds?
6. Should we keep game logic in one place?
7. Why should game end conditions not be scattered?
   - Is the game loop readable?
   - Are the end conditions in one place?
   - Is it easy to add a new condition?
8. What is a "flow controller"?
9. How can we avoid an infinite loop?
10. Should the board know about the players?

Tasks:
* Shortening functions
* Improving names
* Removing duplication

# Architecture

1. What is the "happy path"?
   - Where is the best place to handle logical errors?
2. What are the boundaries of a function's responsibility?
   - Can the turn algorithm be described in one sentence?
   - Does each function have a single responsibility?
   - Is it easy to add a new rule?
3. Code Review Questions - Reviewer.
   - Does the code "read like a story"?
   - Do the variable and function names reflect intent?
   - Did the refactoring preserve behavior?
4. How do we know that refactoring is safe?
5. When is "readability" more important than "cleverness"?
6. What would you improve next?
7. Is the algorithm deterministic?
   - What are the game states?
   - Is every state handled?
   - Can it be simplified?
8. Where is an error most likely to happen?
9. How can we prepare the code for rule changes?

# Testing

1. What is the difference between "specification" and "implementation"?
2. How can we use tests to drive implementation?
3. What is the "red-green-refactor" cycle?
   * Write a failing test that describes the new behavior.
   * Implement the minimum code to make the test pass.
   * Refactor the code while keeping the tests green.
4. How can we ensure that the tests are meaningful and not just testing implementation details?
   * Focus on testing behavior and outcomes rather than specific implementation.
   * Avoid testing private functions or internal state directly.
5. How can we maintain a good test suite as the codebase evolves?
   * Regularly review and update tests to reflect changes in requirements and implementation.
   * Remove or refactor tests that become obsolete or too tightly coupled to implementation details.
