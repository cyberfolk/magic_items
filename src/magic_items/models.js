import { ItemType, Duration, BodySlot, UsageMode, ActivMode, BonusType } from './enums.js';

function fmtFloat(n) {
  return Number.isInteger(n) ? `${n}.0` : String(n);
}

const SPELL_LEVELS  = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const CASTER_LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

export class MagicItem {
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

    this._validate();
    [this._price, this._formula, this._math] = this._calcPrice();
  }

  get price()        { return this._price; }
  get priceFormula() { return this._formula; }
  get priceMath()    { return this._math; }

  get txtBonus() {
    return this.bonus ? `+${this.bonus}` : '';
  }

  get txtBonusType() {
    return this.bonus_type ? this.bonus_type.label : '';
  }

  get txtLivSpellAndLivCaster() {
    if (this.liv_spell && this.liv_caster)
      return `Incantesimo di ${this.liv_spell}° Livello (LI ${this.liv_caster})`;
    return '';
  }

  get txtLivSpell() {
    return this.liv_spell ? `${this.liv_spell}° Livello` : '';
  }

  get txtActivMode() {
    return this.activ_mode ? this.activ_mode.label : '';
  }

  get txtUsageMode() {
    if (this.usage_mode === UsageMode.FIFTY_CHARGES)
      return '50 cariche';
    if (this.usage_mode === UsageMode.DAILY_CHARGES)
      return `Usi giornalieri ${this.daily_charges}`;
    if (this.usage_mode === UsageMode.CONTINUOUS && this.duration)
      return `Effetto Continuo (Durata originale in ${this.duration.label})`;
    return '';
  }

  get txtBodySlot() {
    return this.body_slot ? this.body_slot.label : '';
  }

  _validate() {
    const t = this.item_type;
    const errors = [];

    const checkIn = (value, allowed, msg) => {
      if (!allowed.includes(value)) errors.push(msg);
    };

    const checkEmpty = (fields) => {
      for (const f of fields) {
        if (this[f] !== null && this[f] !== false && this[f] !== undefined)
          errors.push(`${f} deve essere vuoto`);
      }
    };

    const checkNotEmpty = (fields) => {
      for (const f of fields) {
        if (this[f] === null || this[f] === false || this[f] === undefined)
          errors.push(`${f} deve essere impostato`);
      }
    };

    if (t === ItemType.BONUS_STATS) {
      checkIn(this.bonus, [2, 4, 6], 'Il Bonus può essere solo 2, 4 o 6');
      checkIn(this.bonus_type, [BonusType.ENHANCEMENT], 'Il Tipo Bonus deve essere Potenziamento');
      checkNotEmpty(['body_slot']);
      checkEmpty(['liv_spell', 'liv_caster', 'duration', 'usage_mode', 'activ_mode']);
    }

    if (t === ItemType.BONUS_CA) {
      checkIn(this.bonus, [1, 2, 3, 4, 5], 'Il Bonus deve essere tra 1 e 5');
      checkIn(this.bonus_type, [BonusType.CA_DEFLECTION, BonusType.CA_NATURAL, BonusType.CA_OTHERS],
        'Il Tipo Bonus deve essere Deviazione, Naturale o Altri');
      checkNotEmpty(['body_slot']);
      checkEmpty(['liv_spell', 'liv_caster', 'duration', 'usage_mode', 'activ_mode']);
    }

    if (t === ItemType.BONUS_TS) {
      checkIn(this.bonus, [1, 2, 3, 4, 5], 'Il Bonus deve essere tra 1 e 5');
      checkIn(this.bonus_type, [BonusType.TS_RESISTENCE, BonusType.TS_OTHERS],
        'Il Tipo Bonus deve essere Resistenza o Altri');
      checkNotEmpty(['body_slot']);
      checkEmpty(['liv_spell', 'liv_caster', 'duration', 'usage_mode', 'activ_mode']);
    }

    if (t === ItemType.MAGIC_WEAPON) {
      checkIn(this.bonus, [1, 2, 3, 4, 5], 'Il Bonus deve essere tra 1 e 5');
      checkEmpty(['liv_spell', 'liv_caster', 'duration', 'usage_mode', 'activ_mode', 'body_slot', 'bonus_type']);
    }

    if (t === ItemType.MAGIC_ARMOR) {
      checkIn(this.bonus, [1, 2, 3, 4, 5], 'Il Bonus deve essere tra 1 e 5');
      checkEmpty(['liv_spell', 'liv_caster', 'duration', 'usage_mode', 'activ_mode', 'body_slot', 'bonus_type']);
    }

    if (t === ItemType.BONUS_SPELL) {
      checkIn(this.liv_spell, SPELL_LEVELS, 'Livello Incantesimo deve essere tra 1 e 9');
      checkEmpty(['bonus', 'liv_caster', 'duration', 'usage_mode', 'activ_mode', 'body_slot']);
    }

    if (t === ItemType.SCROLL || t === ItemType.POTION || t === ItemType.WAND) {
      checkIn(this.liv_spell,  SPELL_LEVELS,  'Livello Incantesimo deve essere tra 1 e 9');
      checkIn(this.liv_caster, CASTER_LEVELS, 'Livello Incantatore deve essere tra 1 e 20');
      checkEmpty(['bonus', 'duration', 'usage_mode', 'activ_mode', 'body_slot']);
    }

    if (t === ItemType.MAGIC_EFFECT) {
      checkNotEmpty(['liv_spell', 'liv_caster', 'body_slot', 'usage_mode', 'activ_mode']);
      checkIn(this.liv_spell,  SPELL_LEVELS,  'Livello Incantesimo deve essere tra 1 e 9');
      checkIn(this.liv_caster, CASTER_LEVELS, 'Livello Incantatore deve essere tra 1 e 20');
      checkEmpty(['bonus']);
      if (this.usage_mode === UsageMode.DAILY_CHARGES)
        checkNotEmpty(['daily_charges']);
      else if (this.usage_mode === UsageMode.CONTINUOUS)
        checkNotEmpty(['duration']);
    }

    if (errors.length > 0) throw new Error(errors.join('\n'));
  }

  _calcPrice() {
    const t = this.item_type;

    if (t === ItemType.BONUS_STATS || t === ItemType.BONUS_CA || t === ItemType.BONUS_TS) {
      const btPb    = this.bonus_type.price_base;
      const price   = (this.bonus ** 2) * t.price_base * this.body_slot.price_base * btPb;
      const formula = 'BONUS² × PRICE_BASE × BODY_SLOT × BONUS_TYPE_BASE';
      const math    = `${this.bonus}² × ${t.price_base} × ${fmtFloat(this.body_slot.price_base)} × ${fmtFloat(btPb)}`;
      return [Math.trunc(price), formula, math];
    }

    if (t === ItemType.MAGIC_ARMOR || t === ItemType.MAGIC_WEAPON) {
      const price   = (this.bonus ** 2) * t.price_base;
      const formula = 'BONUS² × PRICE_BASE';
      const math    = `${this.bonus}² × ${t.price_base}`;
      return [Math.trunc(price), formula, math];
    }

    if (t === ItemType.SCROLL || t === ItemType.POTION || t === ItemType.WAND) {
      const price   = this.liv_spell * this.liv_caster * t.price_base;
      const formula = 'LIV_SPELL × LIV_CASTER × PRICE_BASE';
      const math    = `${this.liv_spell} × ${this.liv_caster} × ${t.price_base}`;
      return [Math.trunc(price), formula, math];
    }

    if (t === ItemType.BONUS_SPELL) {
      const price   = (this.liv_spell ** 2) * t.price_base;
      const formula = 'LIV_SPELL² × PRICE_BASE';
      const math    = `${this.liv_spell}² × ${t.price_base}`;
      return [Math.trunc(price), formula, math];
    }

    if (t === ItemType.MAGIC_EFFECT) {
      let price   = this.liv_spell * this.liv_caster * this.activ_mode.price_base * this.body_slot.price_base;
      let formula = 'LIV_SPELL × LIV_CASTER × ACTIV_MODE × BODY_SLOT';
      let math    = `${this.liv_spell} × ${this.liv_caster} × ${this.activ_mode.price_base} × ${fmtFloat(this.body_slot.price_base)}`;

      if (this.usage_mode === UsageMode.FIFTY_CHARGES) {
        price   = price / 2;
        formula = `${formula} ÷ 2`;
        math    = `(${math}) ÷ 2`;
      }
      if (this.usage_mode === UsageMode.DAILY_CHARGES) {
        price   = price / (5 / this.daily_charges);
        formula = `${formula} ÷ (5 ÷ DAILY_CHARGES)`;
        math    = `${math} ÷ (5 ÷ ${this.daily_charges})`;
      }
      if (this.usage_mode === UsageMode.CONTINUOUS) {
        price   = price * this.duration.price_base;
        formula = `${formula} × SPELL_DURATION_BASE`;
        math    = `${math} × ${fmtFloat(this.duration.price_base)}`;
      }

      return [Math.trunc(price), formula, math];
    }
  }
}
