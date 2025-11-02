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

        if t in {ItemType.BONUS_CAR}:
            if self.bonus is None or self.bonus not in (2, 4, 6):
                raise ValueError(f"Il {ItemType.BONUS_CAR.label} può essere solo 2, 4 o 6")
            for f in ["liv_spell", "liv_caster", "duration", "daily_charges", "body_slot", "fifty_charges"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.BONUS_ARM, ItemType.BONUS_DEV}:
            if self.bonus is None or self.bonus < 1 or self.bonus > 5:
                raise ValueError("Il Bonus deve essere tra 1 e 5")
            for f in ["liv_spell", "liv_caster", "duration", "daily_charges", "body_slot", "fifty_charges"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND}:
            if self.bonus not in [None, False]:
                raise ValueError("Bonus deve essere vuoto")
            if self.liv_spell is None or self.liv_spell < 1 or self.liv_spell > 9:
                raise ValueError("Livello Incantesimo deve essere tra 1 e 9")
            if self.liv_caster is None or self.liv_caster < 1 or self.liv_caster > 20:
                raise ValueError("Livello Incantatore deve essere tra 1 e 20")
            for f in ["duration", "daily_charges", "body_slot", "fifty_charges"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f} deve essere vuoto")

        if t == ItemType.USE:
            if self.bonus not in [None, False]:
                raise ValueError("Bonus deve essere vuoto")
            if self.liv_spell is None or self.liv_spell < 1 or self.liv_spell > 9:
                raise ValueError("Livello Incantesimo deve essere tra 1 e 9")
            if self.liv_caster is None or self.liv_caster < 1 or self.liv_caster > 20:
                raise ValueError("Livello Incantatore deve essere tra 1 e 20")
            if self.daily_charges and self.fifty_charges:
                raise ValueError("Impossibile selezionare sia '50 cariche' che 'cariche giornaliere'")

        return self
