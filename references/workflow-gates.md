# Workflow Gates

Use these gates to keep `html-master` work from drifting into unplanned slide generation.

## Gate Order

1. **Source gate** - classify the input as PPT redesign, template mode, or Guizang route.
2. **Dependency gate** - confirm required sibling skills and extraction tools exist.
3. **Content gate** - confirm topic, audience, source material, must-include content, and hard exclusions.
4. **Deck Planning Gate** - produce a page-role plan before final HTML generation.
5. **Template/Class Preflight** - inspect the selected template before writing markup.
6. **Asset Handling Gate** - normalize images, screenshots, media, and local paths.
7. **Advanced Animation Gate** - ask about motion level after content and style are known.
8. **Edit Mode Gate** - ensure the deck can be edited and exported.
9. **Verification Gate** - run static validation plus browser QA where possible.

## When To Ask The User

Ask only when the answer changes the result materially:

- target audience or use occasion is unknown
- source deck intent is unclear
- template choice is required
- style route is ambiguous between ordinary template mode and Guizang route
- sensitive screenshot content may be exposed
- advanced animation level has not been chosen

If the missing detail does not block progress, make a reasonable assumption and record it in the deck plan.

## Small-Deck Shortcut

For decks with 1-3 simple slides, keep the plan compact:

```text
Mode: template mode
Visual system: selected template name
Slides: 1 title, 1 problem, 1 recommendation
Assets: none
Edit mode: required
Verification: static validator + browser navigation/edit check
```

Do not skip edit mode or validation because the deck is small.
