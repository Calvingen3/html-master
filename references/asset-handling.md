# Asset Handling

Use this reference whenever a deck contains images, screenshots, extracted PPT media, fonts, video, audio, or generated exports.

## Folder Pattern

Prefer a self-contained folder:

```text
presentation-name/
  index.html
  assets/
    images/
    media/
    fonts/
```

Small one-off decks may use `images/` next to `index.html`, but the final HTML must still use relative paths.

## Naming

Use stable, short, English file names:

```text
01-cover.jpg
03-dashboard.png
06-process-diagram.svg
09-customer-quote.mp4
```

Avoid spaces, Chinese punctuation, temporary extraction names, and random screenshot timestamps in final references.

## Local Path Rules

Final HTML must not contain:

- `/Users/...`
- `/Volumes/...`
- `/private/tmp/...`
- `file://...`
- extraction work directories
- user-specific cloud sync paths

Use relative paths from the HTML file to the asset.

## Screenshot Slots

For every screenshot, decide the slot before inserting it:

| Use | Ratio |
|-----|-------|
| hero product screenshot | 16:9 or 21:9 |
| dashboard / UI evidence | 16:10 |
| phone screen | 9:16 or 3:4 |
| social card | 1:1 or 4:5 |
| comparison grid | one shared ratio for all images |

Do not stretch screenshots. Crop, pad, or redesign the placement instead.

## Sensitive Content

Before using screenshots, check for:

- private names, phone numbers, addresses, IDs
- API keys, tokens, cookies, QR codes
- customer data, financial records, internal URLs

Mask or ask before including sensitive material.

## PPT-Extracted Assets

When using `frontend-slides` extraction:

1. Keep the raw extraction folder for traceability.
2. Copy only selected assets into the final deck folder.
3. Rename selected assets by slide number and meaning.
4. Reference only the copied assets in final HTML.
5. Do not use slide screenshots as the main output unless the user asked for visual comparison.

## Asset Verification

Run the validator before delivery:

```bash
node <SKILL_ROOT>/html-master/scripts/validate-html-deck.mjs path/to/index.html
```

Then open the deck in a browser and check that all images/media load without broken icons.
