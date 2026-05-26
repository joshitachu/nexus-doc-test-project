export default {
  name: "escalation-watch",

  supports(event, ticket) {
    return event.type === "escalate" && ticket.priority === "urgent";
  },

  async apply(event, ticket) {
    ticket.watchers = Array.from(new Set([...(ticket.watchers ?? []), "ops-lead"]));
    ticket.labels = Array.from(new Set([...(ticket.labels ?? []), "needs-review"]));
  }
};
