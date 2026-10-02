"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Series = {
  days: string[];
  downloads: number[];
  signups: number[];
  devices: number[];
  orders: number[];
  revenue: number[];
  security: number[];
  securitySince?: string | null;
  downloadsSince?: string | null;
};

type MetricKey = keyof Omit<Series, "days" | "securitySince" | "downloadsSince">;

const BLUE = "#3987e5";
const RED = "#e66767";

const METRICS: { key: MetricKey; title: string; color: string; money?: boolean; note?: (s: Series) => string | null }[] = [
  { key: "downloads", title: "Ўрнатувчи юклаб олишлар", color: BLUE, note: (s) => (s.downloadsSince ? "ҳисоб " + ddmm(s.downloadsSince) + " дан" : null) },
  { key: "signups", title: "Янги фойдаланувчилар", color: BLUE },
  { key: "devices", title: "Янги қурилмалар", color: BLUE },
  { key: "orders", title: "Тўловлар", color: BLUE },
  { key: "revenue", title: "Тушум, сўм", color: BLUE, money: true },
  { key: "security", title: "Хавфсизлик ҳодисалари", color: RED, note: (s) => (s.securitySince ? "журнал " + ddmm(s.securitySince) + " дан" : null) },
];

const PRESETS: { label: string; days: number }[] = [
  { label: "7 кун", days: 7 },
  { label: "30 кун", days: 30 },
  { label: "90 кун", days: 90 },
  { label: "180 кун", days: 180 },
];

const nf = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n));

function short(n: number, money: boolean) {
  if (!money) return nf(n);
  if (n >= 1_000_000) return nf(n / 1_000_000) + " млн";
  if (n >= 1_000) return nf(n / 1_000) + " минг";
  return nf(n);
}

function ddmm(key: string) {
  const [y, m, d] = key.split("-");
  return d + "." + m + (y ? "" : "");
}

function fullDate(key: string) {
  const [y, m, d] = key.split("-");
  return d + "." + m + "." + y;
}

/** 0 дан бошланувчи «чиройли» юқори чегара. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  for (const step of [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]) {
    const candidate = step * pow;
    if (candidate >= v) return candidate;
  }
  return 10 * pow;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function SeriesChart({ data }: { data: Series }) {
  const total = data.days.length;
  const [range, setRange] = useState<[number, number]>([Math.max(0, total - 30), total - 1]);
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  // Маълумот янгиланганда ойна чегарадан чиқиб кетмасин.
  useEffect(() => {
    setRange(([a, b]) => {
      const hi = Math.max(0, total - 1);
      const width = Math.max(1, b - a);
      const end = clamp(b, 0, hi);
      return [clamp(end - width, 0, hi), end];
    });
  }, [total]);

  const [i0, i1] = range;
  const count = i1 - i0 + 1;

  const setWindow = useCallback(
    (from: number, to: number) => {
      const hi = Math.max(0, total - 1);
      let a = Math.round(from);
      let b = Math.round(to);
      if (b - a < 2) b = a + 2;             // камида 3 кун кўринсин
      if (a < 0) { b -= a; a = 0; }
      if (b > hi) { a -= b - hi; b = hi; }
      setRange([clamp(a, 0, hi), clamp(b, 0, hi)]);
    },
    [total]
  );

  /** factor < 1 — оралиқ торайиб, тафсилот ортади; > 1 — оралиқ кенгаяди. */
  const zoom = useCallback(
    (factor: number, anchor?: number) => {
      const centre = anchor ?? (i0 + i1) / 2;
      const half = ((i1 - i0) * factor) / 2;
      setWindow(centre - half, centre + half);
    },
    [i0, i1, setWindow]
  );

  const pan = useCallback(
    (fraction: number) => {
      const shift = Math.round(count * fraction);
      setWindow(i0 + shift, i1 + shift);
    },
    [count, i0, i1, setWindow]
  );

  const preset = (days: number) => setWindow(total - days, total - 1);

  const hovered = hover != null && hover >= i0 && hover <= i1 ? hover : null;

  return (
    <div className="sc" onMouseLeave={() => { setHover(null); setCursor(null); }}>
      <div className="sc-top">
        <strong>Динамика</strong>
        <span className="sc-range">
          {fullDate(data.days[i0])} — {fullDate(data.days[i1])} · {count} кун
        </span>
        <div className="sc-btns">
          {PRESETS.map((p) => (
            <button key={p.days} className={count === p.days ? "on" : ""} onClick={() => preset(p.days)} disabled={total < 2}>
              {p.label}
            </button>
          ))}
          <button onClick={() => setWindow(0, total - 1)} className={count === total ? "on" : ""}>Ҳаммаси</button>
          <span className="sc-sep" />
          <button onClick={() => pan(-0.5)} title="Орқага">←</button>
          <button onClick={() => zoom(1 / 0.6)} title="Оралиқни кенгайтириш">−</button>
          <button onClick={() => zoom(0.6)} title="Оралиқни торайтириш (яқинлаштириш)">+</button>
          <button onClick={() => pan(0.5)} title="Олдинга">→</button>
          <span className="sc-sep" />
          <button onClick={() => setShowTable((v) => !v)} className={showTable ? "on" : ""}>Жадвал</button>
        </div>
      </div>

      <p className="sc-help">
        Диаграмма устида: ғилдирак — яқинлаштириш, сичқонча билан тортиш — силжитиш. Пастки йўлакчада керакли оралиқни белгилаб олинг.
      </p>

      <div className="sc-grid">
        {METRICS.map((m) => (
          <Facet
            key={m.key}
            title={m.title}
            color={m.color}
            money={!!m.money}
            note={m.note ? m.note(data) : null}
            days={data.days}
            values={data[m.key] as number[]}
            i0={i0}
            i1={i1}
            hover={hovered}
            onHover={(i, pos) => { setHover(i); setCursor(pos); }}
            onZoom={zoom}
            onPanIndex={(delta) => setWindow(i0 + delta, i1 + delta)}
          />
        ))}
      </div>

      <Brush days={data.days} values={data.downloads} i0={i0} i1={i1} onSelect={setWindow} />

      {hovered != null && cursor && (
        <div className="sc-tip" style={{ left: cursor.x, top: cursor.y }}>
          <b>{fullDate(data.days[hovered])}</b>
          {METRICS.map((m) => (
            <span key={m.key}>
              <i style={{ background: m.color }} />
              {m.title}: <b>{m.money ? nf((data[m.key] as number[])[hovered]) + " сўм" : nf((data[m.key] as number[])[hovered])}</b>
            </span>
          ))}
        </div>
      )}

      {showTable && (
        <div className="adm-scroll sc-table">
          <table>
            <thead>
              <tr>
                <th>Сана</th>
                {METRICS.map((m) => <th key={m.key}>{m.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.days.slice(i0, i1 + 1).map((day, k) => (
                <tr key={day}>
                  <td>{fullDate(day)}</td>
                  {METRICS.map((m) => <td key={m.key}>{nf((data[m.key] as number[])[i0 + k])}</td>)}
                </tr>
              )).reverse()}
            </tbody>
          </table>
        </div>
      )}

      <style>{CSS}</style>
    </div>
  );
}

function Facet({
  title, color, money, note, days, values, i0, i1, hover, onHover, onZoom, onPanIndex,
}: {
  title: string; color: string; money: boolean; note: string | null;
  days: string[]; values: number[]; i0: number; i1: number; hover: number | null;
  onHover: (i: number | null, pos: { x: number; y: number } | null) => void;
  onZoom: (factor: number, anchor?: number) => void;
  onPanIndex: (delta: number) => void;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(420);
  const drag = useRef<{ x: number; i0: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(220, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 132;
  const padL = 46, padR = 10, padT = 14, padB = 20;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = H - padT - padB;

  const slice = values.slice(i0, i1 + 1);
  const n = slice.length;
  const peak = slice.reduce((m, v) => Math.max(m, v), 0);
  const top = niceMax(peak);
  const sum = slice.reduce((a, b) => a + b, 0);

  const x = (k: number) => padL + (n === 1 ? plotW / 2 : (k * plotW) / (n - 1));
  const y = (v: number) => padT + plotH - (v / top) * plotH;

  const bars = n <= 92;
  const slot = plotW / Math.max(1, n);
  const barW = Math.max(1, Math.min(18, slot - 2));

  const indexAt = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return null;
    const px = clientX - r.left - padL;
    const k = Math.round((px / plotW) * (n - 1));
    return i0 + clamp(k, 0, n - 1);
  };

  const ticks = useMemo(() => {
    const want = Math.min(6, n);
    const out: number[] = [];
    for (let t = 0; t < want; t++) out.push(Math.round((t * (n - 1)) / Math.max(1, want - 1)));
    return Array.from(new Set(out));
  }, [n]);

  return (
    <figure className="sc-facet" ref={box}>
      <figcaption>
        <span>{title}</span>
        <b>{money ? nf(sum) + " сўм" : nf(sum)}</b>
        {note && <em>{note}</em>}
      </figcaption>
      <svg
        width={w}
        height={H}
        role="img"
        aria-label={title}
        onWheel={(e) => { e.preventDefault(); const i = indexAt(e.clientX); onZoom(e.deltaY > 0 ? 1 / 0.85 : 0.85, i ?? undefined); }}
        onMouseDown={(e) => { drag.current = { x: e.clientX, i0 }; }}
        onMouseUp={() => { drag.current = null; }}
        onMouseLeave={() => { drag.current = null; onHover(null, null); }}
        onMouseMove={(e) => {
          const d = drag.current;
          if (d) {
            const dx = e.clientX - d.x;
            const steps = Math.round((-dx / plotW) * (n - 1));
            if (steps !== 0) { onPanIndex(steps); drag.current = { x: e.clientX, i0: d.i0 }; }
            return;
          }
          const i = indexAt(e.clientX);
          const r = box.current?.getBoundingClientRect();
          onHover(i, r ? { x: e.clientX - r.left + 14, y: e.clientY - r.top + 14 } : null);
        }}
        style={{ cursor: drag.current ? "grabbing" : "crosshair", display: "block" }}
      >
        {[0, 0.5, 1].map((g) => (
          <g key={g}>
            <line x1={padL} x2={w - padR} y1={y(top * g)} y2={y(top * g)} stroke="#223042" strokeWidth={1} />
            <text x={padL - 6} y={y(top * g) + 4} textAnchor="end" fill="#7d8ea0" fontSize={10}>{short(top * g, money)}</text>
          </g>
        ))}

        {bars
          ? slice.map((v, k) => {
              const h = v <= 0 ? 0 : Math.max(2, plotH - (v / top) * plotH === plotH ? 2 : (v / top) * plotH);
              return v <= 0 ? null : (
                <rect key={k} x={x(k) - barW / 2} y={padT + plotH - h} width={barW} height={h} rx={Math.min(4, barW / 2)} fill={color} opacity={hover == null || hover === i0 + k ? 1 : 0.55} />
              );
            })
          : (
            <>
              <path d={`M${x(0)},${padT + plotH} ` + slice.map((v, k) => `L${x(k)},${y(v)}`).join(" ") + ` L${x(n - 1)},${padT + plotH} Z`} fill={color} opacity={0.16} />
              <path d={slice.map((v, k) => `${k ? "L" : "M"}${x(k)},${y(v)}`).join(" ")} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
            </>
          )}

        {hover != null && hover >= i0 && hover <= i1 && (
          <>
            <line x1={x(hover - i0)} x2={x(hover - i0)} y1={padT} y2={padT + plotH} stroke="#8a9aab" strokeWidth={1} strokeDasharray="3 3" />
            {!bars && <circle cx={x(hover - i0)} cy={y(slice[hover - i0])} r={4} fill={color} stroke="#17212c" strokeWidth={2} />}
          </>
        )}

        <line x1={padL} x2={w - padR} y1={padT + plotH} y2={padT + plotH} stroke="#2b3a4a" strokeWidth={1} />
        {ticks.map((k) => (
          <text key={k} x={x(k)} y={H - 6} textAnchor={k === 0 ? "start" : k === n - 1 ? "end" : "middle"} fill="#7d8ea0" fontSize={10}>
            {ddmm(days[i0 + k])}
          </text>
        ))}
      </svg>
    </figure>
  );
}

/** Пастки йўлакча: бутун даврни кўрсатади, керакли оралиқни белгилаб олиш учун. */
function Brush({ days, values, i0, i1, onSelect }: {
  days: string[]; values: number[]; i0: number; i1: number; onSelect: (a: number, b: number) => void;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(900);
  const [sel, setSel] = useState<{ a: number; b: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 46;
  const n = days.length;
  const peak = values.reduce((m, v) => Math.max(m, v), 0) || 1;
  const x = (k: number) => (n <= 1 ? 0 : (k * w) / (n - 1));
  const at = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return 0;
    return clamp(Math.round(((clientX - r.left) / r.width) * (n - 1)), 0, n - 1);
  };

  const a = sel ? Math.min(sel.a, sel.b) : i0;
  const b = sel ? Math.max(sel.a, sel.b) : i1;

  return (
    <div className="sc-brush" ref={box}>
      <svg
        width={w}
        height={H}
        onMouseDown={(e) => { const k = at(e.clientX); setSel({ a: k, b: k }); }}
        onMouseMove={(e) => { if (sel) setSel({ a: sel.a, b: at(e.clientX) }); }}
        onMouseUp={() => { if (sel) { if (Math.abs(sel.b - sel.a) >= 2) onSelect(Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)); setSel(null); } }}
        onMouseLeave={() => setSel(null)}
        style={{ display: "block", cursor: "ew-resize" }}
      >
        <path
          d={`M0,${H} ` + values.map((v, k) => `L${x(k)},${H - 6 - (v / peak) * (H - 14)}`).join(" ") + ` L${w},${H} Z`}
          fill="#2b3a4a"
        />
        <rect x={x(a)} y={0} width={Math.max(2, x(b) - x(a))} height={H} fill="#3987e5" opacity={0.22} />
        <rect x={x(a)} y={0} width={1.5} height={H} fill="#3987e5" />
        <rect x={x(b)} y={0} width={1.5} height={H} fill="#3987e5" />
      </svg>
      <div className="sc-brush-l">
        <span>{days[0] ? fullDate(days[0]) : ""}</span>
        <span>{days[n - 1] ? fullDate(days[n - 1]) : ""}</span>
      </div>
    </div>
  );
}

const CSS = `
.sc{position:relative;background:#17212c;border:1px solid #243447;border-radius:10px;padding:14px 16px 12px;margin-top:12px}
.sc-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.sc-top strong{font-size:15px}
.sc-range{color:#9fb0c1;font-size:12px}
.sc-btns{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.sc-btns button{background:#243447;color:#b8c5d2;border:0;border-radius:6px;padding:5px 10px;font:inherit;font-size:13px;cursor:pointer}
.sc-btns button.on{background:#2b6cb0;color:#fff}
.sc-sep{width:1px;background:#2b3a4a;margin:2px 4px}
.sc-help{color:#7d8ea0;font-size:12px;margin:8px 0 2px}
.sc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:10px 18px;margin-top:6px}
.sc-facet{margin:0}
.sc-facet figcaption{display:flex;align-items:baseline;gap:8px;color:#9fb0c1;font-size:12px}
.sc-facet figcaption b{color:#e6ebf0;font-size:13px;margin-left:auto}
.sc-facet figcaption em{font-style:normal;color:#64748b;font-size:11px;flex-basis:100%}
.sc-brush{margin-top:10px;border-top:1px solid #243447;padding-top:8px}
.sc-brush-l{display:flex;justify-content:space-between;color:#7d8ea0;font-size:11px;margin-top:2px}
.sc-tip{position:absolute;z-index:5;pointer-events:none;background:#0f1720;border:1px solid #2b3a4a;border-radius:8px;padding:8px 10px;font-size:12px;display:grid;gap:3px;box-shadow:0 8px 24px rgba(0,0,0,.45)}
.sc-tip span{display:flex;align-items:center;gap:6px;color:#9fb0c1;white-space:nowrap}
.sc-tip span b{color:#e6ebf0;margin-left:auto;padding-left:10px}
.sc-tip i{width:8px;height:8px;border-radius:2px;display:inline-block}
.sc-table{margin-top:12px}
`;
