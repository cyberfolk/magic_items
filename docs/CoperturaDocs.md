# Copertura Implementazione — CreareOggettiMagici.md

Verifica di ogni requisito della fonte documentale rispetto a `src/magic_items/*`. Copertura numerica verificata da `tests/verify_docs.js`.

---

## Sezione 1 — Bonus e Potenziamenti

| #  | Requisito (docs)                           | Prezzo base docs                | Implementato | Note                                                                      |
|----|--------------------------------------------|---------------------------------|:------------:|---------------------------------------------------------------------------|
| 1  | Bonus di caratteristica (potenziamento)    | Bonus² × 1.000 mo               |      ✅       | `ItemType.BONUS_STATS` (price_base 1000) + `BonusType.ENHANCEMENT` (×1.0) |
| 2  | Bonus di armatura (potenziamento)          | Bonus² × 1.000 mo               |      ✅       | `ItemType.MAGIC_ARMOR` (price_base 1000)                                  |
| 3  | Incantesimo bonus                          | LivInc² × 1.000 mo              |      ✅       | `ItemType.BONUS_SPELL` (price_base 1000)                                  |
| 4  | Bonus alla CA (deviazione)                 | Bonus² × 2.000 mo               |      ✅       | `ItemType.BONUS_CA` + `BonusType.CA_DEFLECTION` (×2.0)                    |
| 5  | Bonus alla CA (altro)¹                     | Bonus² × 2.500 mo               |      ✅       | `ItemType.BONUS_CA` + `BonusType.CA_OTHERS` (×2.5)                        |
| 6  | Bonus di armatura naturale (potenziamento) | Bonus² × 2.000 mo               |      ✅       | `ItemType.BONUS_CA` + `BonusType.CA_NATURAL` (×2.0)                       |
| 7  | Bonus ai tiri salvezza (resistenza)        | Bonus² × 1.000 mo               |      ✅       | `ItemType.BONUS_TS` + `BonusType.TS_RESISTENCE` (×1.0)                    |
| 8  | Bonus ai tiri salvezza (altro)¹            | Bonus² × 2.000 mo               |      ✅       | `ItemType.BONUS_TS` + `BonusType.TS_OTHERS` (×2.0)                        |
| 9  | Bonus di abilità (competenza)              | Bonus² × 100 mo                 |      ❌       | Nessun `ItemType` dedicato; nessuna logica di calcolo                     |
| 10 | Resistenza agli incantesimi                | 10.000 mo per punto (min RI 13) |      ❌       | Formula lineare non quadratica, non implementata                          |
| 11 | Bonus dell'arma (potenziamento)            | Bonus² × 2.000 mo               |      ✅       | `ItemType.MAGIC_WEAPON` (price_base 2000)                                 |

> ¹ Fortuna, Cognitivo, Sacro o Profano — etichetta corretta in `CA_OTHERS` e `TS_OTHERS`.

---

## Sezione 2 — Effetti Magici

| # | Requisito (docs)                          | Prezzo base docs                | Implementato | Note                                                                  |
|---|-------------------------------------------|---------------------------------|:------------:|-----------------------------------------------------------------------|
| 1 | Uso singolo, completamento di incantesimo | LivInc × LivInc.tore × 25 mo    |      ✅       | `ItemType.SCROLL` (price_base 25)                                     |
| 2 | Uso singolo, attivato ad uso              | LivInc × LivInc.tore × 50 mo    |      ✅       | `ItemType.POTION` (price_base 50)                                     |
| 3 | 50 cariche, attivazione di incantesimo    | LivInc × LivInc.tore × 750 mo   |      ✅       | `ItemType.WAND` (price_base 750)                                      |
| 4 | Parola di comando                         | LivInc × LivInc.tore × 1.800 mo |      ✅       | `ItemType.MAGIC_EFFECT` + `ActivMode.COMMAND_WORD` (price_base 1800)  |
| 5 | Attivato ad uso (continuo)                | LivInc × LivInc.tore × 2.000 mo |      ✅       | `ItemType.MAGIC_EFFECT` + `ActivMode.USE_ACTIVATED` (price_base 2000) |

### Modificatori durata per oggetti continui (nota ¹ sezione 2)

| Durata originale   | Modifica docs | Implementato | Note                                |
|--------------------|---------------|:------------:|-------------------------------------|
| Round              | ×4            |      ✅       | `Duration.ROUND` (price_base 4.0)   |
| 1 minuto/livello   | ×2            |      ✅       | `Duration.ONE_MIN` (price_base 2.0) |
| 10 minuti/livello  | ×1,5          |      ✅       | `Duration.TEN_MIN` (price_base 1.5) |
| 24 ore o superiore | ÷2            |      ✅       | `Duration.DAY` (price_base 0.5)     |

---

## Sezione 3 — Modifiche Speciali al Prezzo

| # | Requisito (docs)              | Modifica docs          | Implementato | Note                                                                                            |
|---|-------------------------------|------------------------|:------------:|-------------------------------------------------------------------------------------------------|
| 1 | Cariche al giorno             | ÷ (5 ÷ cariche/giorno) |      ✅       | `UsageMode.DAILY_CHARGES` + campo `daily_charges`; formula corretta in `_calcPrice()`           |
| 2 | Limite spaziale per indossare | costo × 1,5            |      ✅       | `BodySlot.UNUSUAL` (price_base 1.5) — applicato a BONUS_STATS, BONUS_CA, BONUS_TS, MAGIC_EFFECT |
| 3 | Nessun limite spaziale        | costo × 2              |      ✅       | `BodySlot.NO` (price_base 2.0) — stessi tipi di cui sopra                                       |
| 4 | Più capacità differenti       | costo superiore × 2    |      ❌       | Non implementato — nessun supporto per oggetti combinati multi-effetto                          |
| 5 | Carico (50 cariche)           | ½ del prezzo base      |      ✅       | `UsageMode.FIFTY_CHARGES` → `price / 2` in `_calcPrice()`                                       |

---

## Sezione 4 — Componenti Aggiuntive / Costi Extra

| # | Requisito (docs)                              | Costo extra docs           | Implementato | Note                                                   |
|---|-----------------------------------------------|----------------------------|:------------:|--------------------------------------------------------|
| 1 | Armatura, scudo o arma                        | + costo oggetto perfetto   |      ❌       | Non implementato — nessun campo per materiale perfetto |
| 2 | Incantesimo con costo in componenti materiali | + costo diretto per carica |      ❌       | Non implementato                                       |
| 3 | Incantesimo con costo in PE                   | + 5 mo per PE per carica   |      ❌       | Non implementato                                       |

---

## Anomalie implementative (non requisiti mancanti, ma difformità)

| Elemento                               | Problema                                                                                                                        |
|----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `ItemType.MAGIC_WEAPON`                | ~~Nessuna validazione in `_validate()`~~ → **risolto**: aggiunto `checkIn` su bonus e `checkEmpty` su tutti i campi non pertinenti      |
| `ItemType.BONUS_STATS`                 | ~~`bonus_type` non vincolato~~ → **risolto**: aggiunto `check_in(bonus_type, ENHANCEMENT)`                                              |
| `BodySlot` su MAGIC_ARMOR/MAGIC_WEAPON | Correttamente escluso (slot fisso) — `bonus_type` ora esplicitamente vietato anche in MAGIC_ARMOR                                       |

---

## Riepilogo

| Sezione                   | Requisiti totali | Implementati | Mancanti |
|---------------------------|:----------------:|:------------:|:--------:|
| 1 — Bonus e Potenziamenti |        11        |      9       |    2     |
| 2 — Effetti Magici        |        5         |      5       |    0     |
| 2 — Modificatori durata   |        4         |      4       |    0     |
| 3 — Modifiche Speciali    |        5         |      4       |    1     |
| 4 — Componenti Aggiuntive |        3         |      0       |    3     |
| **Totale**                |      **28**      |    **22**    |  **6**   |
