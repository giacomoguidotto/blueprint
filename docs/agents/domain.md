# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root for the task-management glossary.
- **`docs/adr/`** for decisions that touch the area you're about to work in.

If a file does not exist in a future derived project, proceed silently. The producer skills create missing domain docs lazily when terms or decisions actually get resolved.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   └── agents/
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept in an issue title, refactor proposal, hypothesis, test name, or docs change, use the term as defined in `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If the concept you need is not in the glossary yet, either reconsider the term or note the gap for `/grill-with-docs`.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding it.

ADR status is authoritative:

- `Accepted` means live decision.
- `Superseded` means historical only.
- `Proposed` means not live yet.

Each ADR should show a status badge under the title and plain-text status metadata for agents.
