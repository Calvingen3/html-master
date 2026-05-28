# HTML Master

`html-master` is an Agent Skill for creating editable, polished HTML presentations.

It supports two workflows:

- **PPTX redesign:** extract text/images from a PowerPoint file, then rebuild it as a redesigned HTML deck. It intentionally avoids pixel-perfect conversion.
- **Template-first creation:** when no PPTX is provided, use `beautiful-html-templates` to choose a visual system, preview options, and build the deck.

Every final HTML deck should include built-in editing mode. Before final generation, the skill asks whether to add advanced animation; if selected, it uses GSAP skills.

## Install

### Codex

```bash
npx skills add https://github.com/Calvingen3/html-master -g -y
```

Manual install:

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
git clone https://github.com/Calvingen3/html-master "${CODEX_HOME:-$HOME/.codex}/skills/html-master"
```

Restart Codex after installation.

Install supporting skills and PPTX extraction dependencies:

```bash
"${CODEX_HOME:-$HOME/.codex}/skills/html-master/scripts/install-deps.sh" "${CODEX_HOME:-$HOME/.codex}/skills"
```

### Claude Code

If your Claude Code setup supports the Skills CLI:

```bash
npx skills add https://github.com/Calvingen3/html-master -g -y
```

Manual install:

```bash
mkdir -p "$HOME/.claude/skills"
git clone https://github.com/Calvingen3/html-master "$HOME/.claude/skills/html-master"
```

Restart Claude Code after installation.

Install supporting skills and PPTX extraction dependencies:

```bash
"$HOME/.claude/skills/html-master/scripts/install-deps.sh" "$HOME/.claude/skills"
```

### Hermes / OpenClaw / Other Agents

This skill is portable if the agent can load Agent Skills-style folders containing `SKILL.md`.

Install by cloning this repository into that agent's configured skills directory:

```bash
mkdir -p <agent-skill-root>
git clone https://github.com/Calvingen3/html-master <agent-skill-root>/html-master
```

Then install supporting skills into the same root:

```bash
<agent-skill-root>/html-master/scripts/install-deps.sh <agent-skill-root>
```

If the agent does not support Agent Skills directly, use `SKILL.md` as an instruction file or system prompt attachment.

## Offline Install

If GitHub is unavailable on the target machine, use the offline bundle zip instead of cloning. Unzip it locally, then copy or install the bundled `skills/` folders into the target agent's skill root.

```bash
unzip html-master-offline-bundle-*.zip
cd html-master-offline-bundle-*
./offline-install.sh <agent-skill-root>
```

The offline bundle should include:

- `html-master`
- `frontend-slides`
- `beautiful-html-templates`
- GSAP skills from `greensock/gsap-skills`

After offline install, run the dependency script once to verify paths and create `frontend-slides/.venv` when Python is available:

```bash
<agent-skill-root>/html-master/scripts/install-deps.sh <agent-skill-root>
```

## Runtime Dependencies

`html-master` checks and installs supporting skills through `scripts/install-deps.sh`:

- `greensock/gsap-skills`
- `zarazhangrui/frontend-slides`
- `zarazhangrui/beautiful-html-templates`

`frontend-slides` may need `python-pptx` for PPTX extraction. The skill prefers a local virtual environment and avoids forcing packages into a system-managed Python.

## Usage Examples

Turn a source PPTX into a redesigned editable HTML deck:

```text
Use $html-master to redesign this PPTX into an editable HTML presentation.
```

Create a new deck from a brief:

```text
Use $html-master to make a polished HTML presentation about our product launch.
```

Ask for advanced motion:

```text
Use $html-master and add cinematic GSAP animation.
```

## Behavior Notes

- PPTX input uses redesign, not faithful conversion.
- Large PPTX files may be tested on the first 10 slides before rebuilding the full deck.
- If no PPTX is provided, the skill follows the `beautiful-html-templates` preview workflow.
- Final HTML must include edit mode unless the user explicitly opts out.
- PDF export or Vercel deployment should happen after local browser verification.

## Repository Layout

```text
html-master/
  SKILL.md
  README.md
  LICENSE
  agents/
    openai.yaml
  scripts/
    install-deps.sh
```
