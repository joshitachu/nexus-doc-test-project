export class WorkflowEngine {
  constructor({ store, rules = [] }) {
    this.store = store;
    this.rules = rules;
  }

  async dispatch(event) {
    const ticket = await this.store.get(event.ticketId);
    if (!ticket) {
      throw new Error(`Ticket ${event.ticketId} does not exist.`);
    }

    const nextTicket = applyTransition(ticket, event);

    for (const rule of this.rules) {
      if (rule.supports(event, nextTicket)) {
        await rule.apply(event, nextTicket);
      }
    }

    nextTicket.history.push({
      type: event.type,
      actor: event.actor ?? "system",
      at: new Date().toISOString()
    });

    return this.store.save(nextTicket);
  }
}

function applyTransition(ticket, event) {
  const nextTicket = structuredClone(ticket);

  switch (event.type) {
    case "assign":
      nextTicket.assignee = event.value;
      nextTicket.status = nextTicket.status === "open" ? "triage" : nextTicket.status;
      return nextTicket;
    case "escalate":
      nextTicket.priority = "urgent";
      nextTicket.status = "escalated";
      return nextTicket;
    case "resolve":
      nextTicket.status = "resolved";
      return nextTicket;
    case "reopen":
      nextTicket.status = "triage";
      return nextTicket;
    default:
      throw new Error(`Unsupported event type "${event.type}".`);
  }
}
