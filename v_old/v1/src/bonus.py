def _require_bonus(obj: dict, tipo: str) -> int:
    bonus = obj.get("bonus")
    if bonus is None:
        raise ValueError(f"Per '{tipo}' serve il parametro 'bonus'.")
    return bonus


def price_bonus_caratteristica(obj: dict) -> int:
    bonus = _require_bonus(obj, "bonus_caratteristica")
    return (bonus ** 2) * 1000


def price_magic_armor(obj: dict) -> int:
    bonus = _require_bonus(obj, "magic_armor")
    return (bonus ** 2) * 1000


def price_bonus_ca_deviazione(obj: dict) -> int:
    bonus = _require_bonus(obj, "bonus_ca_deviazione")
    return (bonus ** 2) * 2000


def price_bonus_ca_altro(obj: dict) -> int:
    bonus = _require_bonus(obj, "bonus_ca_altro")
    return (bonus ** 2) * 2500


def price_magic_armor_naturale(obj: dict) -> int:
    bonus = _require_bonus(obj, "magic_armor_naturale")
    return (bonus ** 2) * 2000


def price_bonus_ts_resistenza(obj: dict) -> int:
    bonus = _require_bonus(obj, "bonus_ts_resistenza")
    return (bonus ** 2) * 1000


def price_bonus_ts_altro(obj: dict) -> int:
    bonus = _require_bonus(obj, "bonus_ts_altro")
    return (bonus ** 2) * 2000


def price_bonus_abilita(obj: dict) -> int:
    bonus = _require_bonus(obj, "bonus_abilita")
    return (bonus ** 2) * 100
