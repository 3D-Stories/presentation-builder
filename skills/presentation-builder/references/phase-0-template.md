# Phase 0: Template Analysis

## Prerequisite

Phase 0 runs ONLY when the user provides an existing PPTX template file.
If no template is provided, SKIP this phase entirely and advance to Phase 1.

Ask during initial setup:

> "Do you have an existing branded PPTX template I should extract colors,
> fonts, and assets from? If so, provide the file path."

If the user provides a template path, verify it exists and has a `.pptx`
extension before proceeding. If it doesn't exist, ask again.

## Process

### 1. Unzip the PPTX

PPTX files are ZIP archives. Extract to a temp directory:

```bash
TEMPLATE_DIR=$(mktemp -d)
unzip -o "<template-path>" -d "$TEMPLATE_DIR"
```

The relevant internal structure:

```
ppt/
  theme/
    theme1.xml        -- Brand colors and fonts
  slideMasters/
    slideMaster1.xml  -- Master slide layouts
  slideLayouts/
    slideLayout*.xml  -- Individual layout definitions
  media/
    image1.png        -- Logos, backgrounds, patterns, photos
    image2.jpg
    ...
```

### 2. Extract media assets

Copy all files from `ppt/media/` to `template-assets/` in the project root:

```bash
mkdir -p template-assets
cp "$TEMPLATE_DIR"/ppt/media/* template-assets/ 2>/dev/null || true
```

Count the extracted assets:

```bash
ls template-assets/ | wc -l
```

If 0 assets extracted, note this in the analysis — the template uses only
shapes and colors with no embedded images.

### 3. Parse theme XML

Read `ppt/theme/theme1.xml` and extract:

**Color scheme** (`a:clrScheme`):
- `dk1` / `dk2` — dark colors (typically text on light backgrounds)
- `lt1` / `lt2` — light colors (typically text on dark backgrounds)
- `accent1` through `accent6` — brand accent colors
- `hlink` / `folHlink` — hyperlink colors

Each color element contains either:
- `<a:srgbClr val="RRGGBB"/>` — direct hex color
- `<a:sysClr val="windowText" lastClr="000000"/>` — system color with fallback

Extract ALL hex values. Map each to its role.

**Font scheme** (`a:fontScheme`):
- `majorFont` → title/heading font family
- `minorFont` → body text font family

Each font element has `<a:latin typeface="FontName"/>` — extract the typeface.

**Parsing approach:**
Use `grep` and `sed` for extraction — do NOT install XML parsing libraries.
The theme XML structure is consistent across PowerPoint versions:

```bash
# Colors
grep -oP 'name="[^"]*"' "$TEMPLATE_DIR/ppt/theme/theme1.xml" | head -20
grep -oP 'srgbClr val="[A-Fa-f0-9]{6}"' "$TEMPLATE_DIR/ppt/theme/theme1.xml"
grep -oP 'lastClr="[A-Fa-f0-9]{6}"' "$TEMPLATE_DIR/ppt/theme/theme1.xml"

# Fonts
grep -oP 'typeface="[^"]*"' "$TEMPLATE_DIR/ppt/theme/theme1.xml" | sort -u
```

### 4. Classify and rename assets

For each file in `template-assets/`, determine what it is:

**Classification by inspection:**
- Check dimensions: wide/short images are likely backgrounds or banners
- Check file size: very small files (<5KB) are likely icons or decorative elements
- Check format: SVG/EMF files are vector graphics (logos, shapes)
- Check transparency: PNG files with alpha channel are likely logos or overlays

**Naming convention:**
Rename from generic names to semantic names:

| Original | Renamed to | Classification |
|----------|-----------|----------------|
| `image1.png` | `logo-primary.png` | Logo (transparent, small) |
| `image2.jpg` | `bg-dark-gradient.jpg` | Background (wide, dark) |
| `image3.png` | `pattern-diagonal.png` | Pattern (repeating, decorative) |
| `image4.jpg` | `photo-hero.jpg` | Photo (large, photographic) |

Use these heuristics:
- **Transparent PNG with text/symbol** → `logo-*.png`
- **Full-slide dimensions (wide)** → `bg-*.{jpg,png}`
- **Repeating pattern or stripe** → `pattern-*.{jpg,png}`
- **Photographic content** → `photo-*.{jpg,png}`
- **Small decorative element** → `decor-*.{jpg,png}`
- **Icon or symbol** → `icon-*.{jpg,png}`

If classification is uncertain, prefix with `unknown-` and note it in the
analysis for user review.

Rename command pattern:
```bash
mv template-assets/image1.png template-assets/logo-primary.png
```

### 5. Generate template-analysis.md

Write `template-analysis.md` at the project root with all extracted data:

```markdown
# Template Analysis

Extracted from: `<original-filename>.pptx`
Date: YYYY-MM-DD

## Color Palette

| Role | Hex | Name | Usage |
|------|-----|------|-------|
| Dark 1 | `RRGGBB` | [name] | Primary text on light backgrounds |
| Dark 2 | `RRGGBB` | [name] | Secondary text |
| Light 1 | `RRGGBB` | [name] | Text on dark backgrounds |
| Light 2 | `RRGGBB` | [name] | Secondary light text |
| Accent 1 | `RRGGBB` | [name] | Primary brand accent |
| Accent 2 | `RRGGBB` | [name] | Secondary accent |
| ... | ... | ... | ... |

## Font Families

| Role | Font | Fallback |
|------|------|----------|
| Titles (majorFont) | [extracted font] | [system-safe alternative] |
| Body (minorFont) | [extracted font] | [system-safe alternative] |

## Extracted Assets

| File | Classification | Dimensions | Notes |
|------|---------------|------------|-------|
| `template-assets/logo-primary.png` | Logo | NxN | Transparent background |
| `template-assets/bg-dark-gradient.jpg` | Background | NxN | Dark slide background |
| ... | ... | ... | ... |

## Slide Layout Summary

[Brief description of the template's slide master patterns:
which layouts exist, which use dark vs light backgrounds,
where logos are placed, etc.]

## Recommendations for Style Guide

- **Primary color:** [hex] — use for section dividers and title slides
- **Secondary color:** [hex] — use for content slide accents
- **Title font:** [font name] — verify availability on target system
- **Body font:** [font name] — verify availability on target system
- **Reusable assets:** [list which extracted assets to use in the deck]
- **Assets to skip:** [list which are template-specific chrome not needed]
```

### 6. Clean up

Remove the temp directory:

```bash
rm -rf "$TEMPLATE_DIR"
```

## Phase-complete gate

Phase 0 is NOT complete until ALL of the following hold:

1. `template-analysis.md` exists at the project root.
2. `template-analysis.md` contains a Color Palette table with at least 4
   colors extracted (dk1, lt1, accent1, accent2 minimum).
3. `template-analysis.md` contains a Font Families table with at least 2
   rows (major and minor font).
4. `template-assets/` directory exists and contains the extracted files
   (count matches the number listed in the Assets table).
5. Assets have been renamed from generic names to semantic names (no
   `imageN.{ext}` files remain unless classification was genuinely
   impossible — in which case the file is prefixed `unknown-`).

If the template has 0 media files, gate condition (4) is relaxed: the
directory must exist but may be empty. Note "0 media assets" in the
analysis.

## Downstream integration

Phase 0 outputs feed into later phases:

- **Phase 2** detects `template-analysis.md` and uses the extracted palette
  and fonts as default suggestions during Q1-Q8 brainstorming (the user
  can still override).
- **Phase 4** reads `template-analysis.md` and pre-populates the style
  guide's color palette and typography sections from the extracted data
  instead of offering generic palette options.
- **Phase 7** can reference `template-assets/` for logos and backgrounds
  to embed in the build scripts.

## Known limitations

- Theme XML parsing via grep/sed handles standard PowerPoint themes but
  may miss colors defined in slide masters or custom XML parts. If the
  extracted palette looks incomplete, inspect `slideMaster1.xml` manually.
- Font availability cannot be verified at extraction time — the extracted
  font names may not be installed on the build machine. Phase 4 should
  specify fallbacks.
- Asset classification is heuristic-based. Always present the renamed
  assets to the user for confirmation before Phase 2.
