import axios from 'axios';

const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;
const HOST = 'yahoo-finance15.p.rapidapi.com';

export const http = axios.create({
  baseURL: `https://${HOST}`,
  headers: {
    'x-rapidapi-key': RAPID_KEY,
    'x-rapidapi-host': HOST,
  },
});

export type InsiderItem = {
  symbol: string;
  symbolName: string;
  fullName: string;
  shortJobTitle: string;
  transactionType: string; // "Buy" | "Sell" | "Award" | ...
  amount: string;
  reportedPrice: string;
  usdValue: string;
  eodHolding: string;
  transactionDate: string; // "MM/DD/YY"
  symbolCode: string; // e.g. "STK", "UIT", "STK:OTC"
  hasOptions: 'Yes' | 'No';
  symbolType: number;
};

export type InsiderMeta = {
  version: string;
  status: number;
  copywrite: string;
  count: number;
  total: number;
  page: number;
};

export type InsiderTradesResponse = {
  meta: InsiderMeta;
  body: InsiderItem[];
};

/**
 * Fetch latest insider trades.
 * NOTE: The endpoint usually does NOT support `symbol`, so we fetch the list
 * and (optionally) filter client-side to avoid 404s.
 */
export async function fetchInsiderTrades(opts?: { limit?: number; symbol?: string }): Promise<InsiderTradesResponse> {
  if (!RAPID_KEY) throw new Error('Missing VITE_RAPIDAPI_KEY');

  const { limit = 100, symbol } = opts ?? {};
  // ✅ correct path
  const { data } = await http.get<InsiderTradesResponse>('/api/v1/markets/insider-trades', {
    params: { limit }, // page also supported if you want pagination
  });

  // Optional client-side filter (safe even if symbol isn’t supported server-side)
  if (symbol) {
    const filtered = data.body.filter((row) => row.symbol?.toUpperCase() === symbol.toUpperCase());
    return { ...data, body: filtered };
  }

  return data;
}