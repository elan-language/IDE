import { AssertOutcome } from "./system";

export function runTests(
  tests: [string, (_outcomes: AssertOutcome[]) => void][],
) {
  const allOutcomes: [string, AssertOutcome[]][] = [];

  for (const t of tests) {
    const outcomes: AssertOutcome[] = [];
    t[1](outcomes);
    allOutcomes.push([t[0], outcomes]);
  }

  // clear tests each time or the tests array in the program gets duplicates
  tests.length = 0;

  return allOutcomes;
}
