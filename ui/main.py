import streamlit as st
from src.magic_items.models import MagicItem
from src.magic_items.enums import ItemType

st.title("Magic Item Builder")

item_type = st.selectbox(
    "Tipo Oggetto",
    options=list(ItemType),
    format_func=lambda x: x.label
)

fields = {}

# campi dinamici
if item_type.name.startswith("BONUS"):
    fields["bonus"] = st.number_input("Bonus", step=1, format="%d")

if item_type in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND, ItemType.USE}:
    fields["liv_spell"] = st.number_input("Livello Incantesimo", step=1, format="%d")
    fields["liv_caster"] = st.number_input("Livello Incantatore", step=1, format="%d")

if item_type == ItemType.USE:
    fields["daily_charges"] = st.number_input("Cariche Giornaliere", step=1, format="%d")
    fields["fifty_charges"] = st.checkbox("50 Cariche")

if st.button("Crea"):
    try:
        item = MagicItem(item_type=item_type, **{k: v for k, v in fields.items() if v not in [None, 0, False]})
        st.success("Creato")
        st.json(item.model_dump())
    except Exception as e:
        st.error(str(e))
