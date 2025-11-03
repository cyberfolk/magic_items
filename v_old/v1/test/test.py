import pytest
from ..src.price import get_magic_item_price


def test_bonus_statici():
    assert get_magic_item_price({"tipo": "bonus_caratteristica", "bonus": 2}) == 4000  # 2^2 * 1000
    assert get_magic_item_price({"tipo": "magic_armor", "bonus": 1}) == 1000  # 1^2 * 1000
    assert get_magic_item_price({"tipo": "bonus_ca_deviazione", "bonus": 3}) == 18000  # 3^2 * 2000


def test_scroll_potion_wand():
    assert get_magic_item_price({"tipo": "scroll", "liv_spell": 3, "liv_caster": 5}) == 375
    assert get_magic_item_price({"tipo": "potion", "liv_spell": 2, "liv_caster": 3}) == 300
    assert get_magic_item_price({"tipo": "wand", "liv_spell": 3, "liv_caster": 5}) == 11250


def test_use_activated_durata():
    base = 2 * 3 * 2000  # 12.000
    obj1 = {"tipo": "use_activated", "liv_spell": 2, "liv_caster": 3, "durata": "round"}
    obj2 = {"tipo": "use_activated", "liv_spell": 2, "liv_caster": 3, "durata": "1_min"}
    obj3 = {"tipo": "use_activated", "liv_spell": 2, "liv_caster": 3, "durata": "10_min"}
    obj4 = {"tipo": "use_activated", "liv_spell": 2, "liv_caster": 3, "durata": "24h"}

    assert get_magic_item_price(obj1) == base * 4.0
    assert get_magic_item_price(obj2) == base * 2.0
    assert get_magic_item_price(obj3) == base * 1.5
    assert get_magic_item_price(obj4) == base * 0.5


def test_modificatori_cariche():
    base = 6 * 11 * 2000  # 132.000
    obj1 = {"tipo": "use_activated", "liv_spell": 6, "liv_caster": 11, "mods": [{"tipo": "daily_charges", "n": 1}]}
    obj2 = {"tipo": "use_activated", "liv_spell": 6, "liv_caster": 11, "mods": [{"tipo": "daily_charges", "n": 2}]}
    obj3 = {"tipo": "use_activated", "liv_spell": 6, "liv_caster": 11, "mods": [{"tipo": "daily_charges", "n": 3}]}

    assert get_magic_item_price(obj1) == base / 5
    assert get_magic_item_price(obj2) == base / (5 / 2)
    assert get_magic_item_price(obj3) == base / (5 / 3)


def test_modificatori_speciali():
    base = 5 * 9 * 2000  # 90.000
    obj1 = {"tipo": "use_activated", "liv_spell": 5, "liv_caster": 9, "mods": [{"tipo": "slot", "t_slot": "unusual"}]}
    obj2 = {"tipo": "use_activated", "liv_spell": 5, "liv_caster": 9, "mods": [{"tipo": "slot", "t_slot": "no"}]}
    obj3 = {"tipo": "use_activated", "liv_spell": 5, "liv_caster": 9, "mods": [{"tipo": "fifty_charges"}]}
    obj4 = {"tipo": "use_activated", "liv_spell": 3, "liv_caster": 5, "mods": [{"tipo": "daily_charges", "n": 1}, {"tipo": "slot", "t_slot": 'correct'}]}
    obj5 = {"tipo": "use_activated", "liv_spell": 6, "liv_caster": 11, "mods": [{"tipo": "daily_charges", "n": 1}, {"tipo": "slot", "t_slot": 'correct'}]}

    assert get_magic_item_price(obj1) == base * 1.5
    assert get_magic_item_price(obj2) == base * 2
    assert get_magic_item_price(obj3) == base / 2
    assert get_magic_item_price(obj4) == 26400
    assert get_magic_item_price(obj5) == 6000


# def test_componenti():
#     base = 3 * 5 * 750  # 11250
#     obj = {"tipo": "wand", "liv_spell": 3, "liv_caster": 5,
#            "material_cost": 1500, "xp_cost": 200}
#     costo = get_magic_item_price(obj)
#     assert costo == base + 1500 + (200 * 5)


def test_tipo_non_valido():
    with pytest.raises(ValueError):
        get_magic_item_price({"tipo": "bonus_hp_temp", "bonus": 5})


if __name__ == "__main__":
    pytest.main(["-v", __file__])


