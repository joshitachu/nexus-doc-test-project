import assert from "node:assert/strict";
import test from "node:test";
import { WorkflowEngine } from "../src/workflowEngine.js";

test("dispatch applies transitions and matching rules", async () => {
  const saved = [];
  const store = {
    async get(ticketId) {
      return {
        id: ticketId,
        title: "Broken import",
        status: "open",
        priority: "normal",
        history: []
      };
    },
    async save(ticket) {
      saved.push(ticket);
      return ticket;
    }
  };
  const rules = [
    {
      supports: (event) => event.type === "escalate",
      apply: async (event, ticket) => {
        ticket.labels = ["needs-review"];
      }
    }
  ];

  const engine = new WorkflowEngine({ store, rules });
  const result = await engine.dispatch({ type: "escalate", ticketId: "T-1", actor: "test" });

  assert.equal(result.status, "escalated");
  assert.equal(result.priority, "urgent");
  assert.deepEqual(result.labels, ["needs-review"]);
  assert.equal(result.history.length, 1);
  assert.equal(saved.length, 1);
});

test("dispatch rejects unknown tickets", async () => {
  const engine = new WorkflowEngine({
    store: { get: async () => null },
    rules: []
  });

  await assert.rejects(
    () => engine.dispatch({ type: "resolve", ticketId: "missing" }),
    /does not exist/
  );
});
