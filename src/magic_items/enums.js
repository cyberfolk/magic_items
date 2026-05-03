export const ItemType = Object.freeze({
  BONUS_STATS:  { value: "bonus_caratteristica", label: "Bonus di Caratteristica", price_base: 1000 },
  MAGIC_ARMOR:  { value: "magic_armor",          label: "Armatura Magica",         price_base: 1000 },
  BONUS_SPELL:  { value: "bonus_spell",          label: "Incantesimo bonus",       price_base: 1000 },
  MAGIC_WEAPON: { value: "magic_weapon",         label: "Arma Magica",             price_base: 2000 },
  BONUS_CA:     { value: "bonus_ca",             label: "Bonus CA",                price_base: 1000 },
  MAGIC_EFFECT: { value: "magic_effect",         label: "Oggetto Effetto Magico",  price_base: 1    },
  BONUS_TS:     { value: "bonus_ts",             label: "Bonus TS",                price_base: 1000 },
  SCROLL:       { value: "scroll",               label: "Pergamena",               price_base: 25   },
  POTION:       { value: "potion",               label: "Pozione",                 price_base: 50   },
  WAND:         { value: "wand",                 label: "Bacchetta",               price_base: 750  },
});

export const Duration = Object.freeze({
  HOUR:    { value: "hours",   label: "Ore",       price_base: 1.0 },
  TEN_MIN: { value: "10_mins", label: "10 Minuti", price_base: 1.5 },
  ONE_MIN: { value: "1_mins",  label: "1 Minuto",  price_base: 2.0 },
  ROUND:   { value: "rounds",  label: "Rounds",    price_base: 4.0 },
  DAY:     { value: "Days",    label: "Giorni",    price_base: 0.5 },
});

export const BodySlot = Object.freeze({
  CORRECT: { value: "correct", label: "Compatibile", price_base: 1.0 },
  UNUSUAL: { value: "unusual", label: "Insolito",    price_base: 1.5 },
  NO:      { value: "no",      label: "Nessuno",     price_base: 2.0 },
});

export const UsageMode = Object.freeze({
  CONTINUOUS:    { value: "continuous",    label: "Effetto Continuo",    price_base: 1 },
  FIFTY_CHARGES: { value: "fifty_charges", label: "50 Cariche",          price_base: 1 },
  DAILY_CHARGES: { value: "daily_charges", label: "Cariche Giornaliere", price_base: 1 },
});

export const ActivMode = Object.freeze({
  USE_ACTIVATED: { value: "use_activated", label: "Attivato ad uso",   price_base: 2000 },
  COMMAND_WORD:  { value: "command_word",  label: "Parola di Comando", price_base: 1800 },
});

export const BonusType = Object.freeze({
  ENHANCEMENT:   { value: "enhancement",   label: "Potenziamento",                               price_base: 1.0 },
  CA_DEFLECTION: { value: "ca_deflection", label: "Deviazione",                                  price_base: 2.0 },
  CA_NATURAL:    { value: "ca_natural",    label: "Naturale",                                    price_base: 2.0 },
  TS_RESISTENCE: { value: "ts_resistence", label: "Resistenza",                                  price_base: 1.0 },
  CA_OTHERS:     { value: "ca_others",     label: "Altri (Fortuna, Cognitivo, Sacro o Profano)", price_base: 2.5 },
  TS_OTHERS:     { value: "ts_others",     label: "Altri (Fortuna, Cognitivo, Sacro o Profano)", price_base: 2.0 },
});

export function byValue(enumObj, val) {
  return Object.values(enumObj).find(e => e.value === val) ?? null;
}
