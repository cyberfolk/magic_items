# python -m streamlit run ui/main.py
# fmt: off
import streamlit as st
from src.magic_items.models import MagicItem
from src.magic_items.enums import ItemType, Duration, BodySlot, UsageMode, ActivMode
from pydantic import ValidationError

st.title("Magic Item Builder")

item_type = st.selectbox("Tipo Oggetto", options=list(ItemType), format_func=lambda x: x.label)

fs = {}  # fields

# region CAMPI INPUT ---------------------------------------------------------------------------------------------------
col1, col2 = st.columns(2)
if item_type == ItemType.BONUS_STATS:
    with col1:
        fs["bonus"] = st.number_input("Bonus", step=1, value=2, min_value=2, max_value=6)
    with col2:
        fs["body_slot"] = st.selectbox("Slot Corporeo", options=list(BodySlot), format_func=lambda x: x.label)

elif item_type == ItemType.MAGIC_ARMOR:
    fs["bonus"] = st.number_input("Bonus", step=1, value=1, min_value=1, max_value=5)

elif item_type == ItemType.MAGIC_WEAPON:
    fs["bonus"] = st.number_input("Bonus", step=1, value=1, min_value=1, max_value=5)

elif item_type == ItemType.BONUS_CA_DEV:
    with col1:
        fs["bonus"] = st.number_input("Bonus", step=1, value=1, min_value=1, max_value=5)
    with col2:
        fs["body_slot"] = st.selectbox("Slot Corporeo", options=list(BodySlot), format_func=lambda x: x.label)

elif item_type == ItemType.BONUS_CA_ALTRO:
    with col1:
        fs["bonus"] = st.number_input("Bonus", step=1, value=1, min_value=1, max_value=5)
    with col2:
        fs["body_slot"] = st.selectbox("Slot Corporeo", options=list(BodySlot), format_func=lambda x: x.label)

elif item_type in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND, ItemType.MAGIC_EFFECT}:
    col1, col2 = st.columns(2)
    with col1:
        fs["liv_spell"] = st.number_input("Livello Incantesimo", step=1, value=1, min_value=1, max_value=9)
    with col2:
        fs["liv_caster"] = st.number_input("Livello Incantatore", step=1, value=1, min_value=1, max_value=20)

if item_type == ItemType.MAGIC_EFFECT:
    col3, col4 = st.columns(2)
    with col3:
        fs["body_slot"] = st.selectbox("Slot Corporeo", options=list(BodySlot), format_func=lambda x: x.label)
        fs["activ_mode"] = st.selectbox("Modalità d'Attivazione", options=list(ActivMode), format_func=lambda x: x.label)
    with col4:
        fs["usage_mode"] = st.selectbox("Modalità d'Uso", options=list(UsageMode), format_func=lambda x: x.label)
        if fs["usage_mode"] == UsageMode.DAILY_CHARGES:
            fs["daily_charges"] = st.number_input("Cariche Giornaliere", step=1, value=1, min_value=1)
        if fs["usage_mode"] == UsageMode.CONTINUOUS:
            fs["duration"] = st.selectbox("Durata Incantesimo Originale", options=list(Duration), format_func=lambda x: x.label)
# endregion ------------------------------------------------------------------------------------------------------------

if st.button("Crea"):
    try:
        item = MagicItem(item_type=item_type, **{k: v for k, v in fs.items() if v not in [None, 0, False]})

        with st.container(border=True):
            st.subheader(f"{item.price} MO - {item.item_type.label}")
            details = [
                ("Bonus", item.txt_bonus),
                ("Incantesimo", item.txt_liv_spell_and_liv_caster),
                ("Attivazione", item.txt_activ_mode),
                ("Utilizzo", item.txt_usage_mode),
                ("Slot", item.txt_body_slot),
            ]
            details = [f"**{label}:** {value}" for label, value in details if value]
            if details:
                st.markdown("\n".join(f"- {d}" for d in details))

        with st.expander("🔍 Calcoli"):
            st.write(f"**Formula:** `{item.price_formula}`")
            st.write(f"**Calcoli:** `{item.price_math}`")

    except ValidationError as e:
        st.error("❌ Errore di validazione")
        for err in e.errors():
            st.warning(err["msg"])
# fmt: on
