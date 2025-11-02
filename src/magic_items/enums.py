from enum import Enum

class ItemType(str, Enum):
    BONUS_CAR = "bonus_caratteristica"
    BONUS_ARM = "bonus_armatura"
    BONUS_DEV = "bonus_ca_deviazione"
    SCROLL = "scroll"
    POTION = "potion"
    WAND = "wand"
    USE = "use_activated"

    @property
    def label(self):
        return {
            "bonus_caratteristica": "Bonus Caratteristica",
            "bonus_ca_deviazione": "Bonus CA (Deviazione)",
            "bonus_armatura": "Bonus Armatura",
            "use_activated": "Oggetto Attivabile",
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
