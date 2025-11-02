MAP_NAME = {
    "bonus_caratteristica": "Bonus caratteristica",
    "bonus_armatura": "Bonus armatura",
    "bonus_ca_deviazione": "Bonus CA (deviazione)",
    "bonus_ca_altro": "Bonus CA (altro)",
    "bonus_armatura_naturale": "Bonus armatura naturale",
    "bonus_ts_resistenza": "Bonus TS (resistenza)",
    "bonus_ts_altro": "Bonus TS (altro)",
    "bonus_abilita": "Bonus abilità",
    "scroll": "Pergamena",
    "potion": "Pozione",
    "wand": "Bacchetta",
    "command_word": "Oggetto a parola di comando",
    "use_activated": "Oggetto Attivato A Uso",
}


def get_item_name(obj: dict) -> str:
    tipo = obj.get("tipo")
    bonus = obj.get("bonus")

    base = MAP_NAME.get(tipo, f"Oggetto sconosciuto ({tipo})")

    # 🔹 Caso bonus statico
    if bonus:
        return f"{base} +{bonus}"

    # 🔹 Caso spell-based
    if tipo in ("scroll", "potion", "wand", "command_word", "use_activated"):
        lv = obj.get("liv_spell")
        cl = obj.get("liv_caster")
        parts = [f"{base} (Liv Inc {lv}, Liv Cast {cl})"]
        mods = obj.get("mods", [])

        if obj.get("tipo") in ("use_activated", "command_word"):
            has_slot = any(m.get("tipo") == "slot" for m in mods)
            if not has_slot:
                parts.append("[Slot Corretto]")

        for m in mods:
            mtype = m.get("tipo")
            if mtype == "daily_charges":
                parts.append(f"{m['n']}/giorno")
            elif mtype == "t_slot":
                limitation = m.get("limitation", "correct")
                if limitation == "correct":
                    parts.append("[Slot Corretto]")
                elif limitation == "unusual":
                    parts.append("[slot Inusuale]")
                elif limitation == "no":
                    parts.append("[Senza Slot]")
                else:
                    parts.append(f"[slot {limitation}]")  # fallback generico
            elif mtype == "multi_capacity":
                parts.append("[multi-effetto]")
            elif mtype == "fifty_charges":
                parts.append("[50 cariche]")

        return " ".join(parts)

    return base
