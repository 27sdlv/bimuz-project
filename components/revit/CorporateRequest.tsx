"use client";

import { useMemo, useState } from "react";
import { LICENSE_API, money, quote, termLabel, type CorporatePricing } from "@/lib/corporate";

type Result = { requestId: number; invoiceUrl?: string | null; total: number };

export default function CorporateRequest({ pricing }: { pricing: CorporatePricing }) {
  const [seats, setSeats] = useState(Math.max(pricing.minSeats, 5));
  const [months, setMonths] = useState(pricing.terms.includes(12) ? 12 : pricing.terms[pricing.terms.length - 1]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const q = useMemo(() => quote(pricing, seats, months), [pricing, seats, months]);
  const next = pricing.discounts
    .filter((d) => d.minSeats > seats)
    .sort((a, b) => a.minSeats - b.minSeats)[0];

  function clampSeats(v: number) {
    if (!Number.isFinite(v)) return pricing.minSeats;
    return Math.min(pricing.maxSeats, Math.max(pricing.minSeats, Math.round(v)));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const body = {
      name: String(f.get("name") || ""),
      inn: String(f.get("inn") || ""),
      contactName: String(f.get("contactName") || ""),
      phone: String(f.get("phone") || ""),
      email: String(f.get("email") || ""),
      comment: String(f.get("comment") || ""),
      website: String(f.get("website") || ""),
      seats,
      months,
    };

    setBusy(true);
    try {
      const res = await fetch(`${LICENSE_API}/api/corporate/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!data?.ok) {
        setError(data?.message || "Ariza yuborilmadi. Birozdan keyin qayta urinib ko'ring.");
        return;
      }
      setResult({ requestId: data.requestId, invoiceUrl: data.invoiceUrl, total: data.quote?.total ?? q.total });
    } catch {
      setError("Server bilan bog'lanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="corp-grid">
      {/* ---- Kalkulyator ---- */}
      <div className="corp-card">
        <div className="corp-card-label">Hisob-kitob</div>

        <div className="form-group">
          <label htmlFor="seats">Xodimlar (o&apos;rinlar) soni</label>
          <div className="corp-seats">
            <button type="button" onClick={() => setSeats((s) => clampSeats(s - 1))} aria-label="Kamaytirish">
              −
            </button>
            <input
              id="seats"
              type="number"
              inputMode="numeric"
              min={pricing.minSeats}
              max={pricing.maxSeats}
              value={seats}
              onChange={(e) => setSeats(clampSeats(Number(e.target.value)))}
            />
            <button type="button" onClick={() => setSeats((s) => clampSeats(s + 1))} aria-label="Ko'paytirish">
              +
            </button>
          </div>
          <input
            type="range"
            className="corp-range"
            min={pricing.minSeats}
            max={Math.min(50, pricing.maxSeats)}
            value={Math.min(seats, 50)}
            onChange={(e) => setSeats(clampSeats(Number(e.target.value)))}
            aria-label="O'rinlar soni"
          />
        </div>

        <div className="form-group">
          <label>Muddat</label>
          <div className="corp-terms">
            {pricing.terms.map((t) => (
              <button
                key={t}
                type="button"
                className={t === months ? "active" : ""}
                onClick={() => setMonths(t)}
              >
                {termLabel(t)}
              </button>
            ))}
          </div>
        </div>

        <dl className="corp-sum">
          <div>
            <dt>1 o&apos;rin, {termLabel(months)}</dt>
            <dd>{money(q.pricePerSeat)} so&apos;m</dd>
          </div>
          <div>
            <dt>
              {seats} o&apos;rin
            </dt>
            <dd>{money(q.subtotal)} so&apos;m</dd>
          </div>
          <div>
            <dt>Chegirma{q.discountPercent > 0 ? ` ${q.discountPercent}%` : ""}</dt>
            <dd>{q.discount > 0 ? `−${money(q.discount)} so'm` : "—"}</dd>
          </div>
          <div className="total">
            <dt>Jami</dt>
            <dd>{money(q.total)} so&apos;m</dd>
          </div>
        </dl>
        <p className="corp-muted">
          Bir xodimga {money(Math.round(q.total / seats / months / 1000) * 1000)} so&apos;m/oy.
          {next ? ` ${next.minSeats} o'rindan boshlab chegirma ${next.percent}%.` : ""}
        </p>
      </div>

      {/* ---- Ariza ---- */}
      <div className="corp-card">
        {result ? (
          <div className="corp-done">
            <div className="corp-card-label">Ariza qabul qilindi</div>
            <h3>№ R{result.requestId}</h3>
            <p>
              Rahmat! Mutaxassisimiz bir ish kuni ichida siz bilan bog&apos;lanadi va shartnomani yuboradi.
            </p>
            {result.invoiceUrl && (
              <p>
                To&apos;lov uchun hisob ({money(result.total)} so&apos;m) tayyor:{" "}
                <a href={result.invoiceUrl} target="_blank" rel="noopener noreferrer">
                  hisobni ochish / chop etish
                </a>
                . To&apos;lov maqsadida <strong>«R{result.requestId}»</strong> raqamini ko&apos;rsating.
              </p>
            )}
            <p className="corp-muted">
              To&apos;lov tushgach, obuna faollashtiriladi va mas&apos;ul xodim e-mailiga kompaniya kabinetiga kirish
              kaliti yuboriladi.
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="corp-card-label">Shartnoma uchun ariza</div>
            <div className="form-group">
              <label htmlFor="name">Tashkilot nomi</label>
              <input id="name" name="name" required maxLength={150} placeholder="«Loyiha» MChJ" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="inn">STIR (INN)</label>
                <input id="inn" name="inn" required inputMode="numeric" pattern="\d{9}" maxLength={9} placeholder="9 ta raqam" />
              </div>
              <div className="form-group">
                <label htmlFor="contactName">Mas&apos;ul shaxs</label>
                <input id="contactName" name="contactName" maxLength={100} placeholder="F.I.Sh." />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input id="phone" name="phone" type="tel" required maxLength={40} placeholder="+998 XX XXX XX XX" />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail (kabinet uchun)</label>
                <input id="email" name="email" type="email" required maxLength={120} placeholder="bim@kompaniya.uz" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Izoh</label>
              <textarea id="comment" name="comment" maxLength={1000} placeholder="Qo'shimcha talablar (ixtiyoriy)" style={{ minHeight: 80 }} />
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="corp-hp" aria-hidden="true" />
            {error && <p className="corp-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
              {busy ? "Yuborilmoqda…" : `Ariza yuborish — ${money(q.total)} so'm`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
