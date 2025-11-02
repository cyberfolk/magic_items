from enum import Enum


class ItemType(str, Enum):
    BONUS_STATS = "bonus_caratteristica"
    BONUS_ARMOR = "bonus_armatura"
    BONUS_CA_DEV = "bonus_ca_deviazione"
    BONUS_CA_ALTRO = "bonus_ca_altro"
    SCROLL = "scroll"
    POTION = "potion"
    WAND = "wand"
    USE = "use_activated"

    @property
    def label(self):
        return {
            "bonus_caratteristica": "Bonus di Caratteristica (Potenziamento)",
            "bonus_armatura": "Bonus Armatura (Potenziamento)",
            "bonus_ca_deviazione": "Bonus CA (Deviazione)",
            "bonus_ca_altro": "Bonus CA (Altro)",
            "use_activated": "Oggetto Attivato ad uso",
            "scroll": "Pergamena",
            "potion": "Pozione",
            "wand": "Bacchetta",
        }[self.value]


class Duration(str, Enum):
    ONE_MIN = "1_min"
    TEN_MIN = "10_min"
    ROUND = "round"
    DAY = "24h"

    @property
    def label(self):
        return {
            "round": "Round",
            "1_min": "1 Minuto",
            "10_min": "10 Minuti",
            "24h": "24 Ore",
        }[self.value]


class BodySlot(str, Enum):
    CORRECT = "correct"
    UNUSUAL = "unusual"
    NO = "no"

    @property
    def label(self):
        return {
            "correct": "Compatibile",
            "unusual": "Insolito",
            "no": "Nessuno",
        }[self.value]


class UsageMode(str, Enum):
    FIFTY_CHARGES = "fifty_charges"
    DAILY_CHARGES = "daily_charges"
    CONTINUOUS = "continuous"

    @property
    def label(self):
        return {
            "fifty_charges": "50 Cariche",
            "daily_charges": "Cariche Giornaliere",
            "continuous": "Effetto Continuo",
        }[self.value]
