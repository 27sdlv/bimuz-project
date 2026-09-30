"use client";

import { Fragment, useCallback, useMemo, useState } from "react";

const SERVER = "https://license.bimuz.uz";
const DAY = 86400000;

type Device = { id: string; name: string; lastSeen: string; version: string; lastIp?: string };
type Account = {
  email: string; phone?: string; licenseKey: string; plan: string; paidUntil: string;
  revoked: boolean; trialUsed: boolean; createdAt: string; companyId?: string; devices: Device[];
};
type Order = { id: string; email: string; plan: string; amount: number; provider: string; status: string; createdAt: string; paidAt?: string };
type Feedback = {
  id: number; createdAt: string; kind: string; text: string; contact?: string; tool?: string; email?: string;
  licenseStatus?: string; pluginVersion?: string; revitVersion?: string; deviceName?: string; hasScreenshot: boolean;
};
type Stats = Record<string, any>;
type SecEvent = { at: string; kind: string; ip: string; deviceId?: string; deviceName?: string; email?: string; key?: string; version?: string };
type Security = {
  events: SecEvent[];
  ips: { ip: string; count: number; badKeys: number; admin: number; devices: number; last: string }[];
  trialAbuse: { deviceId: string; deviceName?: string; attempts: number; emails: string[]; last: string }[];
  sharedDevices: { deviceId: string; emails: string[] }[];
};
const KIND: Record<string, string> = {
  "admin:bad_token": "Админ: нотўғри токен", "admin:blocked": "Админ: IP блокланган",
  "activate:not_found": "Мавжуд бўлмаган калит", "refresh:not_found": "Мавжуд бўлмаган калит (refresh)",
  "activate:revoked": "Блокланган калит", "refresh:revoked": "Блокланган калит (refresh)",
  "activate:device_limit": "Қурилма чегараси ошди", "trial:trial_used": "Трайл қайта уриниш",
  "deactivate:removal_limit": "Қурилма алмаштириш чегараси", "refresh:device_removed": "Чиқарилган қурилма",
  "activate:bad_request": "Сохта сўров (ID йўқ)", "refresh:bad_request": "Сохта сўров (ID йўқ)", "trial:bad_request": "Сохта сўров (ID йўқ)",
};

const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString("ru-RU") : "—");
const fmtDT = (s?: string) => (s ? new Date(s).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" }) : "—");
const som = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " сўм";

function statusOf(a: Account) {
  if (a.revoked) return { key: "revoked", label: "Блокланган" };
  const left = new Date(a.paidUntil).getTime() - Date.now();
  if (left <= 0) return { key: "expired", label: a.plan === "trial" ? "Трайл тугаган" : "Муддати тугаган" };
  if (a.plan === "trial") return { key: "trial", label: "Трайл" };
  if (a.plan === "corporate") return { key: "paid", label: "Корпоратив" };
  return { key: "paid", label: a.plan === "yearly" ? "Йиллик" : "Ойлик" };
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"stats" | "users" | "orders" | "feedback" | "security">("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [sec, setSec] = useState<Security | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const call = useCallback(
    async (path: string, body?: unknown) => {
      const res = await fetch(SERVER + path, {
        method: body === undefined ? "GET" : "POST",
        headers: { "X-Admin-Token": token, ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (res.status === 401) throw new Error("Калит нотўғри");
      if (!res.ok) throw new Error("Сервер хатоси: " + res.status);
      return res.json();
    },
    [token]
  );

  const load = useCallback(async () => {
    setBusy(true);
    setErr("");
    try {
      const [s, a, o, f] = await Promise.all([call("/admin/stats"), call("/admin/accounts"), call("/admin/orders"), call("/admin/feedback")]);
      setStats(s);
      setAccounts(a);
      setOrders(o);
      setFeedback(f);
      setAuthed(true);
      try { setSec(await call("/admin/security")); } catch { setSec(null); }
    } catch (e: any) {
      setErr(e.message === "Failed to fetch" ? "Серверга уланиб бўлмади (CORS ёки тармоқ)" : e.message);
    } finally {
      setBusy(false);
    }
  }, [call]);

  const act = async (path: string, body: unknown, text: string) => {
    if (!window.confirm(text)) return;
    setBusy(true);
    try {
      await call(path, body);
      setMsg("Тайёр: " + text);
      await load();
    } catch (e: any) {
      setMsg("Хато: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return accounts
      .map((a) => ({ a, st: statusOf(a), last: a.devices.reduce((m, d) => Math.max(m, new Date(d.lastSeen).getTime()), 0) }))
      .filter(({ a, st }) => {
        if (term && !(a.email + " " + (a.phone || "") + " " + a.licenseKey + " " + a.devices.map((d) => d.id + " " + (d.name || "")).join(" ")).toLowerCase().includes(term)) return false;
        const left = new Date(a.paidUntil).getTime() - Date.now();
        switch (filter) {
          case "trial": return st.key === "trial";
          case "paid": return st.key === "paid";
          case "expired": return st.key === "expired";
          case "expiring": return left > 0 && left < 7 * DAY && a.plan !== "none";
          case "multi": return a.devices.length >= 3;
          case "revoked": return a.revoked;
          default: return true;
        }
      })
      .sort((x, y) => y.last - x.last);
  }, [accounts, q, filter]);

  if (!authed) {
    return (
      <main className="adm" data-no-translate>
        <style>{CSS}</style>
        <form className="adm-login" onSubmit={(e) => { e.preventDefault(); load(); }}>
          <h1>BIMUz Admin</h1>
          <input type="password" autoFocus placeholder="Админ калити" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" />
          <button disabled={busy || token.length < 8}>{busy ? "Текширилмоқда…" : "Кириш"}</button>
          {err && <p className="adm-err">{err}</p>}
          <p className="adm-hint">Калит браузерда сақланмайди — саҳифа янгиланса, қайта киритилади.</p>
        </form>
      </main>
    );
  }

  const S = stats || {};
  const card = (label: string, value: React.ReactNode, sub?: string) => (
    <div className="adm-card"><div className="adm-card-v">{value}</div><div className="adm-card-l">{label}</div>{sub && <div className="adm-card-s">{sub}</div>}</div>
  );

  return (
    <main className="adm" data-no-translate>
      <style>{CSS}</style>
      <header className="adm-head">
        <h1>BIMUz Admin</h1>
        <nav>
          {([["stats", "Умумий"], ["users", `Фойдаланувчилар (${accounts.length})`], ["orders", `Тўловлар (${orders.length})`], ["feedback", `Фидбек (${feedback.length})`], ["security", `Хавфсизлик${sec ? " (" + sec.events.length + ")" : ""}`]] as const).map(([k, l]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>
        <button className="adm-ref" onClick={load} disabled={busy}>{busy ? "…" : "Янгилаш"}</button>
      </header>
      {msg && <div className="adm-msg" onClick={() => setMsg("")}>{msg}</div>}

      {tab === "stats" && (
        <section className="adm-grid">
          {card("Юклаб олиш (бугун)", S.downloadsToday ?? 0, `7 кун: ${S.downloads7d ?? 0} · жами: ${S.downloadsTotal ?? 0}`)}
          {card("Янги трайл (бугун)", S.trialsToday ?? 0, `7 кун: ${S.trials7d ?? 0} · жами: ${S.trialsTotal ?? 0}`)}
          {card("Фаол трайл", S.trialsActive ?? 0, `тугаган: ${S.trialsExpired ?? 0}`)}
          {card("Тўловли фаол", S.paidActive ?? 0, Object.entries(S.paidByPlan || {}).map(([k, v]) => `${k}: ${v}`).join(" · "))}
          {card("Тушум (шу ой)", som(S.revenueMonth ?? 0), `жами: ${som(S.revenueTotal ?? 0)}`)}
          {card("Тўлов (бугун / ой)", `${S.paidOrdersToday ?? 0} / ${S.paidOrdersMonth ?? 0}`)}
          {card("Фаол қурилма (24с)", S.devicesActive24h ?? 0, `7 кун: ${S.devicesActive7d ?? 0} · жами: ${S.devicesTotal ?? 0}`)}
          {card("Жавобсиз фидбек", S.feedbackUnanswered ?? 0, `бугун: ${S.feedbackToday ?? 0} · жами: ${S.feedbackTotal ?? 0}`)}
          <div className="adm-card wide">
            <div className="adm-card-l">Плагин версиялари (7 кун)</div>
            <div className="adm-vers">{Object.entries(S.versions7d || {}).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([v, n]) => <span key={v}>{v}: <b>{n as number}</b></span>)}</div>
          </div>
        </section>
      )}

      {tab === "users" && (
        <section>
          <div className="adm-tools">
            <input placeholder="Қидириш: e-mail, телефон, калит, қурилма ID…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Барчаси</option>
              <option value="trial">Трайл</option>
              <option value="paid">Тўловли</option>
              <option value="expiring">7 кунда тугайди</option>
              <option value="expired">Муддати тугаган</option>
              <option value="multi">3+ қурилма</option>
              <option value="revoked">Блокланган</option>
            </select>
            <span className="adm-count">{rows.length} та</span>
          </div>
          <div className="adm-scroll">
            <table>
              <thead><tr><th>E-mail</th><th>Калит</th><th>Ҳолат</th><th>Тугайди</th><th>Қурилма</th><th>Қурилма номи / ID</th><th>IP</th><th>Охирги кириш</th><th>Версия</th><th>Рўйхатдан ўтган</th></tr></thead>
              <tbody>
                {rows.map(({ a, st, last }) => (
                  <Fragment key={a.email}>
                    <tr onClick={() => setOpen(open === a.email ? null : a.email)} className={"row " + st.key}>
                      <td>{a.email}{a.companyId && <span className="adm-tag">компания</span>}</td>
                      <td className="mono">…{a.licenseKey.slice(-6)}</td>
                      <td><span className={"adm-st " + st.key}>{st.label}</span></td>
                      <td>{a.plan === "none" ? "—" : fmtDate(a.paidUntil)}</td>
                      <td className={a.devices.length >= 3 ? "warn" : ""}>{a.devices.length}</td>
                      <td className="ids">{a.devices.length === 0 ? "—" : a.devices.map((d) => (
                        <div key={d.id} title={d.id}>{d.name || "—"} <span className="mono">{d.id.slice(0, 10)}…</span></div>
                      ))}</td>
                      <td className="mono">{Array.from(new Set(a.devices.map((d) => d.lastIp).filter(Boolean))).join(", ") || "—"}</td>
                      <td>{last ? fmtDT(new Date(last).toISOString()) : "—"}</td>
                      <td>{a.devices.map((d) => d.version).filter(Boolean).sort().slice(-1)[0] || "—"}</td>
                      <td>{fmtDate(a.createdAt)}</td>
                    </tr>
                    {open === a.email && (
                      <tr className="detail"><td colSpan={10}>
                        <div className="adm-det">
                          <div><b>Калит:</b> {a.licenseKey} {a.phone && <>· <b>Тел:</b> {a.phone}</>}</div>
                          <ul>{a.devices.map((d) => <li key={d.id}><b>{d.name || "—"}</b> · ID <span className="mono">{d.id}</span> · {d.version || "?"} · IP <span className="mono">{d.lastIp || "?"}</span> · охирги: {fmtDT(d.lastSeen)}</li>)}{a.devices.length === 0 && <li>Қурилма йўқ</li>}</ul>
                          <div className="adm-act">
                            <button onClick={() => act("/admin/extend", { email: a.email, months: 0, days: 14 }, `${a.email}: +14 кун`)}>+14 кун</button>
                            <button onClick={() => act("/admin/extend", { email: a.email, months: 1, days: 0 }, `${a.email}: +1 ой`)}>+1 ой</button>
                            <button onClick={() => act("/admin/extend", { email: a.email, months: 12, days: 0 }, `${a.email}: +1 йил`)}>+1 йил</button>
                            <button onClick={() => act("/admin/reset-devices", { email: a.email }, `${a.email}: қурилмалар тозаланади`)}>Қурилмаларни тозалаш</button>
                            {a.revoked
                              ? <button onClick={() => act("/admin/unrevoke", { email: a.email }, `${a.email}: блокдан чиқарилади`)}>Блокдан чиқариш</button>
                              : <button className="danger" onClick={() => act("/admin/revoke", { email: a.email }, `${a.email}: БЛОКЛАНАДИ`)}>Блоклаш</button>}
                          </div>
                          <p className="adm-hint">Эслатма: «+кун/ой» тарифни «ойлик/йиллик» қилиб қўяди (трайл ҳам).</p>
                        </div>
                      </td></tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "orders" && (
        <div className="adm-scroll">
          <table>
            <thead><tr><th>№</th><th>E-mail</th><th>Тариф</th><th>Сумма</th><th>Тизим</th><th>Ҳолат</th><th>Яратилган</th><th>Тўланган</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}><td>{o.id}</td><td>{o.email}</td><td>{o.plan}</td><td>{som(o.amount)}</td><td>{o.provider}</td>
                  <td><span className={"adm-st " + (o.status === "paid" ? "paid" : o.status === "pending" ? "trial" : "expired")}>{o.status}</span></td>
                  <td>{fmtDT(o.createdAt)}</td><td>{fmtDT(o.paidAt)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "feedback" && (
        <div className="adm-scroll">
          <table>
            <thead><tr><th>№</th><th>Сана</th><th>Тур</th><th>E-mail</th><th>Ҳолат</th><th>Версия / Revit</th><th>Асбоб</th><th>Матн</th><th>📎</th></tr></thead>
            <tbody>
              {feedback.map((f) => (
                <tr key={f.id}>
                  <td className="mono">F{f.id}</td>
                  <td>{fmtDT(f.createdAt)}</td>
                  <td><span className={"adm-st " + (f.kind === "error" ? "expired" : f.kind === "idea" ? "trial" : "")}>{f.kind}</span></td>
                  <td>{f.email || f.contact || "—"}</td>
                  <td>{f.licenseStatus || "—"}</td>
                  <td>{f.pluginVersion || "?"}{f.revitVersion ? " / R" + f.revitVersion : ""}</td>
                  <td>{f.tool || "—"}</td>
                  <td style={{ maxWidth: 460, whiteSpace: "normal" }}>{f.text}</td>
                  <td>{f.hasScreenshot ? "📎" : ""}</td>
                </tr>
              ))}
              {feedback.length === 0 && <tr><td colSpan={9}>Фидбек йўқ</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {tab === "security" && (
        <section className="adm-sec">
          {!sec && <p className="adm-hint">Хавфсизлик журнали ҳали серверда йўқ (серверни янгиланг).</p>}
          {sec && (
            <>
              <h3>Шубҳали IP манзиллар (7 кун)</h3>
              <div className="adm-scroll"><table>
                <thead><tr><th>IP</th><th>Жами</th><th>Нотўғри калит</th><th>Админ уриниш</th><th>Қурилмалар</th><th>Охирги</th></tr></thead>
                <tbody>{sec.ips.map((x) => (
                  <tr key={x.ip} className={x.badKeys >= 5 || x.admin > 0 ? "row revoked" : ""}><td className="mono">{x.ip}</td><td>{x.count}</td><td>{x.badKeys}</td><td>{x.admin}</td><td>{x.devices}</td><td>{fmtDT(x.last)}</td></tr>
                ))}{sec.ips.length === 0 && <tr><td colSpan={6}>Ҳодиса йўқ</td></tr>}</tbody>
              </table></div>

              <h3>Трайлни қайта олишга уринган қурилмалар</h3>
              <div className="adm-scroll"><table>
                <thead><tr><th>Қурилма</th><th>ID</th><th>Уриниш</th><th>E-mail'лар</th><th>Охирги</th></tr></thead>
                <tbody>{sec.trialAbuse.map((x) => (
                  <tr key={x.deviceId}><td>{x.deviceName || "—"}</td><td className="mono">{x.deviceId}</td><td>{x.attempts}</td><td>{x.emails.join(", ")}</td><td>{fmtDT(x.last)}</td></tr>
                ))}{sec.trialAbuse.length === 0 && <tr><td colSpan={5}>Йўқ</td></tr>}</tbody>
              </table></div>

              <h3>Бир қурилма — бир нечта аккаунт</h3>
              <div className="adm-scroll"><table>
                <thead><tr><th>Қурилма ID</th><th>E-mail'лар</th></tr></thead>
                <tbody>{sec.sharedDevices.map((x) => (
                  <tr key={x.deviceId}><td className="mono">{x.deviceId}</td><td>{x.emails.join(", ")}</td></tr>
                ))}{sec.sharedDevices.length === 0 && <tr><td colSpan={2}>Йўқ</td></tr>}</tbody>
              </table></div>

              <h3>Охирги ҳодисалар</h3>
              <div className="adm-scroll"><table>
                <thead><tr><th>Вақт</th><th>Ҳодиса</th><th>IP</th><th>Қурилма</th><th>E-mail</th><th>Калит</th><th>Версия</th></tr></thead>
                <tbody>{sec.events.map((e, i) => (
                  <tr key={i}><td>{fmtDT(e.at)}</td><td>{KIND[e.kind] || e.kind}</td><td className="mono">{e.ip}</td>
                    <td>{e.deviceName || ""} <span className="mono">{e.deviceId || ""}</span></td><td>{e.email || ""}</td><td className="mono">{e.key || ""}</td><td>{e.version || ""}</td></tr>
                ))}{sec.events.length === 0 && <tr><td colSpan={7}>Ҳодиса йўқ</td></tr>}</tbody>
              </table></div>
              <p className="adm-hint">Ҳодисалар: мавжуд бўлмаган/блокланган калит, қурилма чегараси, трайлни қайта олиш, сохта сўров, админ токен хатолари. Админга 3 ва 8 марта хато токен киритилса, Telegram'га хабар келади.</p>
            </>
          )}
        </section>
      )}
    </main>
  );
}

const CSS = `
.adm .mono{font-family:ui-monospace,Consolas,monospace;font-size:12px;word-break:break-all}
.adm td.ids div{white-space:nowrap}
.adm-sec h3{font-size:15px;margin:18px 0 8px}
.adm{min-height:100vh;background:#0f1720;color:#e6ebf0;font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:16px 20px 40px}
.adm h1{font-size:18px;margin:0}
.adm-login{max-width:340px;margin:18vh auto 0;display:flex;flex-direction:column;gap:12px}
.adm input,.adm select{background:#17212c;border:1px solid #2b3a4a;color:#e6ebf0;padding:9px 11px;border-radius:6px;font:inherit}
.adm button{background:#2b6cb0;color:#fff;border:0;border-radius:6px;padding:8px 13px;font:inherit;cursor:pointer}
.adm button:disabled{opacity:.5;cursor:default}
.adm-err{color:#f28b82;margin:0}.adm-hint{color:#8a9aab;font-size:12px;margin:6px 0 0}
.adm-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:14px}
.adm-head nav{display:flex;gap:6px;flex-wrap:wrap;flex:1}
.adm-head nav button{background:#17212c;color:#b8c5d2}.adm-head nav button.on{background:#2b6cb0;color:#fff}
.adm-ref{background:#243447!important}
.adm-msg{background:#1e3a2a;border:1px solid #2f6b47;padding:8px 12px;border-radius:6px;margin-bottom:12px;cursor:pointer}
.adm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.adm-card{background:#17212c;border:1px solid #243447;border-radius:10px;padding:14px 16px}
.adm-card.wide{grid-column:1/-1}
.adm-card-v{font-size:26px;font-weight:700}.adm-card-l{color:#9fb0c1;margin-top:2px}.adm-card-s{color:#7d8ea0;font-size:12px;margin-top:4px}
.adm-vers{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px}
.adm-tools{display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap}.adm-tools input{flex:1;min-width:220px}.adm-count{color:#8a9aab}
.adm-scroll{overflow-x:auto;border:1px solid #243447;border-radius:10px}
.adm table{width:100%;border-collapse:collapse;min-width:820px}
.adm th{position:sticky;top:0;text-align:left;background:#1a2632;color:#9fb0c1;font-weight:600;padding:9px 10px;white-space:nowrap}
.adm td{padding:8px 10px;border-top:1px solid #1e2b39;white-space:nowrap}
.adm tr.row{cursor:pointer}.adm tr.row:hover{background:#152230}
.adm td.warn{color:#f6c453;font-weight:700}
.adm-st{padding:2px 8px;border-radius:99px;font-size:12px;background:#243447}
.adm-st.paid{background:#1e3a2a;color:#7be0a4}.adm-st.trial{background:#3a3520;color:#f6d97a}.adm-st.expired{background:#3a2424;color:#f2a0a0}.adm-st.revoked{background:#4a1f1f;color:#ff8b8b}
.adm-tag{margin-left:6px;font-size:11px;background:#243447;padding:1px 6px;border-radius:4px;color:#9fb0c1}
.adm tr.detail td{background:#131d28;white-space:normal}
.adm-det ul{margin:6px 0;padding-left:18px;color:#b8c5d2}.adm-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.adm-act button{background:#243447}.adm-act button.danger{background:#8b2b2b}
.adm-fb{display:grid;gap:10px}.adm-fb article{background:#17212c;border:1px solid #243447;border-radius:10px;padding:12px 14px}
.adm-fb-h{color:#cfd9e3}.adm-fb-m{color:#7d8ea0;font-size:12px;margin:2px 0 6px}.adm-fb p{margin:0;white-space:pre-wrap}
`;
