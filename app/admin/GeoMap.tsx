"use client";

import { useMemo, useState } from "react";
import { UZ_NAMES, UZ_PATHS, UZ_VIEWBOX, UZ_WATER } from "./uzMap";

export type GeoRow = { code: string; name: string; users: number; devices: number };
export type GeoReport = {
  regions: GeoRow[];
  countries: GeoRow[];
  pending: number;
  unknown: number;
  totalDevices: number;
  since?: string;
};

/** Кетма-кет (sequential) шкала: битта ранг, пастдан юқорига ёрқинлашади. */
const RAMP = ["#2c5f99", "#3576bd", "#3f8ce0", "#63a8ec", "#8fc4f5"];
const EMPTY = "#223042";

const DAYS = [
  { label: "7 кун", v: 7 },
  { label: "30 кун", v: 30 },
  { label: "90 кун", v: 90 },
  { label: "1 йил", v: 365 },
];

const nf = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

/** Маълумотга қараб 5 та оралиқ: кичик сонларда ҳам фарқ кўринсин. */
function buckets(max: number) {
  if (max <= 1) return [1];
  const step = Math.ceil(max / RAMP.length);
  const out: number[] = [];
  for (let i = 1; i <= RAMP.length; i++) out.push(Math.min(max, i * step));
  return Array.from(new Set(out));
}

export default function GeoMap({
  data, days, onDays, busy,
}: {
  data: GeoReport;
  days: number;
  onDays: (d: number) => void;
  busy?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const byCode = useMemo(() => {
    const m: Record<string, GeoRow> = {};
    for (const r of data.regions) m[r.code] = r;
    return m;
  }, [data.regions]);

  const max = useMemo(() => data.regions.reduce((m, r) => Math.max(m, r.users), 0), [data.regions]);
  const edges = useMemo(() => buckets(max), [max]);

  const colorOf = (users: number) => {
    if (!users) return EMPTY;
    for (let i = 0; i < edges.length; i++) if (users <= edges[i]) return RAMP[Math.min(i, RAMP.length - 1)];
    return RAMP[RAMP.length - 1];
  };

  const hovered = hover ? byCode[hover] : null;
  const totalUsers = data.regions.reduce((a, r) => a + r.users, 0);

  return (
    <div className="geo">
      <div className="geo-top">
        <strong>Фойдаланувчилар географияси</strong>
        <span className="geo-sub">вилоят бўйича ноёб фойдаланувчилар · IP орқали аниқланади</span>
        <div className="geo-btns">
          {DAYS.map((d) => (
            <button key={d.v} className={days === d.v ? "on" : ""} onClick={() => onDays(d.v)} disabled={busy}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="geo-body">
        <div className="geo-map" onMouseLeave={() => { setHover(null); setPos(null); }}>
          <svg
            viewBox={UZ_VIEWBOX}
            role="img"
            aria-label="Ўзбекистон вилоятлари картаси"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            {UZ_WATER.map((d, i) => (
              <path key={"w" + i} d={d} fill="#18293d" stroke="#2b3a4a" strokeWidth={1} />
            ))}
            {UZ_PATHS.map((p) => {
              const row = byCode[p.id];
              const on = hover === p.id;
              return (
                <path
                  key={p.key}
                  d={p.d}
                  fill={colorOf(row?.users || 0)}
                  stroke={on ? "#e6ebf0" : "#17212c"}
                  strokeWidth={on ? 2 : 1}
                  onMouseEnter={() => setHover(p.id)}
                  onMouseMove={(e) => {
                    const r = (e.currentTarget.ownerSVGElement?.parentElement as HTMLElement)?.getBoundingClientRect();
                    if (r) setPos({ x: e.clientX - r.left + 14, y: e.clientY - r.top + 14 });
                  }}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </svg>

          {hovered !== undefined && hover && pos && (
            <div className="geo-tip" style={{ left: pos.x, top: pos.y }}>
              <b>{UZ_NAMES[hover] || hover}</b>
              <span>Фойдаланувчи: <b>{nf(hovered?.users || 0)}</b></span>
              <span>Қурилма: <b>{nf(hovered?.devices || 0)}</b></span>
            </div>
          )}

          <div className="geo-legend">
            {edges.map((e, i) => (
              <span key={i}><i style={{ background: RAMP[Math.min(i, RAMP.length - 1)] }} />{i === 0 ? "1" : nf(edges[i - 1] + 1)}{edges[i] > (i === 0 ? 1 : edges[i - 1] + 1) ? "–" + nf(e) : ""}</span>
            ))}
            <span><i style={{ background: EMPTY }} />маълумот йўқ</span>
          </div>
        </div>

        <div className="geo-list">
          <div className="geo-list-h">
            <span>Вилоят</span><span>Фойд.</span><span>Қурилма</span>
          </div>
          {data.regions.map((r) => (
            <div
              key={r.code}
              className={"geo-row" + (hover === r.code ? " on" : "")}
              onMouseEnter={() => setHover(r.code)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="geo-bar" style={{ width: max ? (r.users / max) * 100 + "%" : 0 }} />
              <span className="geo-nm">{UZ_NAMES[r.code] || r.code}</span>
              <span className="geo-n">{nf(r.users)}</span>
              <span className="geo-n">{nf(r.devices)}</span>
            </div>
          ))}
          {data.regions.length === 0 && <p className="adm-hint">Ҳали аниқланган вилоят йўқ.</p>}

          {data.countries.length > 0 && (
            <>
              <div className="geo-list-h geo-mt"><span>Мамлакат</span><span>Фойд.</span><span>Қурилма</span></div>
              {data.countries.slice(0, 8).map((c) => (
                <div key={c.code} className="geo-row">
                  <span className="geo-nm">{c.code}</span>
                  <span className="geo-n">{nf(c.users)}</span>
                  <span className="geo-n">{nf(c.devices)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <p className="adm-hint geo-foot">
        Жами {nf(data.totalDevices)} қурилма · вилоятга тушгани {nf(totalUsers)} фойдаланувчи
        {data.unknown > 0 && <> · вилояти аниқланмагани {nf(data.unknown)}</>}
        {data.pending > 0 && <> · ҳали аниқланмаган IP {nf(data.pending)} (кейинги янгилашда камаяди)</>}
        . Карта: @svg-maps/uzbekistan (CC BY 4.0). IP бўйича аниқлаш тахминий — кўп операторлар манзилини Тошкентда рўйхатдан ўтказади.
      </p>

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
.geo{background:#17212c;border:1px solid #243447;border-radius:10px;padding:14px 16px 10px;margin-top:12px}
.geo-top{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.geo-top strong{font-size:15px}
.geo-sub{color:#7d8ea0;font-size:12px}
.geo-btns{display:flex;gap:6px;margin-left:auto}
.geo-btns button{background:#243447;color:#b8c5d2;border:0;border-radius:6px;padding:5px 10px;font:inherit;font-size:13px;cursor:pointer}
.geo-btns button.on{background:#2b6cb0;color:#fff}
.geo-body{display:grid;grid-template-columns:minmax(320px,1.6fr) minmax(240px,1fr);gap:18px;align-items:start;margin-top:10px}
@media (max-width:900px){.geo-body{grid-template-columns:1fr}}
.geo-map{position:relative}
.geo-legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;color:#9fb0c1;font-size:11px}
.geo-legend i{width:11px;height:11px;border-radius:2px;display:inline-block;margin-right:5px;vertical-align:-1px}
.geo-tip{position:absolute;z-index:5;pointer-events:none;background:#0f1720;border:1px solid #2b3a4a;border-radius:8px;padding:7px 10px;font-size:12px;display:grid;gap:2px;box-shadow:0 8px 24px rgba(0,0,0,.45)}
.geo-tip span{color:#9fb0c1;white-space:nowrap}
.geo-tip span b{color:#e6ebf0}
.geo-list-h,.geo-row{display:grid;grid-template-columns:1fr 54px 64px;align-items:center;gap:6px;padding:5px 8px;border-radius:6px}
.geo-list-h{color:#7d8ea0;font-size:11px;text-transform:uppercase;letter-spacing:.03em}
.geo-list-h span+span,.geo-row span.geo-n{text-align:right}
.geo-mt{margin-top:14px;border-top:1px solid #243447;padding-top:10px}
.geo-row{position:relative;overflow:hidden}
.geo-row.on{background:#1b2938}
.geo-bar{position:absolute;left:0;top:0;bottom:0;background:#2c5f99;opacity:.3;border-radius:6px}
.geo-nm,.geo-n{position:relative}
.geo-n{color:#e6ebf0;font-variant-numeric:tabular-nums}
.geo-foot{margin-top:10px;line-height:1.5}
`;
