export default {
  name: "resolution-cleanup",

  supports(event, ticket) {
    return event.type === "resolve" && ticket.status === "resolved";
  },

  async apply(event, ticket) {
    ticket.labels = (ticket.labels ?? []).filter((label) => label !== "needs-review");
    ticket.resolvedBy = event.actor ?? "system";
  }
};
