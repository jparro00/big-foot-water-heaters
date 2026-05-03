# Big Foot Water Heaters — Project Conventions

## Color system: Material Design 3 (NON-NEGOTIABLE)

This project uses an MD3-derived color system. The architecture and rules
below are not stylistic preferences. They are constraints. Any color
decision that violates them is wrong, even if it "looks fine" in
isolation, because it breaks the system that makes every other color
decision predictable.

If you find yourself reaching for a raw `--peach-*` or `--olive-*` token
inside a component rule, stop. You almost certainly want a role.

---

### Architecture: two layers, in this order of authority

1. **Tonal palettes** — `--olive-*`, `--peach-*`, `--gold-*`,
   `--neutral-*`, `--nv-*`. Raw hue scales. **Components do NOT
   reference these directly.** They exist only to feed the role layer.

2. **Role tokens** — `--primary`, `--on-primary`, `--primary-container`,
   `--on-primary-container`, `--secondary` (+container, +on-*), `--tertiary`,
   `--surface`, `--surface-container-low/[/high/highest/lowest]`,
   `--surface-bright`, `--surface-dim`, `--on-surface`, `--on-surface-variant`,
   `--outline`, `--outline-variant`, `--inverse-surface`, `--on-inverse-surface`,
   `--inverse-primary`. **All component CSS references these.**

Re-skinning the site = changing role mappings in `:root`. Never a
component-level edit.

### Brand bindings (this site specifically)

- **Primary = peach** (action accent — CTAs, focal stamps, links, eyebrows).
- **Secondary = olive** (brand identity — wordmark, headlines, supporting
  surfaces and chips).
- **Tertiary = gold** (microaccent ONLY — the lightning bolts in the
  Bigfoot lens SVGs).
- **Neutral / Neutral-variant = warm cream** (paper canvas + surface tiers
  + outlines).

---

### The seven hard rules

#### 1. Always pair roles. Never improvise contrast.

Every fillable role has a companion `on-*` role specifically chosen to
read on it. Use them together:

```css
/* Right */
.cta { background: var(--primary); color: var(--on-primary); }

/* Wrong — manually picked text color */
.cta { background: var(--primary); color: var(--olive-900); }
```

If you find yourself picking a text color "by eye" to put on a colored
fill, you're skipping the system that guarantees contrast.

#### 2. Primary and Secondary live at HCT tone ~40.

Tone 40 is the MD3 baseline for a vivid mid-dark accent that pairs with
white at ≥4.5:1. Lighter tones (tone 50–60) cannot meet contrast with
white and read as "weak CTA". Do not soften primary by reaching for
`--peach-500` or `--peach-400`. If you want a softer surface that carries
the brand hue, use `--primary-container` (tone ~90 — a pale tint).

#### 3. Surface elevation is subtle. Chrome is NOT an accent color.

Light-mode surface tiers in MD3 span tones 90–98 — gentle steps. The
header, footer, mobile bar, and cards all use surface-container-* tiers,
NEVER `--primary` or `--secondary`. Brand presence in chrome comes from
the logo/wordmark and from CTAs, not from painting walls.

A loud peach header is wrong. So is a loud olive footer. Don't ship them
again.

#### 4. Outlines are real colors. Never alpha haze.

Use `--outline` (substantive border, neutral-variant tone ~50) and
`--outline-variant` (soft divider, neutral-variant tone ~80). Do not
use `rgba(…, .14)` or `rgba(…, .28)` overlays for borders. Real colors
hold definition; alpha overlays look ghostly on every background.

#### 5. Accents are scarce.

If the page has more than ~3 instances of `--primary` per viewport, it's
loud. Primary is the attention-getter — it works because it's rare.
Eyebrow text + one CTA + one focal stamp is enough.

#### 6. Containers are for soft brand presence, not loud emphasis.

`--primary-container` and `--secondary-container` are pale tints of the
brand hues, paired with their dark `on-*` partners. Use them for selected
chips, soft tagged states, the radio-pill "selected" treatment. Use them
when you want the brand to be *present* without being *prominent*.

#### 7. Don't add to the palette without naming the role.

If you need a color that doesn't exist, add a tonal palette token first
(`--peach-95: #…`), then the role mapping (`--primary-container: var(--peach-95);`).
Never inline a hex in a component rule.

---

### One recognized exception: brand-identity tokens

The MD3 role system covers UI surfaces and components. It does NOT cover
one-off brand artwork (the hero wordmark, future logos/labels/seals).
For those, a separate `BRAND IDENTITY` token group in `:root` is allowed
(currently `--brand-wordmark`, `--brand-wordmark-shadow`).

These are NOT roles. They're brand-asset colors that happen to map to
palette tones. They must NOT be reused for components — using
`--brand-wordmark` to color a button defeats the system. If a brand
token is being applied outside its named artwork, that's a smell:
either it should be a role, or the artwork should expand its scope
deliberately.

---

### When in doubt, do tone math

HCT contrast guarantees:

- A 40-tone difference ≥ 3:1 (large text, UI components).
- A 50-tone difference ≥ 4.5:1 (normal body text).

If you're unsure whether a pairing reads, check the tone difference. The
existing role pairings are designed to meet this — that's their entire
purpose.

---

### Reference tone targets (for sanity-checking palette adds)

| Role token              | MD3 light-theme tone |
|-------------------------|----------------------|
| primary                 | ~40                  |
| on-primary              | 100 (white)          |
| primary-container       | ~90                  |
| on-primary-container    | ~10                  |
| secondary               | ~40                  |
| on-secondary            | 100                  |
| secondary-container     | ~90 (we use ~85 — olive-50) |
| on-secondary-container  | ~10                  |
| surface                 | ~98 (we use ~96 — neutral-99) |
| on-surface              | ~10                  |
| on-surface-variant      | ~30                  |
| surface-container-lowest| 100 (white)          |
| surface-container-low   | ~96                  |
| surface-container       | ~94                  |
| surface-container-high  | ~92                  |
| surface-container-highest| ~90                 |
| surface-dim             | ~87                  |
| outline                 | nv-50                |
| outline-variant         | nv-80                |

---

### Forbidden patterns

- ❌ `color: var(--peach-400)` for body or accent text — too light, fails contrast.
- ❌ `background: var(--peach-500)` for header / footer / mobile bar.
- ❌ `border: 1px solid rgba(…, .14)` — use `var(--outline-variant)`.
- ❌ Inline hex in any component rule.
- ❌ Picking a text color "to look good" on a colored fill instead of using the matching `on-*` token.
- ❌ Stacking accent colors against accent colors (e.g. peach text on peach bg) without going through container tokens.

---

## Other project conventions

- The site is a single-page marketing site for a plumber business — calm and readable beats clever.
- The user runs the dev preview themselves. Do not call `preview_start` or take screenshots — verify by code review and let the user check visually.
- Avoid suggesting timelines in human time ("a few hours", "a day"); describe scope in terms of files touched / components affected.
