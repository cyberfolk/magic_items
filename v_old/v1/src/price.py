from .bonus import (
    price_bonus_caratteristica,
    price_magic_armor,
    price_bonus_ca_deviazione,
    price_bonus_ca_altro,
    price_magic_armor_naturale,
    price_bonus_ts_resistenza,
    price_bonus_ts_altro,
    price_bonus_abilita,
)
from .spells import (
    price_scroll,
    price_potion,
    price_wand,
    price_command_word,
    price_use_activated,
    apply_duration_multiplier,
)
from .modifiers import apply_modifiers

VALID_TYPES = {
    # Bonus statici
    "bonus_caratteristica": (price_bonus_caratteristica, "Bonus caratteristica"),
    "magic_armor": (price_magic_armor, "Bonus Armatura"),
    "bonus_ca_deviazione": (price_bonus_ca_deviazione, "Bonus CA (deviazione)"),
    "bonus_ca_altro": (price_bonus_ca_altro, "Bonus CA (altro)"),
    "magic_armor_naturale": (price_magic_armor_naturale, "Bonus Armatura Naturale"),
    "bonus_ts_resistenza": (price_bonus_ts_resistenza, "Bonus TS (Resistenza)"),
    "bonus_ts_altro": (price_bonus_ts_altro, "Bonus TS (Altro)"),
    "bonus_abilita": (price_bonus_abilita, "Bonus Abilità"),
    # Oggetti a incantesimo
    "scroll": (price_scroll, "Pergamena"),
    "potion": (price_potion, "Pozione"),
    "wand": (price_wand, "Bacchetta"),
    "command_word": (price_command_word, "Oggetto a Parola di Comando"),
    "use_activated": (price_use_activated, "Oggetto Attivato A Uso"),
}


def get_magic_item_price(obj: dict) -> float:
    tipo = obj.get("tipo")
    if tipo not in VALID_TYPES:
        raise ValueError(f"Tipo '{tipo}' non riconosciuto. Tipi validi: {list(VALID_TYPES.keys())}")

    costo = VALID_TYPES[tipo][0](obj)

    # durata (solo per oggetti continui)
    costo = apply_duration_multiplier(costo, obj.get("durata"))

    # modificatori speciali
    costo = apply_modifiers(costo, obj)

    # extra: componenti materiali e PE
    material_cost = obj.get("material_cost", 0)
    costo_pe = obj.get("costo_pe", 0)
    costo += material_cost + (costo_pe * 5)

    return costo
