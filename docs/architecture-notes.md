# Architecture Notes

This project is intentionally small, but it includes patterns that documentation systems often need to recognize.

## Runtime Composition

`src/cli.js` creates the application by combining a storage adapter, dynamically imported rule modules, and the workflow engine.

## Extension Point

Files ending in `.rule.js` inside `src/rules/` are loaded at runtime. A rule must export a default object with:

- `name`
- `supports(event, ticket)`
- `apply(event, ticket)`

## Persistence Boundary

`JsonTicketStore` hides file IO from the workflow engine. The engine only expects `get(ticketId)` and `save(ticket)` methods.
