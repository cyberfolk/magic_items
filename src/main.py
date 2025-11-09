import logging

from magic_items.enums import ItemType, Duration, BodySlot, UsageMode, ActivMode
from magic_items.models import MagicItem
from pydantic import ValidationError


if __name__ == "__main__":
    try:
        item = MagicItem(
            item_type=ItemType.MAGIC_EFFECT,
            liv_spell=1,
            liv_caster=1,
            usage_mode='fifty_charges',
            activ_mode='use_activated',
        )
        item.name
    except ValidationError as e:
        for err in e.errors():
            logging.error("\n" + err["msg"])
