# TODO — Criticità `src/magic_items/`

## 🟡 Incoerenza data model

- [ ] **`UsageMode.price_base` sempre `1`, mai usato**
  Tutti e tre i valori di `UsageMode` hanno `price_base: 1` (`enums.js`).
  `_calcPrice()` brana sull'identità dell'oggetto, non su `price_base`.
  Il campo è fuorviante: chiarire se rimuoverlo o usarlo coerentemente.

---

## 🟡 Validation gap

- [ ] **`bonus_type` non vietato per `BONUS_SPELL`, `SCROLL`, `POTION`, `WAND`**
  Questi tipi non includono `"bonus_type"` nella lista di `checkEmpty` (`models.js`).
  Un input con `bonus_type` impostato passa la validazione senza errore né effetto.
