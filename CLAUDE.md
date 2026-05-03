# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lingua

Rispondi sempre in italiano.

## Commands

```bash
# Run all tests
node tests/test_magic_items.js

# Serve the UI (ES modules block file:// protocol — a static server is required)
npx serve .
# or
python -m http.server
```

No install step — `package.json` only sets `"type": "module"`, no dependencies.

## Architecture

D&D 3.5 magic item price calculator.

### Core logic — `src/magic_items/`

- **`enums.js`** — Frozen objects where every variant is a `{ value, label, price_base }` triple. `price_base` is the pricing multiplier used in `_calcPrice()`. `byValue(enumObj, val)` looks up a variant by its string `value`.

- **`models.js`** — `MagicItem` class. Constructor takes a `fields` object, calls `_validate()`, then `_calcPrice()` which returns `[price, formula, math]` stored as `_price/_formula/_math`. Getters `price`, `priceFormula`, `priceMath` expose them; `txt*` getters return Italian-language display strings. Validation throws a single `Error` whose `.message` is newline-joined error strings.

- **`index.js`** — Re-exports everything from `enums.js` and `models.js`.

### UI — `index.html` + `app.js`

Vanilla JS, no framework. `app.js` loaded as `<script type="module">`. On `ItemType` change, `renderFields()` rebuilds `#fields` and `#extra-fields` with DOM-created inputs. On form submit, `collectFields()` reads the DOM into a plain object and passes it to `new MagicItem(...)`, catching thrown errors to display inline.

### Tests — `tests/test_magic_items.js`

Custom lightweight runner using `node:assert/strict`. `test(name, fn)` catches and reports. `assertThrows(fn)` verifies that a `MagicItem` constructor call throws. No test framework — run directly with `node`.

### Key invariants

- Each `ItemType` has a strict set of required vs. forbidden fields enforced in `_validate()`. Adding a new item type means updating both `_validate()` and `_calcPrice()`.
- `body_slot` defaults to `null`; some item types (BONUS_STATS, BONUS_CA, BONUS_TS, MAGIC_EFFECT) require it, others (MAGIC_ARMOR, MAGIC_WEAPON, SCROLL, POTION, WAND, BONUS_SPELL) forbid it.
- UI and model labels are in Italian.