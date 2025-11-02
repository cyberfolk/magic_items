import logging

def price_scroll(obj: dict) -> int:
    liv_spell = obj.get("liv_spell")
    liv_caster = obj.get("liv_caster")
    if liv_spell is None or liv_caster is None:
        raise ValueError("Per 'scroll' servono 'liv_spell' e 'liv_caster'.")
    return liv_spell * liv_caster * 25


def price_potion(obj: dict) -> int:
    liv_spell = obj.get("liv_spell")
    liv_caster = obj.get("liv_caster")
    if liv_spell is None or liv_caster is None:
        raise ValueError("Per 'potion' servono 'liv_spell' e 'liv_caster'.")
    return liv_spell * liv_caster * 50


def price_wand(obj: dict) -> int:
    liv_spell = obj.get("liv_spell")
    liv_caster = obj.get("liv_caster")
    if liv_spell is None or liv_caster is None:
        raise ValueError("Per 'wand' servono 'liv_spell' e 'liv_caster'.")
    return liv_spell * liv_caster * 750


def price_command_word(obj: dict) -> int:
    liv_spell = obj.get("liv_spell")
    liv_caster = obj.get("liv_caster")
    if liv_spell is None or liv_caster is None:
        raise ValueError("Per 'command_word' servono 'liv_spell' e 'liv_caster'.")
    return liv_spell * liv_caster * 1800


def price_use_activated(obj: dict) -> int:
    liv_spell = obj.get("liv_spell")
    liv_caster = obj.get("liv_caster")
    if liv_spell is None or liv_caster is None:
        raise ValueError("Per 'use_activated' servono 'liv_spell' e 'liv_caster'.")
    return liv_spell * liv_caster * 2000


def apply_duration_multiplier(costo: int, durata: str) -> float:
    if not durata:
        return float(costo)
    durata = durata.lower()
    if durata == "round":
        return costo * 4.0
    elif durata == "1_min":
        return costo * 2.0
    elif durata == "10_min":
        return costo * 1.5
    elif durata == "24h":
        return costo * 0.5
    else:
        logging.warning(f"Durata '{durata}' non gestita → costo invariato")
        return float(costo)
