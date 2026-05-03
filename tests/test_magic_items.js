import assert from 'node:assert/strict';
import { ItemType, Duration, BodySlot, UsageMode, ActivMode, BonusType } from '../src/magic_items/index.js';
import { MagicItem } from '../src/magic_items/index.js';

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(`  ${e.message}`);
    failed++;
  }
}

function assertThrows(fn) {
  try {
    fn();
    throw new assert.AssertionError({ message: 'Expected error but none thrown' });
  } catch (e) {
    if (e instanceof assert.AssertionError && e.message === 'Expected error but none thrown') throw e;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

test('MAGIC_EFFECT CONTINUOUS: prezzo e descrizioni', () => {
  const item = new MagicItem({
    item_type:  ItemType.MAGIC_EFFECT,
    liv_spell:  3,
    liv_caster: 5,
    usage_mode: UsageMode.CONTINUOUS,
    activ_mode: ActivMode.COMMAND_WORD,
    body_slot:  BodySlot.CORRECT,
    duration:   Duration.TEN_MIN,
  });
  assert.equal(item.price, 40500);
  assert.equal(item.priceFormula, 'LIV_SPELL × LIVE_CASTER × ACTIV_MODE × BODY_SLOT × SPELL_DURATION_BASE');
  assert.equal(item.priceMath, '3 × 5 × 1800 × 1.0 × 1.5');
  assert.equal(item.txtLivSpellAndLivCaster, 'Incantesimo di 3° Livello (LI 5)');
  assert.equal(item.txtUsageMode, 'Effetto Continuo (Durata originale in 10 Minuti)');
});

test('MAGIC_EFFECT CONTINUOUS: richiede duration', () => {
  assertThrows(() => new MagicItem({
    item_type:  ItemType.MAGIC_EFFECT,
    liv_spell:  1,
    liv_caster: 1,
    usage_mode: UsageMode.CONTINUOUS,
    activ_mode: ActivMode.COMMAND_WORD,
    body_slot:  BodySlot.CORRECT,
  }));
});

test('MAGIC_EFFECT DAILY_CHARGES: richiede daily_charges', () => {
  assertThrows(() => new MagicItem({
    item_type:  ItemType.MAGIC_EFFECT,
    liv_spell:  2,
    liv_caster: 3,
    usage_mode: UsageMode.DAILY_CHARGES,
    activ_mode: ActivMode.USE_ACTIVATED,
    body_slot:  BodySlot.UNUSUAL,
  }));
});

for (const bonus of [1, 3, 7]) {
  test(`BONUS_STATS: rifiuta bonus=${bonus}`, () => {
    assertThrows(() => new MagicItem({
      item_type: ItemType.BONUS_STATS,
      bonus,
      body_slot: BodySlot.CORRECT,
    }));
  });
}

test('BONUS_STATS: bonus valido, descrizioni e prezzo', () => {
  const item = new MagicItem({
    item_type:  ItemType.BONUS_STATS,
    bonus:      4,
    body_slot:  BodySlot.UNUSUAL,
  });
  assert.equal(item.txtBonus,    '+4');
  assert.equal(item.txtBodySlot, 'Insolito');
  assert.equal(item.price,       24000);
});

test('SCROLL: rifiuta campo bonus', () => {
  assertThrows(() => new MagicItem({
    item_type:  ItemType.SCROLL,
    liv_spell:  1,
    liv_caster: 3,
    bonus:      5,
  }));
});

test('SCROLL: prezzo e descrizioni', () => {
  const item = new MagicItem({
    item_type:  ItemType.SCROLL,
    liv_spell:  2,
    liv_caster: 7,
  });
  assert.equal(item.price,        350);
  assert.equal(item.priceFormula, 'LIV_SPELL × LIVE_CASTER × PRICE_BASE');
  assert.equal(item.priceMath,    '2 × 7 × 25');
  assert.equal(item.txtBonus,     '');
});

// ─────────────────────────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
