import json
import streamlit as st

from src.process import process_item
from src.price import VALID_TYPES

st.set_page_config(page_title="Magic Items Tester", page_icon="✨", layout="centered")
st.title("Magic Items | D&D 3.5 – Tester")
st.caption("Interfaccia per calcolare nome e prezzo degli oggetti magici")
options_name = [x[1] for x in VALID_TYPES.values()]

with st.sidebar:
    st.header("Tipologia oggetto")
    tipo = st.selectbox(
        "Tipo",
        options=options_name,
        index=list(VALID_TYPES.keys()).index("use_activated") if "use_activated" in VALID_TYPES else 0,
    )

# Costruzione input dinamico
obj: dict = {"tipo": tipo}

# Campi specifici per i tipi "bonus_*"
if tipo.startswith("bonus_"):
    bonus = st.number_input("Bonus", min_value=1, max_value=20, value=1, step=1)
    obj["bonus"] = int(bonus)

# Campi specifici per gli oggetti a incantesimo
spell_based = {"scroll", "potion", "wand", "command_word", "use_activated"}
if tipo in spell_based:
    col1, col2 = st.columns(2)
    with col1:
        liv_spell = st.number_input("Livello incantesimo", min_value=0, max_value=9, value=1, step=1)
    with col2:
        liv_caster = st.number_input("Livello incantatore", min_value=1, max_value=20, value=1, step=1)
    obj.update({"liv_spell": int(liv_spell), "liv_caster": int(liv_caster)})

# Durata opzionale (si applica dove previsto dal motore: oggetti continui)
durata_opt = st.selectbox(
    "Durata (opzionale)",
    options=["", "round", "1_min", "10_min", "24h"],
    index=0,
    help="Lascia vuoto se non applicabile",
)
if durata_opt:
    obj["durata"] = durata_opt

st.subheader("Modificatori")
# daily_charges
use_daily_charges = st.checkbox("Daily charges", value=False, help="Numero di utilizzi al giorno")
mods = []
if use_daily_charges:
    n_daily = st.number_input("N. utilizzi/giorno", min_value=1, max_value=5, value=1, step=1)
    mods.append({"tipo": "daily_charges", "n": int(n_daily)})

# slot
use_slot = st.checkbox("Slot", value=True, help="Posizione di slot corretta/insolita/nessuna")
if use_slot:
    t_slot = st.selectbox("Tipo slot", options=["correct", "unusual", "no"], index=0)
    mods.append({"tipo": "slot", "t_slot": t_slot})

# multi_capacity
if st.checkbox("Multi capacity (x2)", value=False):
    mods.append({"tipo": "multi_capacity"})

# fifty_charges
if st.checkbox("Fifty charges (1/2)", value=False):
    mods.append({"tipo": "fifty_charges"})

if mods:
    obj["mods"] = mods

st.subheader("Costi extra (opzionali)")
colA, colB = st.columns(2)
with colA:
    material_cost = st.number_input("Componenti materiali (PB)", min_value=0, value=0, step=1)
with colB:
    costo_pe = st.number_input("Costo in PE", min_value=0, value=0, step=1)

if material_cost:
    obj["material_cost"] = int(material_cost)
if costo_pe:
    obj["costo_pe"] = int(costo_pe)

st.divider()
if st.button("Calcola", type="primary"):
    try:
        result = process_item(obj)
        if result is None:
            st.error("Si è verificato un errore durante il calcolo. Controlla i parametri.")
        else:
            nome, costo = result
            craft = costo * 0.5 * 0.75
            px = craft / 25

            st.success("Calcolo completato")
            st.markdown(f"**Nome:** {nome}")
            st.markdown(f"**Prezzo (PB):** {costo}")
            st.markdown(f"**Costo Craft (PB):** {craft}")
            st.markdown(f"**PE:** {px}")

            with st.expander("Dettagli input", expanded=False):
                st.code(json.dumps(obj, indent=2, ensure_ascii=False), language="json")
    except Exception as e:
        st.error(f"Errore: {e}")
        with st.expander("Input inviato", expanded=False):
            st.code(json.dumps(obj, indent=2, ensure_ascii=False), language="json")
