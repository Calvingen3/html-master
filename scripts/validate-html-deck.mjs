#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const usage = 'Usage: node scripts/validate-html-deck.mjs <index.html> [--allow-no-edit] [--allow-no-export]';
const file = process.argv[2];
const allowNoEdit = process.argv.includes('--allow-no-edit');
const allowNoExport = process.argv.includes('--allow-no-export');

if (!file || file.startsWith('-')) {
  console.error(usage);
  process.exit(2);
}

const htmlPath = resolve(process.cwd(), file);
let html = '';
try {
  html = readFileSync(htmlPath, 'utf8');
} catch (error) {
  console.error(`Cannot read HTML file: ${htmlPath}`);
  console.error(error.message);
  process.exit(2);
}

const baseDir = dirname(htmlPath);
const errors = [];
const warnings = [];
const stripped = html.replace(/<!--([\s\S]*?)-->/g, '');

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

const slideTags = [...stripped.matchAll(/<(?:section|div)\b[^>]*>/gi)].map((match) => match[0]);
const slideCount = slideTags.filter((tag) => {
  const hasSlideClass = /\bclass=["'][^"']*\bslide\b[^"']*["']/i.test(tag);
  const hasDataSlide = /\bdata-slide(?:\b|=)/i.test(tag);
  return hasSlideClass || hasDataSlide;
}).length;
if (!slideCount) {
  addError('No slide containers found. Expected <section class="slide">, <div class="slide">, or data-slide markers.');
}

if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(html)) {
  addWarning('Missing useful <title>.');
}

const placeholderPatterns = [
  /\[必填\]/,
  /TODO|FIXME|PLACEHOLDER/i,
  /lorem ipsum/i,
  /替换为|待补充|待填写/,
];
for (const pattern of placeholderPatterns) {
  if (pattern.test(stripped)) addError(`Unresolved placeholder matched: ${pattern}`);
}

const privatePathPatterns = [
  /(?:src|href)=["']file:\/\/[^"']+["']/i,
  /(?:src|href)=["'](?:\/Users\/|\/Volumes\/|\/private\/tmp\/)[^"']+["']/i,
  /(?:\/Users\/|\/Volumes\/|\/private\/tmp\/)[^\s"'<>)]*/i,
];
for (const pattern of privatePathPatterns) {
  if (pattern.test(html)) addError(`Local machine path found: ${pattern}`);
}

const attrRe = /\b(?:src|href|poster)=["']([^"']+)["']/gi;
const localRefs = [];
for (const match of html.matchAll(attrRe)) {
  const ref = match[1].trim();
  if (!ref || ref.startsWith('#')) continue;
  if (/^(?:https?:|mailto:|tel:|data:|blob:|javascript:)/i.test(ref)) continue;
  if (ref.startsWith('/')) {
    addError(`Absolute local asset path is not portable: ${ref}`);
    continue;
  }
  const cleanRef = ref.split('#')[0].split('?')[0];
  if (!cleanRef) continue;
  localRefs.push(cleanRef);
}

for (const ref of [...new Set(localRefs)]) {
  const candidate = resolve(baseDir, decodeURIComponent(ref));
  if (!existsSync(candidate)) addError(`Referenced local asset does not exist: ${ref}`);
}

if (/\b(?:src|href|poster)=["']\s*["']/i.test(html)) {
  addError('Empty src/href/poster attribute found.');
}

const hasEditableTargets = /contenteditable|data-edit-id|data-editable|\bedit-mode\b|\beditMode\b/i.test(html);
const hasPersistence = /localStorage|indexedDB/i.test(html);
const hasEditToggle = /edit-toggle|toggle-edit|data-edit-toggle|编辑|Edit Mode|editMode/i.test(html);
if (!allowNoEdit) {
  if (!hasEditableTargets) addError('No edit-mode target markers found. Expected contenteditable, data-edit-id, or equivalent.');
  if (!hasPersistence) addError('No edit persistence found. Expected localStorage or equivalent.');
  if (!hasEditToggle) addWarning('No obvious edit toggle found. Ensure edit mode is discoverable.');
}

const hasExport = /download=|URL\.createObjectURL|new Blob|export-html|data-export|导出|下载|Export/i.test(html);
if (!allowNoExport && !hasExport) {
  addWarning('No obvious export/download implementation found. Add one or explain why it is skipped.');
}

const hasNavigation = /keydown|ArrowRight|ArrowLeft|nextSlide|prevSlide|data-next|data-prev|class=["'][^"']*\bnext\b|class=["'][^"']*\bprev\b|swiper|reveal/i.test(html);
if (!hasNavigation) {
  addWarning('No obvious slide navigation markers found. Verify navigation manually.');
}

const externalScripts = [...html.matchAll(/<script\b[^>]*src=["'](https?:\/\/[^"']+)["'][^>]*>/gi)].map((m) => m[1]);
if (externalScripts.length) {
  addWarning(`External script dependency detected: ${externalScripts.join(', ')}`);
}

if (warnings.length) {
  console.warn('Warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error('HTML deck validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`HTML deck validation passed: ${slideCount} slide marker(s), ${new Set(localRefs).size} local asset reference(s).`);
