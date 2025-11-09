import pytest
from pydantic import ValidationError
from magic_items.models import MagicItem
from magic_items.enums import ItemType, Duration, BodySlot, UsageMode, ActivMode

def test_magic_effect_continuous_price_and_descriptions():
    item = MagicItem(
        item_type=ItemType.MAGIC_EFFECT,
        liv_spell=3,
        liv_caster=5,
        usage_mode=UsageMode.CONTINUOUS,
        activ_mode=ActivMode.COMMAND_WORD,
        body_slot=BodySlot.CORRECT,
        duration=Duration.TEN_MIN,
    )

    assert item.price == 40500
    assert item.price_formula == "LIV_SPELL × LIVE_CASTER × ACTIV_MODE × BODY_SLOT × SPELL_DURATION_BASE"
    assert item.price_math == "3 × 5 × 1800 × 1.0 × 1.5"
    assert item.txt_liv_spell_and_liv_caster == "Incantesimo di 3° Livello (LI 5)"
    assert item.txt_usage_mode == "Effetto Continuo (Durata originale in 10 Minuti)"


def test_magic_effect_continuous_requires_duration():
    with pytest.raises(ValidationError):
        MagicItem(
            item_type=ItemType.MAGIC_EFFECT,
            liv_spell=1,
            liv_caster=1,
            usage_mode=UsageMode.CONTINUOUS,
            activ_mode=ActivMode.COMMAND_WORD,
            body_slot=BodySlot.CORRECT,
        )


def test_magic_effect_daily_charges_requires_value():
    with pytest.raises(ValidationError):
        MagicItem(
            item_type=ItemType.MAGIC_EFFECT,
            liv_spell=2,
            liv_caster=3,
            usage_mode=UsageMode.DAILY_CHARGES,
            activ_mode=ActivMode.USE_ACTIVATED,
            body_slot=BodySlot.UNUSUAL,
        )


@pytest.mark.parametrize("bonus", [1, 3, 7])
def test_bonus_stats_accepts_only_specific_bonuses(bonus: int):
    with pytest.raises(ValidationError):
        MagicItem(item_type=ItemType.BONUS_STATS, bonus=bonus, body_slot=BodySlot.CORRECT)


def test_bonus_stats_valid_bonus_sets_description():
    item = MagicItem(item_type=ItemType.BONUS_STATS, bonus=4, body_slot=BodySlot.UNUSUAL)

    assert item.txt_bonus == "+4"
    assert item.txt_body_slot == "Insolito"
    assert item.price == 24000


def test_scroll_forbids_bonus_field():
    with pytest.raises(ValidationError):
        MagicItem(item_type=ItemType.SCROLL, liv_spell=1, liv_caster=3, bonus=5)


def test_scroll_price_and_descriptions():
    item = MagicItem(item_type=ItemType.SCROLL, liv_spell=2, liv_caster=7)

    assert item.price == 350
    assert item.price_formula == "LIV_SPELL × LIVE_CASTER × PRICE_BASE"
    assert item.price_math == "2 × 7 × 25"
    assert item.txt_bonus == ""
