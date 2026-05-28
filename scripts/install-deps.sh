#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[html-master] %s\n' "$*"
}

resolve_skill_root() {
  if [ "${1:-}" != "" ]; then
    printf '%s\n' "$1"
    return
  fi

  local script_dir skill_dir parent_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  skill_dir="$(cd "$script_dir/.." && pwd)"
  parent_dir="$(cd "$skill_dir/.." && pwd)"

  if [ "$(basename "$skill_dir")" = "html-master" ]; then
    printf '%s\n' "$parent_dir"
  elif [ "${SKILL_ROOT:-}" != "" ]; then
    printf '%s\n' "$SKILL_ROOT"
  elif [ "${CODEX_HOME:-}" != "" ]; then
    printf '%s\n' "$CODEX_HOME/skills"
  elif [ -d "$HOME/.codex/skills" ]; then
    printf '%s\n' "$HOME/.codex/skills"
  elif [ -d "$HOME/.claude/skills" ]; then
    printf '%s\n' "$HOME/.claude/skills"
  elif [ -d "$HOME/.agents/skills" ]; then
    printf '%s\n' "$HOME/.agents/skills"
  else
    printf '%s\n' "$HOME/.codex/skills"
  fi
}

has_gsap_skills() {
  [ -f "$SKILL_ROOT/gsap-core/SKILL.md" ] &&
    [ -f "$SKILL_ROOT/gsap-timeline/SKILL.md" ] &&
    [ -f "$SKILL_ROOT/gsap-scrolltrigger/SKILL.md" ] &&
    [ -f "$SKILL_ROOT/gsap-performance/SKILL.md" ]
}

copy_gsap_from_clone() {
  local tmp_dir
  tmp_dir="$(mktemp -d)"
  git clone --depth 1 https://github.com/greensock/gsap-skills.git "$tmp_dir/gsap-skills"
  mkdir -p "$SKILL_ROOT"
  for skill in gsap-core gsap-timeline gsap-scrolltrigger gsap-plugins gsap-utils gsap-react gsap-performance gsap-frameworks; do
    if [ ! -d "$SKILL_ROOT/$skill" ]; then
      cp -R "$tmp_dir/gsap-skills/skills/$skill" "$SKILL_ROOT/"
    fi
  done
}

ensure_gsap() {
  if has_gsap_skills; then
    log "GSAP skills found"
    return
  fi

  log "Installing GSAP skills"
  copy_gsap_from_clone

  if ! has_gsap_skills; then
    log "GSAP install did not produce required skill folders"
    return 1
  fi
}

ensure_frontend_slides() {
  if [ -f "$SKILL_ROOT/frontend-slides/SKILL.md" ]; then
    log "frontend-slides found"
  else
    log "Installing frontend-slides"
    git clone --depth 1 https://github.com/zarazhangrui/frontend-slides.git "$SKILL_ROOT/frontend-slides"
  fi

  if [ ! -f "$SKILL_ROOT/frontend-slides/scripts/extract-pptx.py" ]; then
    log "frontend-slides is missing scripts/extract-pptx.py"
    return 1
  fi

  if [ ! -x "$SKILL_ROOT/frontend-slides/.venv/bin/python" ]; then
    log "Creating frontend-slides Python virtual environment"
    python3 -m venv "$SKILL_ROOT/frontend-slides/.venv"
    "$SKILL_ROOT/frontend-slides/.venv/bin/python" -m pip install --upgrade pip
    "$SKILL_ROOT/frontend-slides/.venv/bin/python" -m pip install python-pptx
  fi
}

ensure_templates() {
  if [ -f "$SKILL_ROOT/beautiful-html-templates/AGENTS.md" ] &&
    [ -f "$SKILL_ROOT/beautiful-html-templates/index.json" ]; then
    log "beautiful-html-templates found"
    return
  fi

  log "Installing beautiful-html-templates"
  git clone --depth 1 https://github.com/zarazhangrui/beautiful-html-templates.git "$SKILL_ROOT/beautiful-html-templates"
}

SKILL_ROOT="$(resolve_skill_root "${1:-}")"
export SKILL_ROOT

mkdir -p "$SKILL_ROOT"
log "Using skill root: $SKILL_ROOT"

ensure_gsap
ensure_frontend_slides
ensure_templates

log "Dependency check complete"
