// Korporativ obuna: narx hisobi (litsenziya serveridagi CompanyService.Quote bilan bir xil formula)
// va sayt brauzerdan murojaat qiladigan API manzili.

import { getPluginInfo, type PluginPlan } from "@/lib/plugin";

export const LICENSE_API =
  process.env.NEXT_PUBLIC_BIMUZ_LICENSE_SERVER || "https://license.bimuz.uz";

export type SeatDiscount = { minSeats: number; percent: number };

export type CorporatePricing = {
  monthly: number;
  yearly: number;
  minSeats: number;
  maxSeats: number;
  terms: number[];
  discounts: SeatDiscount[];
  maxDevicesPerSeat: number;
};

export type CorporateQuote = {
  seats: number;
  months: number;
  pricePerSeat: number;
  subtotal: number;
  discountPercent: number;
  discount: number;
  total: number;
};

const FALLBACK_DISCOUNTS: SeatDiscount[] = [
  { minSeats: 5, percent: 10 },
  { minSeats: 10, percent: 15 },
  { minSeats: 20, percent: 20 },
];

type PricingResponse = {
  ok: boolean;
  minSeats?: number;
  maxSeats?: number;
  terms?: number[];
  discounts?: SeatDiscount[];
  maxDevicesPerSeat?: number;
};

/** Sayt qurilayotganda (build) serverdan olinadi; javob bo'lmasa — standart qiymatlar. */
export async function getCorporatePricing(): Promise<CorporatePricing> {
  const info = await getPluginInfo();
  const monthly = info.plans.find((p: PluginPlan) => p.months === 1)?.price ?? 105000;
  const yearly = info.plans.find((p: PluginPlan) => p.months === 12)?.price ?? monthly * 12;

  let live: PricingResponse | null = null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`${LICENSE_API}/api/corporate/pricing`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) live = (await res.json()) as PricingResponse;
  } catch {
    live = null;
  }

  return {
    monthly,
    yearly,
    minSeats: live?.minSeats ?? 2,
    maxSeats: live?.maxSeats ?? 500,
    terms: live?.terms?.length ? live.terms : [3, 6, 12],
    discounts: live?.discounts?.length ? live.discounts : FALLBACK_DISCOUNTS,
    maxDevicesPerSeat: live?.maxDevicesPerSeat ?? info.maxDevices ?? 2,
  };
}

export function discountFor(p: CorporatePricing, seats: number): number {
  return p.discounts.filter((d) => seats >= d.minSeats).reduce((m, d) => Math.max(m, d.percent), 0);
}

export function seatPrice(p: CorporatePricing, months: number): number {
  if (months >= 12 && p.yearly > 0) return p.yearly * Math.floor(months / 12) + p.monthly * (months % 12);
  return p.monthly * months;
}

export function quote(p: CorporatePricing, seats: number, months: number): CorporateQuote {
  const perSeat = seatPrice(p, months);
  const subtotal = perSeat * seats;
  const pct = discountFor(p, seats);
  const total = Math.round((subtotal * (100 - pct)) / 100 / 1000) * 1000;
  return {
    seats,
    months,
    pricePerSeat: perSeat,
    subtotal,
    discountPercent: pct,
    discount: subtotal - total,
    total,
  };
}

export function money(v: number): string {
  return Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function termLabel(months: number): string {
  if (months === 12) return "1 yil";
  if (months % 12 === 0) return `${months / 12} yil`;
  return `${months} oy`;
}
