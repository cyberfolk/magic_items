# BACKLOG

Il lavoro da fare della repo. Fatta → si cancella. Voci separate da `---`.

Ordinato per **tipo di azione**, non per tema: A blocca il resto, B parte subito su un agente, C sono prove a mano, D va progettato prima del codice, E aspetta dati che non ci sono, F sta fuori
da qui, G l'ha rimandato l'utente. Gli id `Snnn` restano: dicono il tema, il gruppo dice cosa serve
per farla. Un gruppo vuoto non ha intestazione.

---

# A - Decisioni tue

## S001 - `UsageMode.price_base` sempre `1`, mai usato (era senza id, «Incoerenza data model»)

Tutti e tre i valori di `UsageMode` hanno `price_base: 1` (`enums.js`).
`_calcPrice()` brana sull'identità dell'oggetto, non su `price_base`.
Il campo è fuorviante: chiarire se rimuoverlo o usarlo coerentemente.

---

# B - Pronte, senza decisioni

## S002 - `bonus_type` non vietato per `BONUS_SPELL`, `SCROLL`, `POTION`, `WAND` (era senza id, «Validation gap»)

Questi tipi non includono `"bonus_type"` nella lista di `checkEmpty` (`models.js`).
Un input con `bonus_type` impostato passa la validazione senza errore né effetto.
