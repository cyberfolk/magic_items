Sei un UI/UX designer. Progetta un mockup per una web app chiamata **Magic Item Builder**,
calcolatore di prezzi per oggetti magici di D&D 3.5. UI in italiano. Single-page.

---

## Struttura attuale

La pagina ha:
1. **Header** — titolo "🧙 Magic Item Builder" + sottotitolo
2. **Card form** — select "Tipo di Oggetto" + griglia dinamica di campi (cambiano in base al tipo scelto)
3. **Card extra** (opzionale, solo per "Oggetto Effetto Magico") — layout 2 colonne con slot corporeo,
   modalità attivazione, modalità uso + campo condizionale (cariche/giornaliere o durata)
4. **Button "✨ Genera Oggetto"** — full-width
5. **Card risultato** — appare dopo submit con: prezzo in MO, tipo oggetto, lista bullet dei dettagli,
   sezione collassabile "Dettagli del Calcolo" con formula e matematica

**Tipi di oggetto disponibili:**
- Bonus di Caratteristica → campi: Bonus (+2/+4/+6), Tipo Bonus (bloccato: Potenziamento), Slot Corporeo
- Armatura Magica → Bonus (1-5), Tipo Bonus (bloccato: Potenziamento)
- Arma Magica → Bonus (1-5), Tipo Bonus (bloccato: Potenziamento)
- Bonus CA → Bonus (1-5), Tipo Bonus (Deviazione/Naturale/Altri), Slot Corporeo
- Bonus TS → Bonus (1-5), Tipo Bonus (Resistenza/Altri), Slot Corporeo
- Incantesimo Bonus → Livello Incantesimo (1-9)
- Pergamena / Pozione / Bacchetta → Livello Incantesimo (1-9), Livello Incantatore (1-20)
- Oggetto Effetto Magico → Livello Inc., Livello Inc.tore + Slot Corporeo + Modalità Attivazione
  (Attivato ad uso / Parola di Comando) + Modalità Uso (Effetto Continuo / 50 Cariche /
  Cariche Giornaliere) + campo condizionale:
  - se Cariche Giornaliere → input numerico "Cariche Giornaliere"
  - se Effetto Continuo → select "Durata Incantesimo Originale" (10 Minuti / 1 Minuto / Rounds / Giorni)

---

## Cosa voglio sperimentare nel mockup

1. **Visual identity fantasy/medievale leggera** — qualcosa che evochi D&D senza essere kitch

2. **UX del form** — i campi appaiono/scompaiono dinamicamente; esplorare se ha senso uno stepper
   (passo 1: tipo → passo 2: parametri) oppure un pannello laterale fisso con il risultato live

3. **Card risultato** — che si aggiorna in tempo reale mentre l'utente compila, senza submit

4. **Campo "Tipo Bonus" bloccato** — attualmente è una select disabilitata grigia quando c'è un solo
   valore possibile. Alternativa: mostrarlo come badge/chip readonly invece di un input

5. **Sezione "Dettagli del Calcolo"** — attualmente collassabile con `<details>`. Alternativa:
   mostrarlo come equazione matematica formattata visivamente (tipo LaTeX-style ma in HTML/CSS)

---

## Vincoli

- Tutto il testo in italiano
- Accessibile: label associate ai campi, contrasto sufficiente
- Mobile-friendly (max-width 860px, griglia collassa su schermi piccoli)
- Il mockup deve restare funzionale (non solo visivo) — il JS di business logic è già scritto,
  si reimplementa solo la parte HTML/CSS/app.js

Mostrami prima il design complessivo della pagina (stato iniziale + stato dopo submit),
poi proponi variazioni sui punti 2 e 3 (stepper vs. sidebar live).
