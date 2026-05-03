import { ItemType, Duration, BodySlot, UsageMode, ActivMode, BonusType } from '../src/magic_items/index.js';
import { MagicItem } from '../src/magic_items/index.js';

let passed = 0, failed = 0;

function check(label, actual, expected) {
  if (actual === expected) {
    console.log(`  OK  ${label}: ${actual}`);
    passed++;
  } else {
    console.error(`  ERR ${label}: got ${actual}, expected ${expected}`);
    failed++;
  }
}

// ── SEZ 1: Bonus di Caratteristica — Bonus² × 1.000 × body_slot × bonus_type
console.log('\n[SEZ 1] Bonus di Caratteristica');
check('bonus=2 slot=CORRECT', new MagicItem({ item_type: ItemType.BONUS_STATS, bonus: 2, body_slot: BodySlot.CORRECT, bonus_type: BonusType.ENHANCEMENT }).price, 2**2 * 1000 * 1.0 * 1.0);
check('bonus=4 slot=UNUSUAL', new MagicItem({ item_type: ItemType.BONUS_STATS, bonus: 4, body_slot: BodySlot.UNUSUAL, bonus_type: BonusType.ENHANCEMENT }).price, 4**2 * 1000 * 1.5 * 1.0);
check('bonus=6 slot=NO',      new MagicItem({ item_type: ItemType.BONUS_STATS, bonus: 6, body_slot: BodySlot.NO,     bonus_type: BonusType.ENHANCEMENT }).price, 6**2 * 1000 * 2.0 * 1.0);

// ── SEZ 1: Armatura Magica — Bonus² × 1.000
console.log('\n[SEZ 1] Armatura Magica');
check('bonus=1', new MagicItem({ item_type: ItemType.MAGIC_ARMOR, bonus: 1 }).price, 1**2 * 1000);
check('bonus=3', new MagicItem({ item_type: ItemType.MAGIC_ARMOR, bonus: 3 }).price, 3**2 * 1000);
check('bonus=5', new MagicItem({ item_type: ItemType.MAGIC_ARMOR, bonus: 5 }).price, 5**2 * 1000);

// ── SEZ 1: Arma Magica — Bonus² × 2.000
console.log('\n[SEZ 1] Arma Magica');
check('bonus=1', new MagicItem({ item_type: ItemType.MAGIC_WEAPON, bonus: 1 }).price, 1**2 * 2000);
check('bonus=3', new MagicItem({ item_type: ItemType.MAGIC_WEAPON, bonus: 3 }).price, 3**2 * 2000);
check('bonus=5', new MagicItem({ item_type: ItemType.MAGIC_WEAPON, bonus: 5 }).price, 5**2 * 2000);

// ── SEZ 1: Incantesimo Bonus — LivInc² × 1.000
console.log('\n[SEZ 1] Incantesimo Bonus');
check('liv_spell=1', new MagicItem({ item_type: ItemType.BONUS_SPELL, liv_spell: 1 }).price, 1**2 * 1000);
check('liv_spell=5', new MagicItem({ item_type: ItemType.BONUS_SPELL, liv_spell: 5 }).price, 5**2 * 1000);
check('liv_spell=9', new MagicItem({ item_type: ItemType.BONUS_SPELL, liv_spell: 9 }).price, 9**2 * 1000);

// ── SEZ 1: Bonus CA — Bonus² × 1.000 × body_slot × bonus_type
console.log('\n[SEZ 1] Bonus CA');
check('CA_DEFLECTION b=2 slot=CORRECT', new MagicItem({ item_type: ItemType.BONUS_CA, bonus: 2, body_slot: BodySlot.CORRECT, bonus_type: BonusType.CA_DEFLECTION }).price, 2**2 * 1000 * 1.0 * 2.0);
check('CA_NATURAL    b=2 slot=CORRECT', new MagicItem({ item_type: ItemType.BONUS_CA, bonus: 2, body_slot: BodySlot.CORRECT, bonus_type: BonusType.CA_NATURAL    }).price, 2**2 * 1000 * 1.0 * 2.0);
check('CA_OTHERS     b=2 slot=CORRECT', new MagicItem({ item_type: ItemType.BONUS_CA, bonus: 2, body_slot: BodySlot.CORRECT, bonus_type: BonusType.CA_OTHERS     }).price, 2**2 * 1000 * 1.0 * 2.5);
check('CA_DEFLECTION b=3 slot=UNUSUAL', new MagicItem({ item_type: ItemType.BONUS_CA, bonus: 3, body_slot: BodySlot.UNUSUAL, bonus_type: BonusType.CA_DEFLECTION }).price, Math.trunc(3**2 * 1000 * 1.5 * 2.0));

// ── SEZ 1: Bonus TS — Bonus² × 1.000 × body_slot × bonus_type
console.log('\n[SEZ 1] Bonus TS');
check('TS_RESISTENCE b=2 slot=CORRECT', new MagicItem({ item_type: ItemType.BONUS_TS, bonus: 2, body_slot: BodySlot.CORRECT, bonus_type: BonusType.TS_RESISTENCE }).price, 2**2 * 1000 * 1.0 * 1.0);
check('TS_OTHERS     b=2 slot=CORRECT', new MagicItem({ item_type: ItemType.BONUS_TS, bonus: 2, body_slot: BodySlot.CORRECT, bonus_type: BonusType.TS_OTHERS     }).price, 2**2 * 1000 * 1.0 * 2.0);
check('TS_RESISTENCE b=4 slot=UNUSUAL', new MagicItem({ item_type: ItemType.BONUS_TS, bonus: 4, body_slot: BodySlot.UNUSUAL, bonus_type: BonusType.TS_RESISTENCE }).price, Math.trunc(4**2 * 1000 * 1.5 * 1.0));

// ── SEZ 2: Pergamena — LivInc × LivInc.tore × 25
console.log('\n[SEZ 2] Pergamena');
check('1x1',   new MagicItem({ item_type: ItemType.SCROLL, liv_spell: 1, liv_caster: 1  }).price, 1 * 1  * 25);
check('3x5',   new MagicItem({ item_type: ItemType.SCROLL, liv_spell: 3, liv_caster: 5  }).price, 3 * 5  * 25);
check('9x17',  new MagicItem({ item_type: ItemType.SCROLL, liv_spell: 9, liv_caster: 17 }).price, 9 * 17 * 25);

// ── SEZ 2: Pozione — LivInc × LivInc.tore × 50
console.log('\n[SEZ 2] Pozione');
check('1x1', new MagicItem({ item_type: ItemType.POTION, liv_spell: 1, liv_caster: 1 }).price, 1 * 1 * 50);
check('3x5', new MagicItem({ item_type: ItemType.POTION, liv_spell: 3, liv_caster: 5 }).price, 3 * 5 * 50);

// ── SEZ 2: Bacchetta — LivInc × LivInc.tore × 750
console.log('\n[SEZ 2] Bacchetta');
check('1x1', new MagicItem({ item_type: ItemType.WAND, liv_spell: 1, liv_caster: 1 }).price, 1 * 1 * 750);
check('3x5', new MagicItem({ item_type: ItemType.WAND, liv_spell: 3, liv_caster: 5 }).price, 3 * 5 * 750);

// ── SEZ 2: MAGIC_EFFECT base attivazione × 2000 / × 1800 (FIFTY_CHARGES = /2)
console.log('\n[SEZ 2] MAGIC_EFFECT (FIFTY_CHARGES = base /2)');
const meBase = { item_type: ItemType.MAGIC_EFFECT, liv_spell: 3, liv_caster: 5, body_slot: BodySlot.CORRECT, usage_mode: UsageMode.FIFTY_CHARGES };
check('USE_ACTIVATED /2', new MagicItem({ ...meBase, activ_mode: ActivMode.USE_ACTIVATED }).price, Math.trunc(3 * 5 * 2000 * 1.0 / 2));
check('COMMAND_WORD  /2', new MagicItem({ ...meBase, activ_mode: ActivMode.COMMAND_WORD  }).price, Math.trunc(3 * 5 * 1800 * 1.0 / 2));

// ── SEZ 2 nota: Duration modifiers (CONTINUOUS USE_ACTIVATED slot=CORRECT)
console.log('\n[SEZ 2 nota] Modificatori durata');
const meCont = { item_type: ItemType.MAGIC_EFFECT, liv_spell: 2, liv_caster: 5, body_slot: BodySlot.CORRECT, usage_mode: UsageMode.CONTINUOUS, activ_mode: ActivMode.USE_ACTIVATED };
check('ROUND   x4.0', new MagicItem({ ...meCont, duration: Duration.ROUND   }).price, Math.trunc(2 * 5 * 2000 * 1.0 * 4.0));
check('ONE_MIN x2.0', new MagicItem({ ...meCont, duration: Duration.ONE_MIN }).price, Math.trunc(2 * 5 * 2000 * 1.0 * 2.0));
check('TEN_MIN x1.5', new MagicItem({ ...meCont, duration: Duration.TEN_MIN }).price, Math.trunc(2 * 5 * 2000 * 1.0 * 1.5));
check('DAY     /2',   new MagicItem({ ...meCont, duration: Duration.DAY     }).price, Math.trunc(2 * 5 * 2000 * 1.0 * 0.5));

// ── SEZ 3: BodySlot modifiers
console.log('\n[SEZ 3] Slot corporeo (BONUS_CA CA_DEFLECTION bonus=3)');
const bsBase = { item_type: ItemType.BONUS_CA, bonus: 3, bonus_type: BonusType.CA_DEFLECTION };
check('CORRECT x1.0', new MagicItem({ ...bsBase, body_slot: BodySlot.CORRECT }).price, Math.trunc(3**2 * 1000 * 1.0 * 2.0));
check('UNUSUAL x1.5', new MagicItem({ ...bsBase, body_slot: BodySlot.UNUSUAL }).price, Math.trunc(3**2 * 1000 * 1.5 * 2.0));
check('NO      x2.0', new MagicItem({ ...bsBase, body_slot: BodySlot.NO      }).price, Math.trunc(3**2 * 1000 * 2.0 * 2.0));

// ── SEZ 3: Cariche giornaliere — /(5/n)
console.log('\n[SEZ 3] Cariche giornaliere');
const dcBase = { item_type: ItemType.MAGIC_EFFECT, liv_spell: 3, liv_caster: 5, body_slot: BodySlot.CORRECT, usage_mode: UsageMode.DAILY_CHARGES, activ_mode: ActivMode.COMMAND_WORD };
check('3/giorno /(5/3)', new MagicItem({ ...dcBase, daily_charges: 3 }).price, Math.trunc(3 * 5 * 1800 * 1.0 / (5/3)));
check('1/giorno /(5/1)', new MagicItem({ ...dcBase, daily_charges: 1 }).price, Math.trunc(3 * 5 * 1800 * 1.0 / (5/1)));
check('5/giorno /(5/5)', new MagicItem({ ...dcBase, daily_charges: 5 }).price, Math.trunc(3 * 5 * 1800 * 1.0 / (5/5)));

console.log('\n' + '-'.repeat(50));
console.log(passed + ' passed, ' + failed + ' failed');
if (failed > 0) process.exit(1);
