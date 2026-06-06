---
name: html-master
description: Use when creating, redesigning, validating, exporting, or improving editable HTML presentations, HTML PPTs, browser slide decks, animated web decks, or PPT/PPTX-to-HTML slide redesigns from source decks, briefs, outlines, notes, screenshots, brand assets, or template previews.
---

# HTML Master

## Overview

Create polished, editable HTML presentations by routing the task through the right source path, planning the deck before coding, and verifying the finished HTML like a production artifact.

Primary paths:

- **PPT source provided:** use `frontend-slides` to extract PPTX text/images, then redesign into HTML. Do not attempt faithful conversion.
- **No PPT source:** use `beautiful-html-templates` to pick a template through its preview workflow, then build the HTML deck.
- **Guizang-style requested:** route to `guizang-ppt-skill` when the user explicitly asks for Guizang, magazine, Swiss, Chinese launch-event, or horizontal swipe deck aesthetics.

Every delivered HTML deck must include an in-browser editing mode unless the user explicitly says not to.

## Dependency Check First

Before deck work, ensure these sibling skills/libraries exist in the current agent skill root:

- `frontend-slides`
- `beautiful-html-templates`
- GSAP skills: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`, plus related GSAP helpers when available
- `guizang-ppt-skill` when the user requests Guizang, magazine, Swiss, launch-event, or horizontal swipe deck style

Use `scripts/install-deps.sh` for deterministic setup. It accepts an explicit skill root, which is safest for Claude, OpenClaw, Hermes, or any machine with multiple agent skill folders:

```bash
./scripts/install-deps.sh <agent-skill-root>
```

If no argument is passed, the script infers the root from the installed `html-master` folder, then falls back to `SKILL_ROOT`, `CODEX_HOME`, and common agent defaults. It also creates `frontend-slides/.venv` and installs `python-pptx` there when needed. Do not install Python packages into a Homebrew-managed system Python.

For PPT extraction, prefer:

```bash
"$SKILL_ROOT/frontend-slides/.venv/bin/python" "$SKILL_ROOT/frontend-slides/scripts/extract-pptx.py" <input.pptx> <output_dir>
```

## Workflow Decision

1. If the user provides `.ppt` or `.pptx`, use **PPT redesign mode**.
2. If the user provides no PPT source and asks for a deck from a topic, outline, notes, or brief, use **template mode**.
3. If the user provides images or brand assets without PPT, still use template mode, but incorporate those assets into template selection and slide content.
4. If the user requests Guizang, magazine, Swiss, launch-event, Chinese social-share, or horizontal swipe deck style, use **Guizang route**.
5. After requirements and content collection are complete, but before generating the final deck, run the **Deck Planning Gate** and **Advanced Animation Gate**.

## Reference Files

Load these only when relevant:

- `references/workflow-gates.md` - required gates, handoff points, and when to pause for user choice.
- `references/deck-planning.md` - page-role table, content-density decisions, layout mapping, and theme rhythm.
- `references/asset-handling.md` - image, screenshot, PPT asset, and local path rules.
- `references/edit-mode.md` - browser edit mode contract and implementation checklist.
- `references/verification.md` - browser QA checklist and validator usage.

## Deck Planning Gate

Before generating the final HTML, create a compact deck plan. Read `references/deck-planning.md` when the deck has more than 3 slides, uses templates, includes screenshots/images, or must be presentation-ready.

The plan must cover:

- slide count and section rhythm
- each slide's role, content density, and layout strategy
- image/screenshot slots and expected aspect ratios
- template or visual system to use
- edit mode requirements
- verification approach

Do not write the final deck until the plan is internally consistent. If the plan exposes a missing critical input, ask only the smallest number of questions needed to continue.

## PPT Redesign Mode

Use this path when the user provides a PowerPoint source file.

1. Inspect the file path and page count if possible.
2. If the deck is large, suggest doing a first 10-slide test before rebuilding the full deck. Do not block if the user already clearly asked for the whole deck.
3. Use `frontend-slides/scripts/extract-pptx.py` to extract slide text, images, and notes.
4. Summarize the extracted slide count, major sections, and image availability.
5. Run the **Deck Planning Gate** before rebuilding.
6. Rebuild the deck as HTML with new layout, animation, and refined visual design.
7. When the user has not requested a different look, keep the original PPTX's broad style direction: colors, tone, density, and business/formal/playful feel. Improve hierarchy, spacing, typography, motion, and composition.
8. Avoid fidelity conversion. Do not preserve exact coordinates, shape placement, or slide screenshots as the main output unless the user explicitly asks for visual reference comparison.
9. Include built-in edit mode in the generated HTML.
10. Verify the HTML in a browser and run `scripts/validate-html-deck.mjs`.

### PPT Redesign Requirements

- Preserve meaning, slide order, important images, and speaker notes where useful.
- Redesign for clarity and premium visual quality, not pixel matching.
- Split crowded slides instead of shrinking everything.
- Use animations deliberately: entrance choreography, section transitions, progressive reveal, or scroll/keyboard slide navigation.
- Keep every slide within one viewport; no accidental scrolling inside slides.
- Use relative image paths and bundle assets next to the HTML.

## Template Mode

Use this path when the user has no source PPT.

Follow `beautiful-html-templates`' original workflow:

1. Ask for the occasion and desired mood/vibe if not already clear.
2. Read `$SKILL_ROOT/beautiful-html-templates/AGENTS.md` for the current template-selection instructions.
3. Read `$SKILL_ROOT/beautiful-html-templates/index.json`.
4. Pick 3 distinct template candidates.
5. Build title-slide previews populated with the user's actual topic and context.
6. Open or present the preview paths and ask the user to choose.
7. Run the **Deck Planning Gate** after the user chooses a template and before building the full deck.
8. Run the **Template/Class Preflight** before writing slide markup.
9. Build the full HTML deck from the chosen template, preserving that template's fonts, palette, layout grammar, decorative vocabulary, and navigation.
10. Add or adapt layouts within the same template system when the user's content needs more slide types.
11. Include built-in edit mode in the generated HTML.
12. Verify the HTML in a browser and run `scripts/validate-html-deck.mjs`.

## Template/Class Preflight

Before writing template-based slide markup:

1. Read the selected template's HTML/CSS at least through the main `<style>` block.
2. Identify the real slide container, navigation model, layout classes, typography classes, image wrappers, and theme variables.
3. Use existing classes whenever possible.
4. Do not invent class names that the template does not define unless you also add the matching CSS in the output file.
5. Keep one visual system per deck. Do not mix multiple template systems in one HTML file.
6. For every new class you add, confirm it is used and scoped to this deck.

If a template lacks a needed layout, create a small compatible extension inside the same visual grammar instead of importing another template.

## Guizang Route

Use this route only when the user explicitly wants Guizang-style output or when their wording clearly matches it: `Guizang`, `guizang-ppt-skill`, `归藏`, `杂志风 PPT`, `Swiss Style`, `瑞士风`, `horizontal swipe deck`, Chinese launch-event slides, or strong presentation/showcase HTML.

When using this route:

1. Read `guizang-ppt-skill/SKILL.md` first.
2. Follow its style selection between magazine and Swiss modes.
3. Use its templates, references, and validator instead of duplicating its style rules here.
4. Keep `html-master` responsible for intake, edit-mode expectations, export/deployment decisions, and final delivery summary.
5. Do not make Guizang style the default for ordinary business decks unless the user asks for that style.

## Asset Handling Gate

Read `references/asset-handling.md` whenever the deck includes images, screenshots, PPT-extracted media, local fonts, video, audio, or downloadable exports.

Hard rules:

- Final HTML must use relative paths for bundled local assets.
- Do not leave `/Users/...`, `/Volumes/...`, `file://`, temporary extraction paths, or private machine paths in delivered HTML.
- Every local image or media reference must point to a file that exists next to the deck or in a bundled asset folder.
- Screenshots must be placed into explicit slots with target aspect ratios; do not stretch arbitrary screenshots to fit.
- Sensitive screenshot content must be masked or confirmed before use.

## Advanced Animation Gate

Before final HTML generation, ask the user whether to add advanced animation. Do this after all major requirements, PPT extraction, template choice, content collection, and deck planning are complete.

Offer concise choices:

- **No advanced animation** - keep motion simple and presentation-safe.
- **Subtle premium motion** - refined entrances, staggered reveals, section transitions.
- **Cinematic motion** - stronger sequencing, parallax-like depth, dramatic title/section moments.
- **Scroll-driven / interactive motion** - GSAP ScrollTrigger, pinned sections, progress-linked animation.

If the user chooses any advanced animation option:

1. Use the relevant local GSAP skills before coding:
   - Always read `gsap-core`, `gsap-timeline`, and `gsap-performance`.
   - Read `gsap-scrolltrigger` for scroll-linked, pinned, parallax, or progress-driven decks.
   - Read `gsap-plugins` when using Flip, Draggable, SplitText, MorphSVG, DrawSVG, or similar plugins.
2. Prefer GSAP for complex sequencing and scroll-linked animation; CSS-only motion is still acceptable for small UI transitions.
3. Keep animation compatible with edit mode: editing controls must remain responsive, selectable, and not trapped by animation layers.
4. Include `prefers-reduced-motion` handling or an internal reduced-motion fallback.
5. Verify animation in browser, including first slide load, slide changes, and edit mode toggle.

If the user says no, still include tasteful basic transitions if appropriate, but do not use advanced GSAP choreography.

## Built-In Edit Mode

All final HTML decks must support browser editing. Read `references/edit-mode.md` before adding or modifying edit mode.

Minimum contract:

- Provide a visible or discoverable edit toggle.
- Allow text elements to be edited in place.
- Persist edits with `localStorage` by default.
- Provide an export/download action when practical so the edited HTML can be saved.
- Keep edit UI restrained and non-disruptive during presentation mode.
- Scope editable content with stable IDs or `data-edit-id` attributes so saved edits can be restored after reload.
- Keep slide navigation disabled or guarded while the user is actively editing text, so arrow keys and clicks do not accidentally change slides.

If using a template that lacks edit mode, add a small inline script and CSS layer without breaking the template's visual system.

## Verification

Before claiming the deck is complete, read `references/verification.md` and perform the strongest practical checks:

```bash
node <SKILL_ROOT>/html-master/scripts/validate-html-deck.mjs path/to/index.html
```

Also open the deck in a browser when possible and check:

- slide navigation
- first load and final slide
- edit toggle, text editing, persistence, and export/download
- image/media loading
- text overflow and viewport fit
- animation behavior and reduced-motion fallback when applicable
- console errors and obvious network failures

## Delivery

Always report:

- HTML file path.
- Asset folder path if separate.
- Whether the output came from PPT redesign mode, template mode, or Guizang route.
- Slide count.
- What was verified.
- Any remaining caveats, especially missing fonts, missing images, skipped pages, blocked browser QA, or skipped export.

Offer PDF export or deployment only after the HTML is working locally.

## Common Mistakes

- Do not do faithful PPT-to-HTML conversion. This skill exists for redesign.
- Do not skip dependency checks; missing supporting skills are common.
- Do not skip deck planning on production decks.
- Do not ask template-choice questions when a PPTX source is already provided; extract and redesign instead.
- Do not use `beautiful-html-templates` by mixing multiple template systems in one deck.
- Do not invent template classes without adding CSS.
- Do not leave local machine paths in final HTML.
- Do not remove built-in editing because a template did not originally include it.
- Do not skip the advanced-animation question once content requirements are clear.
- Do not use GSAP before confirming the user wants advanced animation, unless the user already explicitly asked for GSAP or advanced animation.
- Do not install Python packages into the Homebrew-managed system Python when a local venv is available or can be created.
