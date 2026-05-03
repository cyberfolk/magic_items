# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lingua

Rispondi sempre in italiano.

## Commands

```bash
# Serve the UI (file:// non funziona — Babel/JSX richiedono un server HTTP)
python -m http.server
# oppure, se serve è installato globalmente:
serve .
```

No install step — `package.json` only sets `"type": "module"`, no dependencies.

## Architecture

D&D 3.5 magic item price calculator. SPA React caricata via CDN, nessun build step.

### File UI

- **`pricing.js`** — IIFE, espone `window.MIB_CORE`. Contiene tutti gli enum (`ItemType`, `BodySlot`, `Duration`, `UsageMode`, `ActivMode`, `BonusType`) e la classe `MagicItem`. Ogni variante enum è `{ value, label, price_base }`. `MagicItem` calcola `price` e un array `tokens` strutturato `[{ sym, label, value, op }]` usato per il rendering dell'equazione nel pannello prezzo. È la **fonte di verità** per tutte le formule.

- **`app.jsx`** — Tutti i componenti React. `TypePicker` (sidebar sinistra), form per tipo (`FormStats`, `FormCA`, `FormTS`, `FormArmorWeapon`, `FormBonusSpell`, `FormSPW`, `FormMagicEffect`), `PricePanel` (colonna destra sticky). Stato in `App` come `[typeValue, state]`. Cambio tipo → reset a `defaultFor(newType)`. Ogni cambio campo → `useMemo(() => buildItem(...))` ricrea `MagicItem` da `pricing.js`. Espone `window.MIB_App`.

- **`styles.css`** — CSS custom properties + layout 3 colonne (`280px | 1fr | 380px`). Varianti via `data-theme`, `data-density`, `data-accent`, `data-typeface` sul `#root`.

- **`index.html`** — Carica React 18 + ReactDOM + Babel standalone da CDN unpkg, poi `pricing.js` e `app.jsx`, poi monta `<window.MIB_App />`.

### Key invariants

- `pricing.js` è IIFE (non ES module) — non usare `import`/`export`. I componenti React in `app.jsx` leggono tutto da `window.MIB_CORE`.
- Ogni `ItemType` ha campi obbligatori e vietati. Aggiungere un tipo richiede aggiornare `_calcPrice()` in `pricing.js`, `defaultFor()` e il `switch` dei form in `app.jsx`.
- `body_slot` richiesto da `BONUS_STATS`, `BONUS_CA`, `BONUS_TS`, `MAGIC_EFFECT`; assente negli altri.
- `BONUS_STATS` accetta solo `bonus` ∈ `{2, 4, 6}`; tutti gli altri bonus `1–5`.
- I consumabili (SCROLL/POTION/WAND) appaiono nell'UI come voce unica "Consumabile" con segmented interno, ma restano tre `ItemType` distinti in `pricing.js`.
- Chip `PRICE_BASE` viene spostata sempre in prima posizione nell'equazione visuale (logica in `PricePanel`).
