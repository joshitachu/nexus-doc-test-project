import assert from "node:assert/strict";
import test from "node:test";
import { loadRules } from "../src/rules/loadRules.js";

test("loadRules imports only rule modules in stable order", async () => {
  const rules = await loadRules(new URL("../src/rules/", import.meta.url));
  assert.deepEqual(
    rules.map((rule) => rule.name),
    ["escalation-watch", "resolution-cleanup"]
  );
});
