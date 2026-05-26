import { parseArgs } from "node:util";
import { JsonTicketStore } from "./storage/jsonTicketStore.js";
import { WorkflowEngine } from "./workflowEngine.js";
import { loadRules } from "./rules/loadRules.js";

const { values } = parseArgs({
  options: {
    seed: { type: "string", short: "s" },
    event: { type: "string", short: "e", multiple: true }
  }
});

const store = new JsonTicketStore(values.seed ?? "demo-data/tickets.json");
const rules = await loadRules(new URL("./rules/", import.meta.url));
const engine = new WorkflowEngine({ store, rules });

const events = values.event?.length ? values.event : ["assign:T-100:ava", "escalate:T-100"];

for (const rawEvent of events) {
  const result = await engine.dispatch(parseEvent(rawEvent));
  console.log(JSON.stringify(result, null, 2));
}

function parseEvent(rawEvent) {
  const [type, ticketId, value] = rawEvent.split(":");
  if (!type || !ticketId) {
    throw new Error(`Invalid event "${rawEvent}". Expected type:ticketId[:value].`);
  }

  return { type, ticketId, value, actor: "cli" };
}
