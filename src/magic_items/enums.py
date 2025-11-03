from enum import Enum


class LabeledEnum(str, Enum):
    def __new__(cls, value, label, price_base):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        obj.price_base = price_base
        return obj


class ItemType(LabeledEnum):
    BONUS_STATS     = ("bonus_caratteristica",  "Bonus di Caratteristica (Potenziamento)",  1000)
    MAGIC_ARMOR     = ("magic_armor",           "Armatura Magica (Potenziamento)",          1000)
    MAGIC_WEAPON    = ("magic_weapon",          "Arma Magica (Potenziamento)",              2000)
    BONUS_CA_DEV    = ("bonus_ca_deviazione",   "Bonus CA (Deviazione)",                    2000)
    BONUS_CA_ALTRO  = ("bonus_ca_altro",        "Bonus CA (Altro)",                         2500)
    MAGIC_EFFECT    = ("magic_effect",          "Effetto Magico",                           1)
    SCROLL          = ("scroll",                "Pergamena",                                25)
    POTION          = ("potion",                "Pozione",                                  50)
    WAND            = ("wand",                  "Bacchetta",                                750)


class Duration(LabeledEnum):
    HOUR    = ("hours",     "Ore",          1)
    TEN_MIN = ("10_mins",   "10 Minuti",    1.5)
    ONE_MIN = ("1_mins",    "1 Minuti",     2)
    ROUND   = ("rounds",    "Rounds",       4)
    DAY     = ("Days",      "Giorni",       0.5)


class BodySlot(LabeledEnum):
    CORRECT = ("correct",   "Compatibile",  1)
    UNUSUAL = ("unusual",   "Insolito",     1.5)
    NO      = ("no",        "Nessuno",      2)


class UsageMode(str, Enum):
    CONTINUOUS = "continuous"
    FIFTY_CHARGES = "fifty_charges"
    DAILY_CHARGES = "daily_charges"

    @property
    def label(self):
        return {
            "fifty_charges": "50 Cariche",
            "daily_charges": "Cariche Giornaliere",
            "continuous": "Effetto Continuo",
        }[self.value]


class ActivMode(LabeledEnum):
    USE_ACTIVATED   = ("use_activated", "Attivato ad uso",   2000)
    COMMAND_WORD    = ("command_word",  "Parola di Comando", 1800)

# Bonus di caratteristica (potenziamento)
# Bonus di armatura (potenziamento)
# Incantesimo bonus
# Bonus alla CA (deviazione)
# Bonus alla CA (altro)
# Bonus di armatura naturale (potenziamento)
# Bonus ai tiri salvezza (resistenza)
# Bonus ai tiri salvezza (altro)
# Bonus di abilità (competenza)
# Resistenza agli incantesimi
# Bonus dell'arma (potenziamento)
