import { describe, expect, it } from "vitest";
import { resolveStateTheme, SYSTEM_STATES } from "../state-theme-resolver";

describe("resolveStateTheme", () => {
  it.each(SYSTEM_STATES)("returns deterministic tokens for %s", (state) => {
    expect(resolveStateTheme(state)).toMatchSnapshot();
  });
});
