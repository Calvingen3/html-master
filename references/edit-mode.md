# Edit Mode

Every final `html-master` deck must be editable in the browser unless the user explicitly opts out.

## Minimum Contract

- A visible or discoverable edit toggle.
- Editable text elements using `contenteditable` or a controlled editor layer.
- Stable edit targets using `data-edit-id` or equivalent IDs.
- Persistence through `localStorage` by default.
- Export/download of the edited HTML when practical.
- Navigation guards while editing text.

## Stable IDs

Prefer explicit IDs:

```html
<h1 data-edit-id="slide-01-title" contenteditable="false">Launch Plan</h1>
```

When edit mode is enabled, the script can set `contenteditable="true"` for registered elements.

## Navigation Guard

While the active element is editable:

- arrow keys should move the caret, not the slide
- space should type a space, not advance
- escape may exit editing if clearly implemented
- click handlers should not hijack text selection

## Persistence

Use a namespaced key:

```js
const STORAGE_KEY = 'html-master:deck-edits:v1';
```

Save a map of `data-edit-id` to text/HTML. Restore it on page load after the DOM is ready.

## Export

The export action should produce an HTML file that includes current edits. A practical approach:

1. clone `document.documentElement`
2. remove transient edit UI state
3. serialize `<!doctype html>` plus the clone
4. create a Blob and download link

## Visual Discipline

Edit controls should not look like part of the presentation content. Keep them small, fixed, and hidden or muted during presentation mode.
