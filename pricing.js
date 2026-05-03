// Magic Item Builder — D&D 3.5 pricing engine
// Riallineato al core in magic_items/src/magic_items/{enums.js,models.js}
// Esteso per restituire un array di "tokens" strutturati per il rendering equazione.
(function () {
const ItemType = Object.freeze({
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

const Duration = Object.freeze({
  TEN_MIN: { value: "10_mins", label: "10 Minuti", price_base: 1.5 },
  ONE_MIN: { value: "1_mins",  label: "1 Minuto",  price_base: 2.0 },
  ROUND:   { value: "rounds",  label: "Rounds",    price_base: 4.0 },
  DAY:     { value: "Days",    label: "Giorni",    price_base: 0.5 },
});

const BodySlot = Object.freeze({
  CORRECT: { value: "correct", label: "Compatibile", price_base: 1.0 },
  UNUSUAL: { value: "unusual", label: "Insolito",    price_base: 1.5 },
  NO:      { value: "no",      label: "Nessuno",     price_base: 2.0 },
});

const UsageMode = Object.freeze({
  CONTINUOUS:    { value: "continuous",    label: "Effetto Continuo",    price_base: 1 },
  FIFTY_CHARGES: { value: "fifty_charges", label: "50 Cariche",          price_base: 1 },
  DAILY_CHARGES: { value: "daily_charges", label: "Cariche Giornaliere", price_base: 1 },
});

const ActivMode = Object.freeze({
  USE_ACTIVATED: { value: "use_activated", label: "Attivato ad uso",   price_base: 2000 },
  COMMAND_WORD:  { value: "command_word",  label: "Parola di Comando", price_base: 1800 },
});

const BonusType = Object.freeze({
  ENHANCEMENT:   { value: "enhancement",   label: "Potenziamento",                              price_base: 1.0 },
  CA_DEFLECTION: { value: "ca_deflection", label: "Deviazione",                                 price_base: 2.0 },
  CA_NATURAL:    { value: "ca_natural",    label: "Naturale",                                   price_base: 2.0 },
  TS_RESISTENCE: { value: "ts_resistence", label: "Resistenza",                                 price_base: 1.0 },
  CA_OTHERS:     { value: "ca_others",     label: "Fortuna, Cognitivo, Sacro o Profano",        price_base: 2.5 },
  TS_OTHERS:     { value: "ts_others",     label: "Fortuna, Cognitivo, Sacro o Profano",        price_base: 2.0 },
});

function byValue(enumObj, val) {
  return Object.values(enumObj).find((e) => e.value === val) ?? null;
}

function fmtFloat(n) {
  return Number.isInteger(n) ? `${n}.0` : String(n);
}

function fmtNum(n) {
  return n.toLocaleString("it-IT");
}

class MagicItem {
  constructor(fields) {
    this.item_type     = fields.item_type;
    this.bonus         = fields.bonus         ?? null;
    this.liv_spell     = fields.liv_spell     ?? null;
    this.liv_caster    = fields.liv_caster    ?? null;
    this.daily_charges = fields.daily_charges ?? null;
    this.body_slot     = fields.body_slot     ?? null;
    this.usage_mode    = fields.usage_mode    ?? null;
    this.activ_mode    = fields.activ_mode    ?? null;
    this.duration      = fields.duration      ?? null;
    this.bonus_type    = fields.bonus_type    ?? null;

    const r = this._calcPrice();
    this._price = r.price;
    this._tokens = r.tokens;
  }

  get price()  { return this._price; }
  get tokens() { return this._tokens; }

  _calcPrice() {
    const t = this.item_type;
    if (!t) return { price: 0, tokens: [] };

    if (t === ItemType.BONUS_STATS || t === ItemType.BONUS_CA || t === ItemType.BONUS_TS) {
      if (!this.bonus_type || !this.body_slot) return { price: 0, tokens: [] };
      const btPb  = this.bonus_type.price_base;
      const price = (this.bonus ** 2) * t.price_base * this.body_slot.price_base * btPb;
      const tokens = [
        { sym: "BONUS²",      label: "Bonus",        value: `${this.bonus}² = ${this.bonus ** 2}` },
        { sym: "PRICE_BASE",  label: "Base oggetto", value: fmtNum(t.price_base), op: "×" },
        { sym: "BODY_SLOT",   label: this.body_slot.label,  value: `×${fmtFloat(this.body_slot.price_base)}`, op: "×" },
      ];
      if (t !== ItemType.BONUS_STATS) {
        tokens.push({ sym: "BONUS_TYPE", label: this.bonus_type.label, value: `×${fmtFloat(btPb)}`, op: "×" });
      }
      return { price: Math.trunc(price), tokens };
    }

    if (t === ItemType.MAGIC_ARMOR || t === ItemType.MAGIC_WEAPON) {
      const price = (this.bonus ** 2) * t.price_base;
      const tokens = [
        { sym: "BONUS²",     label: "Bonus",        value: `${this.bonus}² = ${this.bonus ** 2}` },
        { sym: "PRICE_BASE", label: "Base oggetto", value: fmtNum(t.price_base), op: "×" },
      ];
      return { price: Math.trunc(price), tokens };
    }

    if (t === ItemType.SCROLL || t === ItemType.POTION || t === ItemType.WAND) {
      if (!this.liv_spell || !this.liv_caster) return { price: 0, tokens: [] };
      const price = this.liv_spell * this.liv_caster * t.price_base;
      const tokens = [
        { sym: "LIV_SPELL",  label: "Liv. Inc.",       value: String(this.liv_spell) },
        { sym: "LIV_CASTER", label: "Liv. Inc.tore",   value: String(this.liv_caster), op: "×" },
        { sym: "PRICE_BASE", label: "Base " + t.label, value: fmtNum(t.price_base) + " mo", op: "×" },
      ];
      return { price: Math.trunc(price), tokens };
    }

    if (t === ItemType.BONUS_SPELL) {
      if (!this.liv_spell) return { price: 0, tokens: [] };
      const price = (this.liv_spell ** 2) * t.price_base;
      const tokens = [
        { sym: "LIV_SPELL²", label: "Liv. Incantesimo", value: `${this.liv_spell}² = ${this.liv_spell ** 2}` },
        { sym: "PRICE_BASE", label: "Base",             value: fmtNum(t.price_base) + " mo", op: "×" },
      ];
      return { price: Math.trunc(price), tokens };
    }

    if (t === ItemType.MAGIC_EFFECT) {
      if (!this.liv_spell || !this.liv_caster || !this.activ_mode || !this.body_slot || !this.usage_mode)
        return { price: 0, tokens: [] };

      let price = this.liv_spell * this.liv_caster * this.activ_mode.price_base * this.body_slot.price_base;
      const tokens = [
        { sym: "LIV_SPELL",  label: "Liv. Inc.",          value: String(this.liv_spell) },
        { sym: "LIV_CASTER", label: "Liv. Inc.tore",      value: String(this.liv_caster), op: "×" },
        { sym: "ACTIV_MODE", label: this.activ_mode.label, value: fmtNum(this.activ_mode.price_base), op: "×" },
        { sym: "BODY_SLOT",  label: this.body_slot.label,  value: `×${fmtFloat(this.body_slot.price_base)}`, op: "×" },
      ];

      if (this.usage_mode === UsageMode.FIFTY_CHARGES) {
        price /= 2;
        tokens.push({ sym: "÷ 2", label: "50 Cariche", value: "÷ 2", op: "" });
      }
      if (this.usage_mode === UsageMode.DAILY_CHARGES) {
        const dc = this.daily_charges || 1;
        price = price / (5 / dc);
        tokens.push({ sym: "÷ (5÷N)", label: `${dc} cariche/giorno`, value: `÷ (5 ÷ ${dc})`, op: "" });
      }
      if (this.usage_mode === UsageMode.CONTINUOUS && this.duration) {
        price *= this.duration.price_base;
        tokens.push({ sym: "DURATION", label: `Durata: ${this.duration.label}`, value: `×${fmtFloat(this.duration.price_base)}`, op: "×" });
      }

      return { price: Math.trunc(price), tokens };
    }

    return { price: 0, tokens: [] };
  }
}

window.MIB_CORE = { ItemType, Duration, BodySlot, UsageMode, ActivMode, BonusType, byValue, MagicItem };
})();
