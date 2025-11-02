from typing import Optional
from pydantic import BaseModel, Field, model_validator

from .enums import ItemType, Duration, BodySlot


class MagicItem(BaseModel):
    item_type: ItemType = Field(..., title="Tipo Oggetto")

    bonus: Optional[int] = Field(None, title="Bonus Caratteristica")
    liv_spell: Optional[int] = Field(None, title="Livello Incantesimo")
    liv_caster: Optional[int] = Field(None, title="Livello Incantatore")
    duration: Optional[Duration] = Field(None, title="Durata")
    daily_charges: Optional[int] = Field(None, title="Cariche Giornaliere")
    body_slot: Optional[BodySlot] = Field(None, title="Slot Corporeo")
    fifty_charges: Optional[bool] = Field(None, title="50 Cariche")

    @model_validator(mode="after")
    def validate_logic(self):
        t = self.item_type

        if t in {ItemType.BONUS_CAR, ItemType.BONUS_ARM, ItemType.BONUS_DEV}:
            if self.bonus is None:
                raise ValueError("Bonus richiesto")
            for f in ["liv_spell", "liv_caster", "duration", "daily_charges", "body_slot", "fifty_charges"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f} deve essere vuoto")

        if t in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND}:
            if self.bonus not in [None, False]:
                raise ValueError("Bonus deve essere vuoto")
            if self.liv_spell is None or self.liv_caster is None:
                raise ValueError("Livello incantesimo e incantatore richiesti")
            for f in ["duration", "daily_charges", "body_slot", "fifty_charges"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f} deve essere vuoto")

        if t == ItemType.USE:
            if self.bonus not in [None, False]:
                raise ValueError("Bonus deve essere vuoto")
            if self.liv_spell is None or self.liv_caster is None:
                raise ValueError("Livello incantesimo e incantatore richiesti")
            if self.daily_charges and self.fifty_charges:
                raise ValueError("daily_charges e fifty_charges incompatibili")

        return self
