from pydantic import ValidationError
from magic_items.models import MagicItem
from magic_items.enums import ItemType, Duration, BodySlot, UsageMode, ActivMode

def test_bonus_item_ok():
    item = MagicItem(item_type=ItemType.MAGIC_EFFECT, liv_spell=1, liv_caster=1,
                     usage_mode=UsageMode.CONTINUOUS,
                     activ_mode=ActivMode.COMMAND_WORD, body_slot=BodySlot.CORRECT, daily_charges=1)
    a = item.price
    assert item.bonus == None
#
# def test_bonus_item_fail():
#     try:
#         MagicItem(item_type=ItemType.BONUS_STATS)
#         assert False
#     except ValidationError:
#         assert True
#
# def test_scroll_ok():
#     item = MagicItem(item_type=ItemType.SCROLL, liv_spell=1, liv_caster=3)
#     assert item.liv_spell == 1
#
# def test_scroll_fail_with_bonus():
#     try:
#         MagicItem(item_type=ItemType.SCROLL, liv_spell=1, liv_caster=3, bonus=5)
#         assert False
#     except ValidationError:
#         assert True
#
# def test_use_conflict_charges():
#     try:
#         MagicItem(item_type=ItemType.USE, liv_spell=1, liv_caster=1, daily_charges=1, fifty_charges=True)
#         assert False
#     except ValidationError:
#         assert True
