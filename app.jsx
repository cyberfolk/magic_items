// Magic Item Builder — UI components (rev. 2)
// Allineato al core in pricing.js: ItemType, BodySlot {Compatibile/Insolito/Nessuno},
// ActivMode {Attivato ad uso 2000 / Parola di Comando 1800}, Duration, BonusType, MagicItem.

const { useState, useMemo, useEffect, useRef } = React;
const C = window.MIB_CORE;
const { ItemType, Duration, BodySlot, UsageMode, ActivMode, BonusType, MagicItem } = C;

// ─── Atomic UI ─────────────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <label className="mib-field">
      <span className="mib-field__label">{label}</span>
      {children}
      {hint && <span className="mib-field__hint">{hint}</span>}
    </label>
  );
}

function Segmented({ value, onChange, options, locked, compact }) {
  return (
    <div className={`mib-seg ${locked ? "mib-seg--locked" : ""} ${compact ? "mib-seg--compact" : ""}`} role="radiogroup">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={locked}
            className={`mib-seg__btn ${isActive ? "is-active" : ""}`}
            onClick={() => !locked && onChange(opt.value)}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function LockedBadge({ label }) {
  return (
    <div className="mib-locked">
      <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
        <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.1" fill="none" />
        <rect x="2" y="5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="mib-select">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="mib-select__chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Stepper({ value, onChange, min = 1, max = 20, suffix }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="mib-stepper">
      <button type="button" onClick={dec} aria-label="Diminuisci" disabled={value <= min}>−</button>
      <div className="mib-stepper__val">
        <span>{value}</span>
        {suffix && <em>{suffix}</em>}
      </div>
      <button type="button" onClick={inc} aria-label="Aumenta" disabled={value >= max}>+</button>
    </div>
  );
}

function NumberInput({ value, onChange, min = 1, max = 999 }) {
  return (
    <input
      type="number"
      className="mib-num"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))} />
  );
}

function ChipPicker({ value, onChange, options, prefix = "+" }) {
  return (
    <div className="mib-chips">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          className={`mib-chip ${value === n ? "is-active" : ""}`}
          onClick={() => onChange(n)}>
          {prefix}{n}
        </button>
      ))}
    </div>
  );
}

// ─── Type catalogue ───────────────────────────────────────────────────────

const ITEM_TYPES_LIST = [
  { v: ItemType.BONUS_STATS,  glyph: "◆", group: "Bonus permanenti" },
  { v: ItemType.MAGIC_ARMOR,  glyph: "▣", group: "Bonus permanenti" },
  { v: ItemType.MAGIC_WEAPON, glyph: "▲", group: "Bonus permanenti" },
  { v: ItemType.BONUS_CA,     glyph: "◇", group: "Bonus permanenti" },
  { v: ItemType.BONUS_TS,     glyph: "◉", group: "Bonus permanenti" },
  { v: ItemType.BONUS_SPELL,  glyph: "✦", group: "Effetti incantesimo" },
  { v: ItemType.SCROLL,       glyph: "⌇", group: "Consumabili", hidden: true },
  { v: ItemType.POTION,       glyph: "◌", group: "Consumabili", hidden: true },
  { v: ItemType.WAND,         glyph: "│", group: "Consumabili", hidden: true },
  { v: ItemType.MAGIC_EFFECT, glyph: "✸", group: "Effetti incantesimo" },
];

const CONSUMABLE_OPTS = [
  { value: ItemType.SCROLL.value, label: "Pergamena" },
  { value: ItemType.POTION.value, label: "Pozione" },
  { value: ItemType.WAND.value,   label: "Bacchetta" },
];

const CONSUMABLE_VALUES = new Set(CONSUMABLE_OPTS.map((o) => o.value));

const SLOT_OPTS     = Object.values(BodySlot).map((s) => ({ value: s.value, label: s.label }));
const DURATION_OPTS = Object.values(Duration).map((d) => ({ value: d.value, label: d.label }));
const ACTIV_OPTS    = Object.values(ActivMode).map((a) => ({ value: a.value, label: a.label }));
const USAGE_OPTS    = Object.values(UsageMode).map((u) => ({ value: u.value, label: u.label }));

const CA_BONUS_OPTS = [
  { value: BonusType.CA_DEFLECTION.value, label: "Deviazione" },
  { value: BonusType.CA_NATURAL.value,    label: "Naturale" },
  { value: BonusType.CA_OTHERS.value,     label: "Altri" },
];

const TS_BONUS_OPTS = [
  { value: BonusType.TS_RESISTENCE.value, label: "Resistenza" },
  { value: BonusType.TS_OTHERS.value,     label: "Altri" },
];

// ─── Type picker (sidebar) ─────────────────────────────────────────────────

function TypePicker({ value, onChange }) {
  const groups = ["Bonus permanenti", "Effetti incantesimo", "Consumabili"];
  const isConsumable = CONSUMABLE_VALUES.has(value);
  const consumableBase = isConsumable
    ? ITEM_TYPES_LIST.find((t) => t.v.value === value).v.price_base
    : ItemType.SCROLL.price_base;
  return (
    <div className="mib-types">
      {groups.map((g) => (
        <div key={g} className="mib-types__group">
          <span className="mib-types__group-label" hidden>{g}</span>
          {ITEM_TYPES_LIST.filter((t) => t.group === g && !t.hidden).map((t) => {
            const active = t.v.value === value;
            return (
              <button
                key={t.v.value}
                type="button"
                className={`mib-type ${active ? "is-active" : ""}`}
                onClick={() => onChange(t.v.value)}
                aria-pressed={active}>
                <span className="mib-type__glyph" aria-hidden="true">{t.glyph}</span>
                <span className="mib-type__label">{t.v.label}</span>
                {active && (
                  <span className="mib-type__base" aria-label={`base ${t.v.price_base} monete d'oro`}>
                    base {fmt(t.v.price_base)}
                  </span>
                )}
              </button>
            );
          })}
          {g === "Consumabili" && (
            <button
              type="button"
              className={`mib-type ${isConsumable ? "is-active" : ""}`}
              onClick={() => onChange(isConsumable ? value : ItemType.SCROLL.value)}
              aria-pressed={isConsumable}>
              <span className="mib-type__glyph" aria-hidden="true">⌇</span>
              <span className="mib-type__label">Consumabile</span>
              {isConsumable && (
                <span className="mib-type__base" aria-label={`base ${consumableBase} monete d'oro`}>
                  base {fmt(consumableBase)}
                </span>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── State & form per type ─────────────────────────────────────────────────

function defaultFor(typeValue) {
  const base = {
    bonus: null, liv_spell: null, liv_caster: null,
    body_slot: null, usage_mode: null, activ_mode: null,
    duration: null, bonus_type: null, daily_charges: null,
  };
  switch (typeValue) {
    case ItemType.BONUS_STATS.value:
      return { ...base, bonus: 2, bonus_type: BonusType.ENHANCEMENT.value, body_slot: BodySlot.CORRECT.value };
    case ItemType.MAGIC_ARMOR.value:
    case ItemType.MAGIC_WEAPON.value:
      return { ...base, bonus: 1 };
    case ItemType.BONUS_CA.value:
      return { ...base, bonus: 1, bonus_type: BonusType.CA_DEFLECTION.value, body_slot: BodySlot.CORRECT.value };
    case ItemType.BONUS_TS.value:
      return { ...base, bonus: 1, bonus_type: BonusType.TS_RESISTENCE.value, body_slot: BodySlot.CORRECT.value };
    case ItemType.BONUS_SPELL.value:
      return { ...base, liv_spell: 1 };
    case ItemType.SCROLL.value:
    case ItemType.WAND.value:
    case ItemType.POTION.value:
      return { ...base, liv_spell: 1, liv_caster: 1 };
    case ItemType.MAGIC_EFFECT.value:
      return {
        ...base,
        liv_spell: 1, liv_caster: 1,
        body_slot: BodySlot.CORRECT.value,
        activ_mode: ActivMode.USE_ACTIVATED.value,
        usage_mode: UsageMode.CONTINUOUS.value,
        duration: Duration.TEN_MIN.value,
      };
    default:
      return base;
  }
}

// ─── Specific forms ───────────────────────────────────────────────────────

function FormStats({ s, set }) {
  return (
    <>
      <Field label="Bonus">
        <ChipPicker value={s.bonus} onChange={(v) => set({ bonus: v })} options={[2, 4, 6]} />
      </Field>
      <Field label="Slot Corporeo">
        <Segmented value={s.body_slot} onChange={(v) => set({ body_slot: v })} options={SLOT_OPTS} />
      </Field>
    </>
  );
}

function FormArmorWeapon({ s, set }) {
  return (
    <Field label="Bonus">
      <ChipPicker value={s.bonus} onChange={(v) => set({ bonus: v })} options={[1, 2, 3, 4, 5]} />
    </Field>
  );
}

function FormCA({ s, set }) {
  return (
    <>
      <Field label="Bonus">
        <ChipPicker value={s.bonus} onChange={(v) => set({ bonus: v })} options={[1, 2, 3, 4, 5]} />
      </Field>
      <Field label="Tipo Bonus">
        <Segmented value={s.bonus_type} onChange={(v) => set({ bonus_type: v })} options={CA_BONUS_OPTS} />
      </Field>
      <Field label="Slot Corporeo">
        <Segmented value={s.body_slot} onChange={(v) => set({ body_slot: v })} options={SLOT_OPTS} />
      </Field>
    </>
  );
}

function FormTS({ s, set }) {
  return (
    <>
      <Field label="Bonus">
        <ChipPicker value={s.bonus} onChange={(v) => set({ bonus: v })} options={[1, 2, 3, 4, 5]} />
      </Field>
      <Field label="Tipo Bonus">
        <Segmented value={s.bonus_type} onChange={(v) => set({ bonus_type: v })} options={TS_BONUS_OPTS} />
      </Field>
      <Field label="Slot Corporeo">
        <Segmented value={s.body_slot} onChange={(v) => set({ body_slot: v })} options={SLOT_OPTS} />
      </Field>
    </>
  );
}

function FormBonusSpell({ s, set }) {
  return (
    <Field label="Livello Incantesimo">
      <Stepper value={s.liv_spell} onChange={(v) => set({ liv_spell: v })} min={1} max={9} suffix="liv" />
    </Field>
  );
}

function FormSPW({ s, set, kind, onKindChange }) {
  return (
    <>
      <Field label="Tipologia">
        <Segmented value={kind} onChange={onKindChange} options={CONSUMABLE_OPTS} />
      </Field>
      <Field label="Livello Incantesimo">
        <Stepper value={s.liv_spell} onChange={(v) => set({ liv_spell: v })} min={1} max={9} suffix="liv" />
      </Field>
      <Field label="Livello Incantatore">
        <Stepper value={s.liv_caster} onChange={(v) => set({ liv_caster: v })} min={1} max={20} suffix="liv" />
      </Field>
    </>
  );
}

function FormMagicEffect({ s, set }) {
  return (
    <>
      <div className="mib-grid2">
        <Field label="Livello Incantesimo">
          <Stepper value={s.liv_spell} onChange={(v) => set({ liv_spell: v })} min={1} max={9} suffix="liv" />
        </Field>
        <Field label="Livello Incantatore">
          <Stepper value={s.liv_caster} onChange={(v) => set({ liv_caster: v })} min={1} max={20} suffix="liv" />
        </Field>
      </div>
      <Field label="Slot Corporeo">
        <Segmented value={s.body_slot} onChange={(v) => set({ body_slot: v })} options={SLOT_OPTS} />
      </Field>
      <Field label="Modalità di Attivazione">
        <Segmented value={s.activ_mode} onChange={(v) => set({ activ_mode: v })} options={ACTIV_OPTS} />
      </Field>
      <Field label="Modalità d'Uso">
        <Segmented value={s.usage_mode} onChange={(v) => set({ usage_mode: v })} options={USAGE_OPTS} />
      </Field>
      {s.usage_mode === UsageMode.DAILY_CHARGES.value && (
        <Field label="Cariche Giornaliere">
          <NumberInput value={s.daily_charges ?? 1} onChange={(v) => set({ daily_charges: v })} min={1} max={20} />
        </Field>
      )}
      {s.usage_mode === UsageMode.CONTINUOUS.value && (
        <Field label="Durata Incantesimo Originale">
          <Segmented value={s.duration} onChange={(v) => set({ duration: v })} options={DURATION_OPTS} />
        </Field>
      )}
    </>
  );
}

// ─── Compute & format ─────────────────────────────────────────────────────

function buildItem(typeValue, s) {
  const it = Object.values(ItemType).find((x) => x.value === typeValue);
  try {
    return new MagicItem({
      item_type:     it,
      bonus:         s.bonus,
      liv_spell:     s.liv_spell,
      liv_caster:    s.liv_caster,
      daily_charges: s.daily_charges,
      body_slot:     s.body_slot  ? Object.values(BodySlot).find((x) => x.value === s.body_slot)     : null,
      usage_mode:    s.usage_mode ? Object.values(UsageMode).find((x) => x.value === s.usage_mode)   : null,
      activ_mode:    s.activ_mode ? Object.values(ActivMode).find((x) => x.value === s.activ_mode)   : null,
      duration:      s.duration   ? Object.values(Duration).find((x) => x.value === s.duration)      : null,
      bonus_type:    s.bonus_type ? Object.values(BonusType).find((x) => x.value === s.bonus_type)   : null,
    });
  } catch (e) {
    return null;
  }
}

function fmt(n) { return Math.round(n).toLocaleString("it-IT"); }

// ─── Price panel ──────────────────────────────────────────────────────────

function useAnimatedNumber(target, dur = 380) {
  const [v, setV] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    const start = ref.current;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const cur = start + (target - start) * eased;
      setV(cur);
      if (k < 1) raf = requestAnimationFrame(tick);
      else ref.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function usePulseTracker(tokens) {
  const prevRef = React.useRef({});
  const [pulses, setPulses] = useState({});
  useEffect(() => {
    const prev = prevRef.current;
    const next = {};
    const changed = {};
    tokens.forEach((tk) => {
      next[tk.sym] = tk.value;
      if (prev[tk.sym] !== undefined && prev[tk.sym] !== tk.value) {
        changed[tk.sym] = Date.now();
      }
    });
    prevRef.current = next;
    if (Object.keys(changed).length > 0) {
      setPulses((p) => ({ ...p, ...changed }));
      const timeouts = Object.keys(changed).map((sym) =>
        setTimeout(() => {
          setPulses((p) => { const { [sym]: _, ...rest } = p; return rest; });
        }, 700)
      );
      return () => timeouts.forEach(clearTimeout);
    }
  }, [tokens.map((t) => `${t.sym}:${t.value}`).join("|")]);
  return pulses;
}

function PricePanel({ item, typeLabel }) {
  const total = item ? item.price : 0;
  const display = useAnimatedNumber(total);
  const tokens = item?.tokens || [];
  const pulses = usePulseTracker(tokens);

  return (
    <aside className="mib-price">
      <div className="mib-price__sigil" aria-hidden="true">
        <svg viewBox="0 0 60 60" width="60" height="60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
          <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
          <path d="M30 8 L30 52 M8 30 L52 30 M14 14 L46 46 M46 14 L14 46" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
          <circle cx="30" cy="30" r="3.2" fill="currentColor" />
        </svg>
      </div>

      <header className="mib-price__head">
        <span className="mib-price__eyebrow">Prezzo finale</span>
        <span className="mib-price__type">{typeLabel}</span>
      </header>

      <div className="mib-price__total">
        <span className="mib-price__num">{fmt(display)}</span>
        <span className="mib-price__unit">mo</span>
      </div>

      <div className="mib-price__rule" />

      <div className="mib-price__breakdown">
        <span className="mib-price__eyebrow">Calcolo</span>
        {tokens.length > 0 ? (
          <div className="mib-eq">
            {(() => {
              const baseIdx = tokens.findIndex((t) => t.sym === "PRICE_BASE");
              const ordered = baseIdx > 0
                ? [{ ...tokens[baseIdx], op: undefined }, { ...tokens[0], op: "×" }, ...tokens.slice(1, baseIdx), ...tokens.slice(baseIdx + 1)]
                : tokens;
              return ordered.map((tk, i) => {
                const pulsing = pulses[tk.sym];
                return (
                  <React.Fragment key={tk.sym + i}>
                    {tk.op && <span className="mib-eq__op">{tk.op}</span>}
                    <div className={`mib-eq__chip ${pulsing ? "is-pulse" : ""}`}>
                      <span className="mib-eq__val">{tk.value}</span>
                      <span className="mib-eq__lbl">{tk.label}</span>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>
        ) : (
          <p className="mib-price__empty">Compila i campi per vedere la formula.</p>
        )}
      </div>
    </aside>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────

function App() {
  const [typeValue, setTypeValue] = useState(ItemType.BONUS_STATS.value);
  const [state, setState] = useState(() => defaultFor(ItemType.BONUS_STATS.value));
  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const item = useMemo(() => buildItem(typeValue, state), [typeValue, state]);
  const typeMeta = ITEM_TYPES_LIST.find((t) => t.v.value === typeValue);
  const typeLabel = typeMeta?.v.label || "—";

  let form = null;
  switch (typeValue) {
    case ItemType.BONUS_STATS.value:
      form = <FormStats s={state} set={set} />;
      break;
    case ItemType.MAGIC_ARMOR.value:
    case ItemType.MAGIC_WEAPON.value:
      form = <FormArmorWeapon s={state} set={set} />;
      break;
    case ItemType.BONUS_CA.value:
      form = <FormCA s={state} set={set} />;
      break;
    case ItemType.BONUS_TS.value:
      form = <FormTS s={state} set={set} />;
      break;
    case ItemType.BONUS_SPELL.value:
      form = <FormBonusSpell s={state} set={set} />;
      break;
    case ItemType.SCROLL.value:
    case ItemType.POTION.value:
    case ItemType.WAND.value:
      form = (
        <FormSPW
          s={state}
          set={set}
          kind={typeValue}
          onKindChange={(v) => {
            setTypeValue(v);
            setState((p) => ({ ...defaultFor(v), liv_spell: p.liv_spell ?? 1, liv_caster: p.liv_caster ?? 1 }));
          }}
        />
      );
      break;
    case ItemType.MAGIC_EFFECT.value:
      form = <FormMagicEffect s={state} set={set} />;
      break;
  }

  return (
    <div className="mib-root">
      <header className="mib-topbar">
        <div className="mib-brand">
          <span className="mib-brand__mark" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
              <path d="M14 3 L17 11 L25 12 L19 18 L21 26 L14 22 L7 26 L9 18 L3 12 L11 11 Z"
                fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="mib-brand__text">
            <span className="mib-brand__name">Magic Item Builder</span>
            <span className="mib-brand__sub">Calcolatore prezzi · D&amp;D 3.5</span>
          </div>
        </div>
        <div className="mib-topbar__meta">
          <span className="mib-pill mib-pill--ghost">Live preview</span>
          <span className="mib-pill">v2.0</span>
        </div>
      </header>

      <main className="mib-main">
        <section className="mib-col mib-col--types" aria-label="Tipo di oggetto">
          <h2 className="mib-eyebrow">01 · Tipo di oggetto</h2>
          <TypePicker
            value={typeValue}
            onChange={(v) => { setTypeValue(v); setState(defaultFor(v)); }}
          />
        </section>

        <section className="mib-col mib-col--form" aria-label="Parametri">
          <h2 className="mib-eyebrow">02 · Parametri</h2>
          <div className="mib-formcard">
            <header className="mib-formcard__head">
              <span className="mib-formcard__glyph" aria-hidden="true">{typeMeta?.glyph}</span>
              <div className="mib-formcard__titles">
                <span className="mib-formcard__title">{typeLabel}</span>
                <span className="mib-formcard__sub">{typeMeta?.group}</span>
              </div>
            </header>
            <div className="mib-formcard__body">{form}</div>
          </div>
        </section>

        <section className="mib-col mib-col--price" aria-label="Risultato">
          <h2 className="mib-eyebrow">03 · Risultato</h2>
          <PricePanel item={item} typeLabel={typeLabel} />
        </section>
      </main>

      <footer className="mib-footer">
        <span>Formule basate sul SRD 3.5 / Open Game License. Nessun submit: il prezzo si aggiorna in tempo reale.</span>
      </footer>
    </div>
  );
}

window.MIB_App = App;
