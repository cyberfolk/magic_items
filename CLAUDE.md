# CLAUDE.md

Calcolatore del prezzo degli oggetti magici per D&D 3.5.

## Comandi

```bash
# Esegui tutti i test
node tests/test_magic_items.js

# Avvia il server UI (i moduli ES bloccano il protocollo file:// — serve un server statico)
npx serve .
# oppure
python -m http.server
```

Nessuno step di installazione — `package.json` imposta solo `"type": "module"`, nessuna dipendenza.

## Architettura

Calcolatore del prezzo degli oggetti magici per D&D 3.5.

### Logica core — `src/magic_items/`

- **`enums.js`** — Oggetti frozen dove ogni variante è una tripla `{ value, label, price_base }`. `price_base` è il moltiplicatore di prezzo usato in `_calcPrice()`. `byValue(enumObj, val)` cerca una variante tramite il suo `value` stringa.

- **`models.js`** — Classe `MagicItem`. Il costruttore riceve un oggetto `fields`, chiama `_validate()`, poi `_calcPrice()` che restituisce `[price, formula, math]` salvati come `_price/_formula/_math`. I getter `price`, `priceFormula`, `priceMath` li espongono; i getter `txt*` restituiscono stringhe di visualizzazione in italiano. La validazione lancia un singolo `Error` il cui `.message` è una stringa con errori uniti da `\n`.

- **`index.js`** — Ri-esporta tutto da `enums.js` e `models.js`.

### UI — `index.html` + `app.js`

Vanilla JS, nessun framework. `app.js` caricato come `<script type="module">`. Al cambio di `ItemType`, `renderFields()` ricostruisce `#fields` e `#extra-fields` con input creati via DOM. Al submit del form, `collectFields()` legge il DOM in un oggetto plain e lo passa a `new MagicItem(...)`, catturando gli errori per mostrarli inline.

### Test — `tests/test_magic_items.js`

Runner leggero custom con `node:assert/strict`. `test(name, fn)` cattura e riporta. `assertThrows(fn)` verifica che il costruttore di `MagicItem` lanci. Nessun framework — eseguire direttamente con `node`.

### Invarianti principali

- Ogni `ItemType` ha un insieme preciso di campi obbligatori vs. vietati, controllato in `_validate()`. Aggiungere un nuovo tipo richiede di aggiornare sia `_validate()` che `_calcPrice()`.
- `body_slot` ha default `null`; alcuni tipi (BONUS_STATS, BONUS_CA, BONUS_TS, MAGIC_EFFECT) lo richiedono, altri (MAGIC_ARMOR, MAGIC_WEAPON, SCROLL, POTION, WAND, BONUS_SPELL) lo vietano.
- Label di UI e model sono in italiano.
