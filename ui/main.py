# python -m streamlit run ui/main.py
import streamlit as st
from src.magic_items.models import MagicItem
from src.magic_items.enums import ItemType, Duration, BodySlot
from pydantic import ValidationError

st.title("Magic Item Builder")

item_type = st.selectbox(
    "Tipo Oggetto",
    options=list(ItemType),
    format_func=lambda x: x.label
)

fields = {}

# campi dinamici
if item_type.name.startswith("BONUS"):
    fields["bonus"] = st.number_input("Bonus", step=1, format="%d", value=1, min_value=1, max_value=6)

if item_type in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND, ItemType.USE}:
    fields["liv_spell"] = st.number_input("Livello Incantesimo", step=1, format="%d", value=1, min_value=1, max_value=9)
    fields["liv_caster"] = st.number_input("Livello Incantatore", step=1, format="%d", value=1, min_value=1, max_value=20)

if item_type == ItemType.USE:
    fields["daily_charges"] = st.number_input("Cariche Giornaliere", step=1, format="%d", value=0, min_value=1, max_value=9)
    fields["duration"] = st.selectbox("Durata", options=list(Duration), format_func=lambda x: x.label)
    fields["body_slot"] = st.selectbox("Slot Corporeo", options=list(BodySlot), format_func=lambda x: x.label)
    fields["fifty_charges"] = st.checkbox("50 Cariche")

if st.button("Crea"):
    try:
        item = MagicItem(item_type=item_type, **{k: v for k, v in fields.items() if v not in [None, 0, False]})
        st.success("Creato")
        st.json(item.model_dump())
    except ValidationError as e:
        for err in e.errors():
            st.error(err["msg"])
