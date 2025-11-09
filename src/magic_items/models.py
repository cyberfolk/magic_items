from typing import Optional
from pydantic import BaseModel, Field, model_validator, computed_field
from typing import Iterable

from .enums import ItemType, Duration, BodySlot, UsageMode, ActivMode


class MagicItem(BaseModel):

    # region FIELD -----------------------------------------------------------------------------------------------------
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
    # endregion --------------------------------------------------------------------------------------------------------

    # region VALIDATION ------------------------------------------------------------------------------------------------
    @model_validator(mode="after")
    def validate_after(self):
        t = self.item_type

        if t in {ItemType.BONUS_STATS}:
            self.check_in(self.bonus, (2, 4, 6), f"Il Bonus può essere solo 2, 4 o 6")
            self.check_empty(["liv_spell", "liv_caster", "duration", "usage_mode", "activ_mode"]) # body_slot visibile

        if t in {ItemType.BONUS_CA_DEV}:
            self.check_in(self.bonus, (1, 2, 3, 4, 5), "Il Bonus deve essere tra 1 e 5")
            self.check_empty(["liv_spell", "liv_caster", "duration", "usage_mode", "activ_mode"]) # body_slot visibile

        if t in {ItemType.MAGIC_ARMOR}:
            self.check_in(self.bonus, (1, 2, 3, 4, 5), "Il Bonus deve essere tra 1 e 5")
            self.check_empty(["liv_spell", "liv_caster", "duration", "usage_mode", "activ_mode", "body_slot"])

        if t in {ItemType.SCROLL, ItemType.POTION, ItemType.WAND}:
            self.check_in(self.liv_spell,  range(1, 10), "Livello Incantesimo deve essere tra 1 e 9")
            self.check_in(self.liv_caster, range(1, 21), "Livello Incantatore deve essere tra 1 e 20")
            self.check_empty(["bonus", "duration", "usage_mode", "activ_mode", "body_slot"])

        if t == ItemType.MAGIC_EFFECT:
            self.check_not_empty(["liv_spell", "liv_caster", "usage_mode", "activ_mode"])
            self.check_in(self.liv_spell,  range(1, 10), "Livello Incantesimo deve essere tra 1 e 9")
            self.check_in(self.liv_caster, range(1, 21), "Livello Incantatore deve essere tra 1 e 20")
            self.check_empty(["bonus"])
            if self.usage_mode == UsageMode.DAILY_CHARGES:
                self.check_not_empty(["daily_charges"])
            elif self.usage_mode == UsageMode.CONTINUOUS:
                self.check_not_empty(["duration"])

        return self
    # endregion --------------------------------------------------------------------------------------------------------

    # region DESCRIPTIVE FIELD -----------------------------------------------------------------------------------------
    @computed_field
    @property
    def txt_bonus(self) -> str:
        if self.bonus not in [None, False, 0]:
            return f"+{self.bonus}"
        return ""

    @computed_field
    @property
    def txt_liv_spell_and_liv_caster(self) -> str:
        if self.liv_spell or self.liv_caster:
            return f"Incantesimo di {self.liv_spell}° Livello (LI {self.liv_caster})"
        return ""

    @computed_field
    @property
    def txt_activ_mode(self) -> str:
        if self.activ_mode:
            return self.activ_mode.label
        return ""

    @computed_field
    @property
    def txt_usage_mode(self) -> str:
        if self.usage_mode == UsageMode.FIFTY_CHARGES:
            return f"50 cariche"
        if self.usage_mode == UsageMode.DAILY_CHARGES:
            return f"Usi giornalieri {self.daily_charges}"
        if self.usage_mode == UsageMode.CONTINUOUS and self.duration:
            return f"Effetto Continuo (Durata originale in {self.duration.label})"
        return ""

    @computed_field
    @property
    def txt_body_slot(self) -> str:
        if self.body_slot in (BodySlot.NO, BodySlot.UNUSUAL):
            return self.body_slot.label
        return ""
    # endregion --------------------------------------------------------------------------------------------------------

    # region PRICE FIELD -----------------------------------------------------------------------------------------------
    @computed_field
    @property
    def price(self) -> float:
        return self._calc_price()[0]

    @computed_field
    @property
    def price_formula(self) -> str:
        return self._calc_price()[1]

    @computed_field
    @property
    def price_math(self) -> str:
        return self._calc_price()[2]

    def _calc_price(self) -> tuple[int, str, str]:
        """Ritorna (prezzo, formula) usati per il calcolo."""
        t = self.item_type

        if t in (ItemType.BONUS_STATS, ItemType.BONUS_CA_DEV, ItemType.BONUS_CA_ALTRO):
            price   = (self.bonus**2) * t.price_base * self.body_slot.price_base
            formula = f"BONUS² × PRICE_BASE × BODY_SLOT"
            math    = f"{self.bonus}² × {t.price_base} × {self.body_slot.price_base}"

        elif t in (ItemType.MAGIC_ARMOR, ItemType.MAGIC_WEAPON):
            price = (self.bonus**2) * t.price_base
            formula = f"BONUS² × PRICE_BASE"
            math = f"{self.bonus}² × {t.price_base}"

        elif t in (ItemType.SCROLL, ItemType.POTION, ItemType.WAND):
            price = self.liv_spell * self.liv_caster * t.price_base
            formula = f"LIV_SPELL × LIVE_CASTER × PRICE_BASE"
            math = f"{self.liv_spell} × {self.liv_caster} × {t.price_base}"

        elif t == ItemType.MAGIC_EFFECT:
            price = (self.liv_spell * self.liv_caster * self.activ_mode.price_base * self.body_slot.price_base)
            formula = f"LIV_SPELL × LIVE_CASTER × ACTIV_MODE × BODY_SLOT"
            math = f"{self.liv_spell} × {self.liv_caster} × {self.activ_mode.price_base} × {self.body_slot.price_base}"

            if self.usage_mode == UsageMode.FIFTY_CHARGES:
                price = price / 2
                formula = f"{formula} ÷ 2"
                math = f"({math}) ÷ 2"
            if self.usage_mode == UsageMode.DAILY_CHARGES:
                price = price / (5 / self.daily_charges)
                formula = f"{formula} ÷ (5 ÷ DAILY_CHARGES)"
                math = f"{math} ÷ (5 ÷ {self.daily_charges})"
            if self.usage_mode == UsageMode.CONTINUOUS:
                price = price * self.duration.price_base
                formula = f"{formula} × SPELL_DURATION_BASE"
                math = f"{math} × {self.duration.price_base}"

        return int(price), formula, math
    # endregion --------------------------------------------------------------------------------------------------------

    # region UTILITY METHOD --------------------------------------------------------------------------------------------
    def check_empty(self, fields: list[str]):
        """Errore se almeno uno dei campi non è None/False."""
        for f in fields:
            if getattr(self, f) not in [None, False]:
                title = self.model_fields[f].title or f
                raise ValueError(f"{f} ({title}) deve essere vuoto")

    def check_not_empty(self, fields: list[str]):
        """Errore se almeno uno dei campi è None/False."""
        for f in fields:
            if getattr(self, f) in [None, False]:
                title = self.model_fields[f].title or f
                raise ValueError(f"{f} ({title}) deve essere impostato")

    @staticmethod
    def check_in(value, allowed: Iterable, error_msg: str):
        """Errore se value non è tra i valori ammessi."""
        if value not in allowed:
            raise ValueError(error_msg)
    # endregion --------------------------------------------------------------------------------------------------------
