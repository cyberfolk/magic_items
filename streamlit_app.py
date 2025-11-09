# python -m streamlit run streamlit_app.py
# fmt: off
import streamlit as st
from src.magic_items.models import MagicItem
from src.magic_items.enums import ItemType, Duration, BodySlot, UsageMode, ActivMode
from pydantic import ValidationError

st.title("🧙 Magic Item Builder")
st.caption("Configura, calcola e genera oggetti magici per D&D 3.5")

fs = {}  # fields

# ─── INPUT DINAMICI ──────────────────────────────────────────────
with st.container(border=True):
    st.markdown("### ⚙️ Configurazione")

    # ─── TIPO ───────────────────────────────
    item_type = st.selectbox("Tipo Oggetto", options=list(ItemType), format_func=lambda x: x.label)
    col1, col2 = st.columns(2)

    # ─── BONUS ───────────────────────────────
    if item_type in (ItemType.MAGIC_ARMOR, ItemType.MAGIC_WEAPON):
        fs["bonus"] = st.number_input("Bonus", step=1, value=1, min_value=1, max_value=5)
    elif item_type in (ItemType.BONUS_CA_DEV, ItemType.BONUS_CA_ALTRO, ItemType.BONUS_STATS):
        if item_type == ItemType.BONUS_STATS:
            with col1:
                fs["bonus"] = st.number_input("Bonus", step=1, value=2, min_value=2, max_value=6)
        else:
            with col1:
                fs["bonus"] = st.number_input("Bonus", step=1, value=1, min_value=1, max_value=5)
        with col2:
            fs["body_slot"] = st.selectbox("Slot Corporeo", options=list(BodySlot), format_func=lambda x: x.label)

    # ─── INCANTESIMO ─────────────────────────
    elif item_type in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND, ItemType.MAGIC_EFFECT}:
        with col1:
            fs["liv_spell"] = st.number_input("Livello Incantesimo", step=1, value=1, min_value=1, max_value=9)
        with col2:
            fs["liv_caster"] = st.number_input("Livello Incantatore", step=1, value=1, min_value=1, max_value=20)

    # ─── MAGIC EFFECT EXTRA ──────────────────
    if item_type == ItemType.MAGIC_EFFECT:
        st.divider()
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

if st.button("✨ Genera Oggetto", use_container_width=True):
    try:
        item = MagicItem(item_type=item_type, **{k: v for k, v in fs.items() if v not in (None, 0, False)})

        with st.container(border=True):
            col_a, col_b = st.columns([1,2])
            col_a.metric("💰 Prezzo", f"{item.price} MO")
            col_b.metric("Tipo", item.item_type.label)


            details = [
                ("Bonus", item.txt_bonus),
                ("Incantesimo", item.txt_liv_spell_and_liv_caster),
                ("Attivazione", item.txt_activ_mode),
                ("Utilizzo", item.txt_usage_mode),
                ("Slot", item.txt_body_slot),
            ]
            bullet = [f"**{k}:** {v}" for k, v in details if v]
            if bullet:
                st.info("\n".join(f"- {d}" for d in bullet))

        # ─── DETTAGLI CALCOLO ──────────────────────────────────
        with st.expander("🔍 Dettagli Calcolo"):
            st.write(f"**Formula:** `{item.price_formula}`")
            st.write(f"**Calcoli:** `{item.price_math}`")

    except ValidationError as e:
        for err in e.errors():
            st.warning(err["msg"])
# fmt: on
