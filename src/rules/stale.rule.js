const STALE_AFTER_DAYS = 9;

export default {
  name: "stale-ticket-marker",

  supports(event, ticket) {
    return event.type === "reopen" && ticket.status === "triage";
  },

  async apply(event, ticket) {
    ticket.labels = Array.from(new Set([...(ticket.labels ?? []), "stale-risk"]));
    ticket.reviewAfterDays = STALE_AFTER_DAYS;
  }
};
