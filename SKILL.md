---
name: html-master
description: Use when the user wants an editable HTML presentation, HTML PPT, web slide deck, animated slide deck, or PPTX-to-HTML redesign from a PowerPoint source file or from a brief without a source PPT. Trigger for .ppt, .pptx, slides, deck, presentation, HTML slides, editable mode, built-in editing, frontend-slides, beautiful-html-templates, GSAP, advanced animation, template previews, PDF export, or Vercel deployment.
---

# HTML Master

## Overview

Create polished, editable HTML presentations by choosing one of two paths:

- **PPT source provided:** use `frontend-slides` to extract PPTX text/images, then redesign into HTML. Do not attempt faithful conversion.
- **No PPT source:** use `beautiful-html-templates` to pick a template through its preview workflow, then build the HTML deck.

Every delivered HTML deck must include an in-browser editing mode unless the user explicitly says not to.

## Dependency Check First

Before starting deck work, resolve the current agent's skill directory. Prefer an explicit environment variable, then common agent defaults:

```bash
if [ -n "${SKILL_ROOT:-}" ]; then
  :
elif [ -n "${CODEX_HOME:-}" ]; then
  SKILL_ROOT="$CODEX_HOME/skills"
elif [ -d "$HOME/.codex/skills" ]; then
  SKILL_ROOT="$HOME/.codex/skills"
elif [ -d "$HOME/.claude/skills" ]; then
  SKILL_ROOT="$HOME/.claude/skills"
elif [ -d "$HOME/.agents/skills" ]; then
  SKILL_ROOT="$HOME/.agents/skills"
else
  SKILL_ROOT="$HOME/.codex/skills"
fi
```

Then check local dependencies:

```bash
test -f "$SKILL_ROOT/gsap-core/SKILL.md"
test -f "$SKILL_ROOT/gsap-timeline/SKILL.md"
test -f "$SKILL_ROOT/gsap-scrolltrigger/SKILL.md"
test -f "$SKILL_ROOT/gsap-performance/SKILL.md"
test -f "$SKILL_ROOT/frontend-slides/SKILL.md"
test -f "$SKILL_ROOT/beautiful-html-templates/AGENTS.md"
```

If GSAP skills are missing, install the official GreenSock skills before continuing. Prefer `npx skills`:

```bash
npx skills add https://github.com/greensock/gsap-skills -g -y
```

If `npx skills` is unavailable, clone the official repo to a temporary location and copy the eight folders from `skills/` into `$SKILL_ROOT`:

```bash
tmp_dir="$(mktemp -d)"
git clone --depth 1 https://github.com/greensock/gsap-skills.git "$tmp_dir/gsap-skills"
mkdir -p "$SKILL_ROOT"
cp -R "$tmp_dir/gsap-skills/skills/gsap-core" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-timeline" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-scrolltrigger" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-plugins" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-utils" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-react" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-performance" "$SKILL_ROOT/"
cp -R "$tmp_dir/gsap-skills/skills/gsap-frameworks" "$SKILL_ROOT/"
```

If `frontend-slides` is missing, install it before continuing:

```bash
npx skills add https://github.com/zarazhangrui/frontend-slides -g -y
```

If `npx skills` is unavailable:

```bash
git clone --depth 1 https://github.com/zarazhangrui/frontend-slides.git "$SKILL_ROOT/frontend-slides"
```

If `beautiful-html-templates` is missing, clone it as a template library. It is not a normal single-skill folder, so `git clone` is the reliable path:

```bash
git clone --depth 1 https://github.com/zarazhangrui/beautiful-html-templates.git "$SKILL_ROOT/beautiful-html-templates"
```

For `frontend-slides` PPT extraction, prefer the repo-local venv if present:

```bash
"$SKILL_ROOT/frontend-slides/.venv/bin/python" "$SKILL_ROOT/frontend-slides/scripts/extract-pptx.py" <input.pptx> <output_dir>
```

If the venv is missing, create it and install `python-pptx` there. Do not force-install into Homebrew-managed system Python.

## Workflow Decision

1. If the user provides `.ppt` or `.pptx`, use **PPT redesign mode**.
2. If the user provides no PPT source and asks for a deck from a topic, outline, notes, or brief, use **template mode**.
3. If the user provides images or brand assets without PPT, still use template mode, but incorporate those assets into template selection and slide content.
4. After requirements and content collection are complete, but before generating the final deck, run the **Advanced Animation Gate**.

## PPT Redesign Mode

Use this path when the user provides a PowerPoint source file.

1. Inspect the file path and page count if possible.
2. If the deck is large, suggest doing a first 10-slide test before rebuilding the full deck. Do not block if the user already clearly asked for the whole deck.
3. Use `frontend-slides/scripts/extract-pptx.py` to extract slide text, images, and notes.
4. Summarize the extracted slide count, major sections, and image availability.
5. Rebuild the deck as HTML with new layout, animation, and refined visual design.
6. When the user has not requested a different look, keep the original PPTX's broad style direction: colors, tone, density, and business/formal/playful feel. Improve hierarchy, spacing, typography, motion, and composition.
7. Run the **Advanced Animation Gate** after extraction/style analysis and before final HTML generation.
8. Avoid fidelity conversion. Do not preserve exact coordinates, shape placement, or slide screenshots as the main output unless the user explicitly asks for visual reference comparison.
9. Include built-in edit mode in the generated HTML.
10. Verify the HTML in a browser and check for overflow, unreadable text, broken images, animation behavior, and navigation/edit mode behavior.

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

1. Ask for the occasion and desired mood/vibe.
2. Read `$SKILL_ROOT/beautiful-html-templates/index.json`.
3. Pick 3 distinct template candidates.
4. Build title-slide previews populated with the user's actual topic and context.
5. Open or present the preview paths and ask the user to choose.
6. Run the **Advanced Animation Gate** after the user chooses a template and before building the full deck.
7. Build the full HTML deck from the chosen template, preserving that template's fonts, palette, layout grammar, decorative vocabulary, and navigation.
8. Add or adapt layouts within the same template system when the user's content needs more slide types.
9. Include built-in edit mode in the generated HTML.
10. Verify the HTML in a browser and check responsiveness, navigation, text fit, animation behavior, and edit mode.

## Advanced Animation Gate

Before final HTML generation, ask the user whether to add advanced animation. Do this after all major requirements, PPT extraction, template choice, and content collection are complete.

Offer concise choices:

- **No advanced animation** — keep motion simple and presentation-safe.
- **Subtle premium motion** — refined entrances, staggered reveals, section transitions.
- **Cinematic motion** — stronger sequencing, parallax-like depth, dramatic title/section moments.
- **Scroll-driven / interactive motion** — GSAP ScrollTrigger, pinned sections, progress-linked animation.

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

All final HTML decks must support browser editing:

- Provide a visible or discoverable edit toggle.
- Allow text elements to be edited in place.
- Persist edits with `localStorage` by default.
- Provide an export/download action when practical so the edited HTML can be saved.
- Keep edit UI restrained and non-disruptive during presentation mode.
- Scope editable content with stable IDs or `data-edit-id` attributes so saved edits can be restored after reload.
- Keep slide navigation disabled or guarded while the user is actively editing text, so arrow keys and clicks do not accidentally change slides.

If using a template that lacks edit mode, add a small inline script and CSS layer without breaking the template's visual system.

## Delivery

Always report:

- HTML file path.
- Asset folder path if separate.
- Whether the output came from PPT redesign mode or template mode.
- Slide count.
- What was verified.
- Any remaining caveats, especially missing fonts, missing images, or skipped pages.

Offer PDF export or Vercel deployment only after the HTML is working locally.

## Common Mistakes

- Do not do faithful PPT-to-HTML conversion. This skill exists for redesign.
- Do not skip dependency checks; missing supporting skills are common.
- Do not ask template-choice questions when a PPTX source is already provided; extract and redesign instead.
- Do not use `beautiful-html-templates` by mixing multiple template systems in one deck.
- Do not remove built-in editing because a template did not originally include it.
- Do not skip the advanced-animation question once content requirements are clear.
- Do not use GSAP before confirming the user wants advanced animation, unless the user already explicitly asked for GSAP or advanced animation.
- Do not install Python packages into the Homebrew-managed system Python when a local venv is available or can be created.
