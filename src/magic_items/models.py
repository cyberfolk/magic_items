from typing import Optional
from pydantic import BaseModel, Field, model_validator, computed_field

from .enums import ItemType, Duration, BodySlot, UsageMode, ActivMode


class MagicItem(BaseModel):
    item_type: ItemType = Field(..., title="Tipo Oggetto")

    bonus: Optional[int] = Field(None, title="Bonus")
    liv_spell: Optional[int] = Field(None, title="Livello Incantesimo")
    liv_caster: Optional[int] = Field(None, title="Livello Incantatore")
    daily_charges: Optional[int] = Field(None, title="Cariche Giornaliere")
    body_slot: Optional[BodySlot] = Field(None, title="Slot Corporeo")
    fifty_charges: Optional[bool] = Field(None, title="50 Cariche")

    usage_mode: Optional[UsageMode] = Field(None, title="Modalità d'Uso")
    activ_mode: Optional[ActivMode] = Field(None, title="Modalità d'Attivazione")
    duration: Optional[Duration] = Field(None, title="Durata Incantesimo Originale")
    # ------------------------------------------------------------------------------------------------------------------

    @model_validator(mode="after")
    def validate_logic(self):
        t = self.item_type

        if t in {ItemType.BONUS_STATS}:
            if self.bonus is None or self.bonus not in (2, 4, 6):
                raise ValueError(f"Il {ItemType.BONUS_STATS.label} può essere solo 2, 4 o 6")
            for f in ["liv_spell", "liv_caster", "duration", "usage_mode", "activ_mode"]:  # body_slot visibile
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.BONUS_CA_DEV}:
            if self.bonus is None or self.bonus < 1 or self.bonus > 5:
                raise ValueError("Il Bonus deve essere tra 1 e 5")
            for f in ["liv_spell", "liv_caster", "duration", "usage_mode", "activ_mode"]:  # body_slot visibile
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.MAGIC_ARMOR}:
            if self.bonus is None or self.bonus < 1 or self.bonus > 5:
                raise ValueError("Il Bonus deve essere tra 1 e 5")
            for f in ["liv_spell", "liv_caster", "duration", "usage_mode", "activ_mode", "body_slot"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f.label} deve essere vuoto")

        if t in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND}:
            if self.liv_spell is None or self.liv_spell < 1 or self.liv_spell > 9:
                raise ValueError("Livello Incantesimo deve essere tra 1 e 9")
            if self.liv_caster is None or self.liv_caster < 1 or self.liv_caster > 20:
                raise ValueError("Livello Incantatore deve essere tra 1 e 20")
            for f in ["bonus", "duration", "usage_mode", "activ_mode", "body_slot"]:
                if getattr(self, f) not in [None, False]:
                    raise ValueError(f"{f} deve essere vuoto")

        if t == ItemType.MAGIC_EFFECT:
            if self.bonus not in [None, False]:
                raise ValueError("Bonus deve essere vuoto")
            if self.liv_spell is None or self.liv_spell < 1 or self.liv_spell > 9:
                raise ValueError("Livello Incantesimo deve essere tra 1 e 9")
            if self.liv_caster is None or self.liv_caster < 1 or self.liv_caster > 20:
                raise ValueError("Livello Incantatore deve essere tra 1 e 20")
            if self.usage_mode in [None, False]:
                raise ValueError("Modalità d'Uso deve essere compilato")
            if self.activ_mode in [None, False]:
                raise ValueError("Modalità d'Attivazione deve essere compilato")
            elif self.usage_mode == UsageMode.DAILY_CHARGES:
                if self.daily_charges in [None, False]:
                    raise ValueError("Specificare il Numero di Cariche Giornaliere")
            elif self.usage_mode == UsageMode.CONTINUOUS:
                if self.duration in [None, False]:
                    raise ValueError(
                        "Specificare la durata originale dell'incantesimo per gli Oggetti a Effetto Continuo")
            # elif self.usage_mode == UsageMode.FIFTY_CHARGES:
            #     Questo caso è OK non necessita alcun campo ulteriore

        return self
    # ------------------------------------------------------------------------------------------------------------------

    @computed_field
    @property
    def name(self) -> str:
        t = self.item_type

        if t == ItemType.BONUS_STATS:
            name = f"{ItemType.BONUS_STATS.label} +{self.bonus}"
            if self.body_slot != BodySlot.CORRECT:
                name += f" | Slot Corporeo {self.body_slot.label}"
            return name

        if t == ItemType.MAGIC_ARMOR:
            return f"Armatura +{self.bonus}"

        if t == ItemType.MAGIC_WEAPON:
            return f"Arma +{self.bonus}"

        if t == ItemType.BONUS_CA_DEV:
            name = f"Oggetto +{self.bonus} CA (Deviazione)"
            if self.body_slot != BodySlot.CORRECT:
                name += f" | Slot Corporeo {self.body_slot.label}"
            return name

        if t == ItemType.BONUS_CA_ALTRO:
            name = f"Oggetto +{self.bonus} CA (Altro)"
            if self.body_slot != BodySlot.CORRECT:
                name += f" | Slot Corporeo {self.body_slot.label}"
            return name

        if t == ItemType.SCROLL:
            return f"Pergamena di {self.liv_spell}° Livello (LI {self.liv_caster})"

        if t == ItemType.POTION:
            return f"Pozione di {self.liv_spell}° Livello (LI {self.liv_caster})"

        if t == ItemType.WAND:
            return f"Bacchetta di {self.liv_spell}° Livello (LI {self.liv_caster})"

        if t == ItemType.MAGIC_EFFECT:
            name = f"Oggetto a Effetto Magico"
            if self.activ_mode:
                name += f" | Incantesimo di {self.liv_spell}° Livello (LI {self.liv_caster})"
            if self.activ_mode:
                name += f" | {self.activ_mode.label}"
            if self.usage_mode == UsageMode.FIFTY_CHARGES:
                name += f" | 50 cariche"
            if self.usage_mode == UsageMode.DAILY_CHARGES:
                name += f" | Usi giornalieri {self.daily_charges}"
            if self.usage_mode == UsageMode.CONTINUOUS:
                name += f" | Effetto Continuo (Durata originale {self.duration.label})"
            if self.body_slot != BodySlot.CORRECT:
                name += f" | Slot Corporeo {self.body_slot.label}"
            return name

        return t.label
    # ------------------------------------------------------------------------------------------------------------------

    @computed_field
    @property
    def price(self) -> float:
        t = self.item_type

        price = 0

        if t in ItemType.BONUS_STATS:
            return (self.bonus ** 2) * self.item_type.price_base * self.body_slot.price_base

        if t == ItemType.MAGIC_ARMOR:
            return (self.bonus ** 2) * self.item_type.price_base

        if t == ItemType.MAGIC_WEAPON:
            return (self.bonus ** 2) * self.item_type.price_base

        if t in ItemType.BONUS_CA_DEV:
            return (self.bonus ** 2) * self.item_type.price_base * self.body_slot.price_base

        if t in ItemType.BONUS_CA_ALTRO:
            return (self.bonus ** 2) * self.item_type.price_base * self.body_slot.price_base

        if t == ItemType.SCROLL:
            return self.liv_spell * self.liv_caster * self.item_type.price_base

        if t == ItemType.POTION:
            return self.liv_spell * self.liv_caster * self.item_type.price_base

        if t == ItemType.WAND:
            return self.liv_spell * self.liv_caster * self.item_type.price_base

        if t == ItemType.MAGIC_EFFECT:
            base = self.liv_spell * self.liv_caster * self.activ_mode.price_base * self.body_slot.price_base
            if self.usage_mode == UsageMode.FIFTY_CHARGES:
                return base / 2
            if self.daily_charges:
                return base / (5 / self.daily_charges)  # # DMG rule: dividi per (5 / cariche)
            if self.duration:
                return base * self.duration.price_base
            return base

        return price
    # ------------------------------------------------------------------------------------------------------------------

    def get_body_slot_txt(self):
        """Ritorna una descrizione dello slot corporeo, o una stringa vuota se corretto."""
        if self.body_slot != BodySlot.CORRECT:
            return f" | Slot Corporeo {body_slot.label}"
        return ""

    def get_liv_spell_txt(self):
        """Ritorna una descrizione Livello Incantesimo e LI, o una stringa vuota se info assenti."""
        if self.liv_spell or self.liv_caster:
            return f"di {self.liv_spell}° Livello (LI {self.liv_caster})"
        return ""

    def ensure_empty_fields(self, fields: list[str]):
        for field in fields:
            if getattr(self, field) not in [None, False]:
                raise ValueError(f"{field} deve essere vuoto")
    # ------------------------------------------------------------------------------------------------------------------
