from typing import Optional
from pydantic import BaseModel, Field, model_validator, computed_field

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
            for f in ["liv_spell", "liv_caster", "duration", "daily_charges", "fifty_charges"]:  # body_slot visibile
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.BONUS_DEV}:
            if self.bonus is None or self.bonus < 1 or self.bonus > 5:
                raise ValueError("Il Bonus deve essere tra 1 e 5")
            for f in ["liv_spell", "liv_caster", "duration", "daily_charges", "fifty_charges"]:  # body_slot visibile
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.BONUS_ARM}:
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

    # === COMPUTED FIELDS === #

    @computed_field
    @property
    def name(self) -> str:
        t = self.item_type

        if t == ItemType.BONUS_CAR:
            return f"Oggetto Caratteristica +{self.bonus}"

        if t == ItemType.BONUS_ARM:
            return f"Armatura +{self.bonus}"

        if t == ItemType.BONUS_DEV:
            return f"Oggetto +{self.bonus} CA (Deviazione)"

        if t == ItemType.SCROLL:
            return f"Pergamena di {self.liv_spell}° Livello (LI {self.liv_caster})"

        if t == ItemType.POTION:
            return f"Pozione di {self.liv_spell}° Livello (LI {self.liv_caster})"

        if t == ItemType.WAND:
            return f"Bacchetta di {self.liv_spell}° Livello (LI {self.liv_caster})"

        if t == ItemType.USE:
            name = f"Oggetto con Incantesimo di {self.liv_spell}° Livello (LI {self.liv_caster})"
            if self.fifty_charges:
                name += f", 50 cariche"
            if self.daily_charges:
                name += f", {self.daily_charges} usi giornalieri"
            if self.body_slot != BodySlot.CORRECT:
                name += f", Slot Corporeo {self.body_slot}"
            return name

        return t.label

    # @computed_field
    # @property
    # def price(self) -> int:
    #     t = self.item_type

        # # bonus items formula: bonus^2 * cost
        # if t == ItemType.BONUS_CAR or t == ItemType.BONUS_ARM:
        #     return (self.bonus ** 2) * 1000
        # if t == ItemType.BONUS_DEV:
        #     return (self.bonus ** 2) * 2000
        #
        # # scroll
        # if t == ItemType.SCROLL:
        #     return self.liv_spell * self.liv_caster * 25
        #
        # # potion
        # if t == ItemType.POTION:
        #     return self.liv_spell * self.liv_caster * 50
        #
        # # wand (50 charges)
        # if t == ItemType.WAND:
        #     return self.liv_spell * self.liv_caster * 750
        #
        # # use activated
        # if t == ItemType.USE:
        #     base = self.liv_spell * self.liv_caster * 2000
        #     if self.fifty_charges:
        #         return base // 2
        #     if self.daily_charges:
        #         # divide per (5 / charges_per_day)
        #         # DMG rule: dividi per (5 / cariche)
        #         return int(base / (5 / self.daily_charges))
        #     return base

        # return 0

# Se un oggetto continuo
#   ha un effetto basato su di un incantesimo
#       con una durata misurata in round, moltiplicare il costo per 4.
#       Se la durata dell'incantesimo è 1 minuto per livello, moltiplicare il costo per 2,
#       e se la durata è 10 minuti per livello, moltiplicare il costo per 1,5.
#       Se l'incantesimo ha una durata di 24 ore o superiore, dimezzare il costo.
