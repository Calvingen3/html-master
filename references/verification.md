# Verification

Use this checklist before reporting an HTML deck as complete.

## Static Validator

Run:

```bash
node <SKILL_ROOT>/html-master/scripts/validate-html-deck.mjs path/to/index.html
```

The validator checks for common structural failures:

- no slide containers
- unresolved placeholders
- local machine paths in HTML
- missing local assets
- absent edit-mode markers
- absent navigation markers
- missing export/download signal

Treat validator errors as blockers. Warnings require judgment and should be reported if unresolved.

## Browser QA

Open the deck locally and check:

- first slide renders immediately
- slide navigation reaches every page
- final slide is reachable
- no unexpected vertical scroll inside slides
- text does not overlap or overflow its container
- images and media load
- console has no critical errors
- edit toggle works
- text edits persist after refresh
- export/download produces an HTML file when implemented
- animations do not block editing
- reduced-motion fallback exists when advanced animation is used

## Viewports

Check at least one desktop viewport. For public-facing or reusable decks, also check a narrow viewport or explicitly state that mobile was not optimized.

## Evidence To Report

In the final response, include:

- validator command result
- browser tested or not tested
- slide count
- known caveats

Do not claim screenshot-level QA if screenshots or browser capture timed out.
