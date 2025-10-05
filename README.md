# Magic Items | D&D 3.5

## Struttura

magic_items/
│
├── README.md               # documentazione del progetto e note operative
├── requirements.txt        # dipendenze Python (pytest per la suite di test)
├── __init__.py             # rende il repository importabile come pacchetto
├── main.py                 # esempio di esecuzione manuale del flusso di calcolo
├── src/                    # logica applicativa per prezzi, nomi e processi
│   ├── __init__.py
│   ├── process.py          # orchestratore: calcola prezzo, nome e logga il risultato
│   ├── price.py            # espone get_magic_item_price e gestisce il dispatcher
│   ├── bonus.py            # regole per bonus statici (caratteristica, armatura, CA, ecc.)
│   ├── modifiers.py        # applica modificatori speciali e fallback con warning
│   ├── spells.py           # formule per oggetti basati su incantesimo
│   └── naming.py           # genera il nome descrittivo in base ai dati dell'oggetto
└── test/                   # suite di regressione basata su pytest
    ├── __init__.py
    └── test.py             # casi di test che coprono i principali scenari
