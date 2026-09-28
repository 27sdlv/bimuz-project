"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LICENSE_API, money } from "@/lib/corporate";

type Device = { id: string; name?: string; version?: string; lastSeen: string };
type Member = { email: string; licenseKey?: string; devices: Device[] };
type Payment = { at: string; seats: number; months: number; amount: number; contract?: string };
type Company = {
  id: string;
  name: string;
  inn?: string;
  adminEmail: string;
  seats: number;
  used: number;
  paidUntil: string;
  active: boolean;
  daysLeft: number;
  maxDevices: number;
  swapsLeft: number;
  members: Member[];
  payments: Payment[];
};

const TOKEN_KEY = "bimuz-org-token";

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(t: string | null) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* brauzer xotirasi yopiq bo'lsa — sessiya faqat shu sahifada */
  }
}

export default function CompanyCabinet() {
  const [token, setToken] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");

  const call = useCallback(
    async (path: string, body?: unknown, tok?: string | null) => {
      const t = tok ?? token;
      const res = await fetch(`${LICENSE_API}${path}`, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 401 && path !== "/api/org/login") {
        writeToken(null);
        setToken(null);
        setCompany(null);
        throw new Error("Sessiya tugagan. Qayta kiring.");
      }
      if (!data?.ok) throw new Error(data?.message || "Xatolik yuz berdi.");
      return data;
    },
    [token],
  );

  useEffect(() => {
    const t = readToken();
    if (!t) {
      setLoading(false);
      return;
    }
    setToken(t);
    call("/api/org/me", undefined, t)
      .then((d) => setCompany(d.company))
      .catch(() => undefined)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(fn: () => Promise<{ company?: Company }>, ok?: string) {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const d = await fn();
      if (d.company) setCompany(d.company);
      if (ok) setNotice(ok);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Server bilan bog'lanib bo'lmadi.");
    } finally {
      setBusy(false);
    }
  }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await run(async () => {
      const d = await call("/api/org/login", { email: f.get("email"), key: f.get("key") }, null);
      writeToken(d.token);
      setToken(d.token);
      return d;
    });
  }

  async function logout() {
    try {
      await call("/api/org/logout", {});
    } catch {
      /* baribir chiqamiz */
    }
    writeToken(null);
    setToken(null);
    setCompany(null);
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).then(
      () => setNotice("Nusxa olindi: " + text),
      () => setNotice(text),
    );
  }

  if (loading) return <p className="corp-muted">Yuklanmoqda…</p>;

  // ------------------------------------------------------------------ kirish
  if (!company) {
    return (
      <div className="corp-login">
        <span className="section-label light">Korporativ obuna</span>
        <h1 className="section-title light" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          KOMPANIYA KABINETI
        </h1>
        <form onSubmit={login} className="corp-card">
          <div className="form-group">
            <label htmlFor="email">Mas&apos;ul xodim e-maili</label>
            <input id="email" name="email" type="email" required autoComplete="username" placeholder="bim@kompaniya.uz" />
          </div>
          <div className="form-group">
            <label htmlFor="key">Kabinet kaliti</label>
            <input
              id="key"
              name="key"
              required
              autoComplete="current-password"
              placeholder="ORG-XXXX-XXXX-XXXX-XXXX"
              style={{ textTransform: "uppercase", fontFamily: "monospace" }}
            />
          </div>
          {error && <p className="corp-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
            {busy ? "Tekshirilmoqda…" : "Kirish"}
          </button>
          <p className="corp-muted" style={{ marginTop: 16 }}>
            Kalit korporativ obuna faollashganda e-mailga yuboriladi. Yo&apos;qotgan bo&apos;lsangiz —{" "}
            <a href="mailto:info@bimuz.uz">info@bimuz.uz</a>. Obuna yo&apos;qmi?{" "}
            <Link href="/revit/korporativ">Ariza qoldiring</Link>.
          </p>
        </form>
      </div>
    );
  }

  // ------------------------------------------------------------------ kabinet
  const free = company.seats - company.used;

  return (
    <div className="corp-cabinet">
      <div className="corp-head">
        <div>
          <span className="section-label light">Kompaniya {company.id}</span>
          <h1 className="section-title light" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: 8 }}>
            {company.name}
          </h1>
          <p className="corp-muted">
            {company.inn ? `STIR ${company.inn} · ` : ""}
            {company.adminEmail}
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={logout}>
          Chiqish
        </button>
      </div>

      <div className="corp-stats">
        <div className={company.active ? "" : "bad"}>
          <span>Obuna</span>
          <strong>{company.active ? `${company.paidUntil.slice(0, 10)} gacha` : "Faol emas"}</strong>
          <em>{company.active ? `${company.daysLeft} kun qoldi` : "Uzaytirish uchun biz bilan bog'laning"}</em>
        </div>
        <div>
          <span>O&apos;rinlar</span>
          <strong>
            {company.used} / {company.seats}
          </strong>
          <em>{free > 0 ? `${free} ta bo'sh` : "Bo'sh o'rin yo'q"}</em>
        </div>
        <div>
          <span>Kompyuterlar</span>
          <strong>{company.members.reduce((n, m) => n + m.devices.length, 0)}</strong>
          <em>Har bir xodimga {company.maxDevices} tagacha</em>
        </div>
      </div>

      {(error || notice) && <p className={error ? "corp-error" : "corp-notice"}>{error || notice}</p>}

      <form
        className="corp-add"
        onSubmit={(e) => {
          e.preventDefault();
          const email = newEmail.trim();
          if (!email) return;
          run(async () => {
            const d = await call("/api/org/members/add", { email });
            setNewEmail("");
            return d;
          }, `${email} qo'shildi. Litsenziya kaliti quyidagi ro'yxatda (e-mail sozlangan bo'lsa xodimga ham yuborildi).`);
        }}
      >
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="xodim@kompaniya.uz"
          disabled={busy || free <= 0 || !company.active}
          aria-label="Xodim e-maili"
        />
        <button type="submit" className="btn btn-primary" disabled={busy || free <= 0 || !company.active}>
          Xodim qo&apos;shish
        </button>
      </form>

      <div className="corp-table-wrap">
        <table className="corp-table">
          <thead>
            <tr>
              <th>Xodim</th>
              <th>Litsenziya kaliti</th>
              <th>Kompyuterlar</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {company.members.length === 0 && (
              <tr>
                <td colSpan={4} className="corp-muted">
                  Hali xodim qo&apos;shilmagan.
                </td>
              </tr>
            )}
            {company.members.map((m) => (
              <tr key={m.email}>
                <td data-label="Xodim">{m.email}</td>
                <td data-label="Kalit">
                  {m.licenseKey && (
                    <button type="button" className="corp-key" onClick={() => copy(m.licenseKey!)} title="Nusxa olish">
                      {m.licenseKey}
                    </button>
                  )}
                </td>
                <td data-label="Kompyuterlar">
                  {m.devices.length === 0 ? (
                    <span className="corp-muted">Faollashtirilmagan</span>
                  ) : (
                    <ul className="corp-devices">
                      {m.devices.map((d) => (
                        <li key={d.id}>
                          <span>
                            {d.name || d.id.slice(0, 12)}
                            <em>
                              {d.lastSeen}
                              {d.version ? ` · v${d.version}` : ""}
                            </em>
                          </span>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              if (!window.confirm(`«${d.name || d.id}» kompyuterini bo'shatasizmi?`)) return;
                              run(() => call("/api/org/devices/release", { email: m.email, deviceId: d.id }), "Kompyuter bo'shatildi.");
                            }}
                          >
                            Bo&apos;shatish
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="corp-remove"
                    disabled={busy}
                    onClick={() => {
                      if (
                        !window.confirm(
                          `${m.email} ni kompaniyadan chiqarasizmi? Uning kaliti kompaniya obunasi bilan ishlamay qoladi.`,
                        )
                      )
                        return;
                      run(() => call("/api/org/members/remove", { email: m.email }), `${m.email} chiqarildi.`);
                    }}
                  >
                    Chiqarish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="corp-muted" style={{ marginTop: 12 }}>
        30 kun ichida xodim almashtirish imkoniyati: {company.swapsLeft} ta. Xodim kalitni Revit → BIMUz → Litsenziya
        oynasiga kiritadi; o&apos;rnatuvchi:{" "}
        <a href="https://license.bimuz.uz/download">license.bimuz.uz/download</a>.
      </p>

      {company.payments.length > 0 && (
        <>
          <h2 className="corp-subtitle">To&apos;lovlar</h2>
          <div className="corp-table-wrap">
            <table className="corp-table">
              <thead>
                <tr>
                  <th>Sana</th>
                  <th>O&apos;rinlar</th>
                  <th>Muddat</th>
                  <th>Summa</th>
                  <th>Shartnoma</th>
                </tr>
              </thead>
              <tbody>
                {company.payments.map((p, i) => (
                  <tr key={i}>
                    <td data-label="Sana">{p.at}</td>
                    <td data-label="O'rinlar">{p.seats}</td>
                    <td data-label="Muddat">{p.months} oy</td>
                    <td data-label="Summa">{money(p.amount)} so&apos;m</td>
                    <td data-label="Shartnoma">{p.contract || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="corp-muted" style={{ marginTop: 24 }}>
        O&apos;rin qo&apos;shish yoki obunani uzaytirish: <a href="mailto:info@bimuz.uz">info@bimuz.uz</a> yoki{" "}
        <Link href="/revit/korporativ">yangi ariza</Link>.
      </p>
    </div>
  );
}
