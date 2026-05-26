# Nexus Doc Test Project

This is a tiny event-driven workflow simulator designed to be small enough to inspect quickly, but dynamic enough to test documentation tools.

## What It Does

The app manages support tickets. Tickets move through a workflow based on events, rule plugins, and a JSON storage adapter.

Run it:

```bash
npm test
npm start -- --seed demo-data/tickets.json --event escalate:T-100
```

## Key Concepts

- `WorkflowEngine` owns ticket state transitions.
- Rule plugins in `src/rules/` can react to events and mutate ticket metadata.
- `JsonTicketStore` provides async persistence over a local JSON file.
- The CLI wires together storage, rules, and event dispatch.

## Example Event Names

- `assign:T-100:ava`
- `escalate:T-100`
- `resolve:T-100`
- `reopen:T-100`

This project is intentionally compact and has a few non-trivial paths for documentation extraction: dynamic imports, async file IO, plugin registration, state transitions, and test coverage.
