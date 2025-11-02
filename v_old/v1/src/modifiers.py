import logging
from .naming import MAP_NAME


def apply_modifiers(costo: float, obj: dict) -> float:
    mods = obj.get("mods", [])
    obj_tipo = obj.get("tipo")
    obj_name = MAP_NAME[obj_tipo]

    if not mods:
        return costo

    # Check: oggetti use_activated senza info slot
    if obj.get("tipo") in ("use_activated", "command_word"):
        has_slot = any(m.get("tipo") == "slot" for m in mods)
        if not has_slot:
            logging.warning(f"{obj_name} ma nessuna specifica sullo Slot → FALLBACK [Slot: Corretto] (costo base).")
            # fallback: moltiplicatore 1 (costo invariato)

    for mod in mods:
        tipo = mod.get("tipo")

        if tipo == "daily_charges":
            n = mod.get("n")
            if not n:
                raise ValueError("Mod 'daily_charges' richiede 'n'.")
            costo = costo / (5 / n)

        elif tipo == "slot":
            t_slot = mod.get("t_slot", "correct")

            if t_slot == "correct":
                costo = costo * 1
            elif t_slot == "unusual":
                costo = costo * 1.5
            elif t_slot == "no":
                costo = costo * 2
            else:
                logging.warning(f"Valore slot.t_slot '{t_slot}' non riconosciuto → costo invariato")

        elif tipo == "multi_capacity":
            costo = costo * 2

        elif tipo == "fifty_charges":
            costo = costo / 2

        else:
            logging.warning(f"Modificatore '{tipo}' non implementato → ignorato")

    return costo
