import {
  ItemType, Duration, BodySlot, UsageMode, ActivMode, BonusType, byValue
} from './src/magic_items/index.js';
import { MagicItem } from './src/magic_items/index.js';

// ─── DOM helpers ────────────────────────────────────────────────────────────

function makeSelect(id, label, entries) {
  const wrap = document.createElement('div');
  const lbl  = document.createElement('label');
  lbl.textContent = label;
  const sel  = document.createElement('select');
  sel.id = id;
  for (const e of entries) {
    const opt = document.createElement('option');
    opt.value = e.value;
    opt.textContent = e.label;
    sel.appendChild(opt);
  }
  lbl.appendChild(sel);
  wrap.appendChild(lbl);
  return wrap;
}

function makeLockedSelect(id, label, entry) {
  const wrap = makeSelect(id, label, [entry]);
  wrap.querySelector('select').disabled = true;
  return wrap;
}

function makeNumber(id, label, min, max, step, value) {
  const wrap = document.createElement('div');
  const lbl  = document.createElement('label');
  lbl.textContent = label;
  const inp  = document.createElement('input');
  inp.type  = 'number';
  inp.id    = id;
  inp.min   = min;
  if (max != null) inp.max = max;
  inp.step  = step;
  inp.value = value;
  lbl.appendChild(inp);
  wrap.appendChild(lbl);
  return wrap;
}

function makeBonusStatsSelect() {
  const wrap = document.createElement('div');
  const lbl  = document.createElement('label');
  lbl.textContent = 'Bonus';
  const sel  = document.createElement('select');
  sel.id = 'bonus';
  for (const v of [2, 4, 6]) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = `+${v}`;
    sel.appendChild(opt);
  }
  lbl.appendChild(sel);
  wrap.appendChild(lbl);
  return wrap;
}

// ─── Main elements ───────────────────────────────────────────────────────────

const itemTypeEl   = document.getElementById('item_type');
const fieldsEl     = document.getElementById('fields');
const extraFieldsEl= document.getElementById('extra-fields');
const resultEl     = document.getElementById('result');

// Populate item_type select
for (const entry of Object.values(ItemType)) {
  const opt = document.createElement('option');
  opt.value = entry.value;
  opt.textContent = entry.label;
  itemTypeEl.appendChild(opt);
}

// ─── Field rendering ─────────────────────────────────────────────────────────

function renderFields() {
  fieldsEl.innerHTML = '';
  extraFieldsEl.innerHTML = '';
  extraFieldsEl.style.display = 'none';
  resultEl.innerHTML = '';

  const t = byValue(ItemType, itemTypeEl.value);

  if (t === ItemType.MAGIC_ARMOR || t === ItemType.MAGIC_WEAPON) {
    fieldsEl.appendChild(makeNumber('bonus', 'Bonus', 1, 5, 1, 1));
    fieldsEl.appendChild(makeLockedSelect('bonus_type', 'Tipo Bonus', BonusType.ENHANCEMENT));
  }

  else if (t === ItemType.BONUS_STATS) {
    fieldsEl.appendChild(makeBonusStatsSelect());
    fieldsEl.appendChild(makeLockedSelect('bonus_type', 'Tipo Bonus', BonusType.ENHANCEMENT));
    fieldsEl.appendChild(makeSelect('body_slot', 'Slot Corporeo', Object.values(BodySlot)));
  }

  else if (t === ItemType.BONUS_CA) {
    fieldsEl.appendChild(makeNumber('bonus', 'Bonus', 1, 5, 1, 1));
    fieldsEl.appendChild(makeSelect('bonus_type', 'Tipo Bonus',
      [BonusType.CA_DEFLECTION, BonusType.CA_NATURAL, BonusType.CA_OTHERS]));
    fieldsEl.appendChild(makeSelect('body_slot', 'Slot Corporeo', Object.values(BodySlot)));
  }

  else if (t === ItemType.BONUS_TS) {
    fieldsEl.appendChild(makeNumber('bonus', 'Bonus', 1, 5, 1, 1));
    fieldsEl.appendChild(makeSelect('bonus_type', 'Tipo Bonus',
      [BonusType.TS_RESISTENCE, BonusType.TS_OTHERS]));
    fieldsEl.appendChild(makeSelect('body_slot', 'Slot Corporeo', Object.values(BodySlot)));
  }

  else if (t === ItemType.BONUS_SPELL) {
    fieldsEl.appendChild(makeNumber('liv_spell', 'Livello Incantesimo', 1, 9, 1, 1));
  }

  else if (t === ItemType.SCROLL || t === ItemType.POTION || t === ItemType.WAND) {
    fieldsEl.appendChild(makeNumber('liv_spell', 'Livello Incantesimo', 1, 9, 1, 1));
    fieldsEl.appendChild(makeNumber('liv_caster', 'Livello Incantatore', 1, 20, 1, 1));
  }

  else if (t === ItemType.MAGIC_EFFECT) {
    fieldsEl.appendChild(makeNumber('liv_spell', 'Livello Incantesimo', 1, 9, 1, 1));
    fieldsEl.appendChild(makeNumber('liv_caster', 'Livello Incantatore', 1, 20, 1, 1));
    renderMagicEffectExtra();
  }
}

function renderMagicEffectExtra() {
  extraFieldsEl.style.display = 'block';

  const grid  = document.createElement('div');
  grid.className = 'two-col';

  const left  = document.createElement('div');
  left.className = 'col-stack';
  left.appendChild(makeSelect('body_slot', 'Slot Corporeo', Object.values(BodySlot)));
  left.appendChild(makeSelect('activ_mode', "Modalità d'Attivazione", Object.values(ActivMode)));

  const right = document.createElement('div');
  right.className = 'col-stack';
  right.appendChild(makeSelect('usage_mode', "Modalità d'Uso", Object.values(UsageMode)));

  const condDiv = document.createElement('div');
  condDiv.id = 'conditional_field';
  right.appendChild(condDiv);

  grid.appendChild(left);
  grid.appendChild(right);
  extraFieldsEl.appendChild(grid);

  document.getElementById('usage_mode').addEventListener('change', updateConditionalField);
  updateConditionalField();
}

function updateConditionalField() {
  const condDiv = document.getElementById('conditional_field');
  if (!condDiv) return;
  condDiv.innerHTML = '';

  const usageModeEl = document.getElementById('usage_mode');
  if (!usageModeEl) return;
  const um = byValue(UsageMode, usageModeEl.value);

  if (um === UsageMode.DAILY_CHARGES)
    condDiv.appendChild(makeNumber('daily_charges', 'Cariche Giornaliere', 1, null, 1, 1));
  else if (um === UsageMode.CONTINUOUS)
    condDiv.appendChild(makeSelect('duration', 'Durata Incantesimo Originale', Object.values(Duration)));
}

// ─── Field collection ────────────────────────────────────────────────────────

function getNum(id)         { const el = document.getElementById(id); return el ? Number(el.value) : null; }
function getEnum(id, obj)   { const el = document.getElementById(id); return el ? byValue(obj, el.value) : null; }

function collectFields() {
  const t = byValue(ItemType, itemTypeEl.value);
  const f = { item_type: t };

  if (document.getElementById('bonus'))        f.bonus        = getNum('bonus');
  if (document.getElementById('liv_spell'))    f.liv_spell    = getNum('liv_spell');
  if (document.getElementById('liv_caster'))   f.liv_caster   = getNum('liv_caster');
  if (document.getElementById('body_slot'))    f.body_slot    = getEnum('body_slot', BodySlot);
  if (document.getElementById('bonus_type'))   f.bonus_type   = getEnum('bonus_type', BonusType);
  if (document.getElementById('activ_mode'))   f.activ_mode   = getEnum('activ_mode', ActivMode);
  if (document.getElementById('usage_mode')) {
    f.usage_mode = getEnum('usage_mode', UsageMode);
    if (document.getElementById('daily_charges')) f.daily_charges = getNum('daily_charges');
    if (document.getElementById('duration'))      f.duration      = getEnum('duration', Duration);
  }

  return f;
}

// ─── Result rendering ─────────────────────────────────────────────────────────

function showResult(item) {
  const isBonusSpell = item.item_type === ItemType.BONUS_SPELL;
  const txtSpell = isBonusSpell ? item.txtLivSpell : item.txtLivSpellAndLivCaster;

  const details = [
    ['Bonus',        item.txtBonus],
    ['Tipo Bonus',   item.txtBonusType],
    ['Incantesimo',  txtSpell],
    ['Attivazione',  item.txtActivMode],
    ['Utilizzo',     item.txtUsageMode],
    ['Slot Corporeo',item.txtBodySlot],
  ].filter(([, v]) => v);

  const bullets = details.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('');

  resultEl.innerHTML = `
    <div class="card">
      <div class="metric-row">
        <div class="metric">
          <h3>💰 Prezzo</h3>
          <p>${item.price.toLocaleString('it-IT')} MO</p>
        </div>
        <div class="metric">
          <h3>📚 Tipo di Oggetto</h3>
          <p>${item.item_type.label}</p>
        </div>
      </div>
      ${bullets ? `<div class="details-box"><ul>${bullets}</ul></div>` : ''}
      <details>
        <summary>Dettagli del Calcolo</summary>
        <p><strong>Formula:</strong> <code>${item.priceFormula}</code></p>
        <p><strong>Calcoli:</strong> <code>${item.priceMath}</code></p>
      </details>
    </div>
  `;
}

function showError(msg) {
  resultEl.innerHTML = `<div class="card"><div class="error-box">${msg.replace(/\n/g, '<br>')}</div></div>`;
}

// ─── Event wiring ─────────────────────────────────────────────────────────────

itemTypeEl.addEventListener('change', renderFields);

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  try {
    const item = new MagicItem(collectFields());
    showResult(item);
  } catch (err) {
    showError(err.message);
  }
});

renderFields();
