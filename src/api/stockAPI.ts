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

export type LiveQuote = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
};

// ---- Response shapes we might see from yahoo-finance15 ----
type YahooQuote = {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  price?: number;
  regularMarketChangePercent?: number;
  changePercent?: number;
};

type QuotesEnvelope =
  | { data?: YahooQuote[] }                                  // some endpoints
  | { quoteResponse?: { result?: YahooQuote[] } };           // other endpoints

function isQuotesEnvelope(u: unknown): u is QuotesEnvelope {
  if (typeof u !== 'object' || u === null) return false;
  const obj = u as Record<string, unknown>;
  const hasDataArray =
    Array.isArray((obj.data as unknown[] | undefined)) &&
    ((obj.data as unknown[]).every((x) => typeof x === 'object'));
  const hasQuoteResponse =
    typeof obj.quoteResponse === 'object' &&
    obj.quoteResponse !== null &&
    Array.isArray((obj.quoteResponse as { result?: unknown[] }).result ?? []);
  return hasDataArray || hasQuoteResponse;
}

function normalize(q: YahooQuote): LiveQuote | null {
  const symbol = q.symbol?.trim();
  if (!symbol) return null;

  const price = (q.regularMarketPrice ?? q.price);
  const chgPct = (q.regularMarketChangePercent ?? q.changePercent);

  if (typeof price !== 'number' || Number.isNaN(price)) return null;
  const changePercent = typeof chgPct === 'number' && !Number.isNaN(chgPct) ? chgPct : 0;

  return {
    symbol,
    name: q.shortName ?? q.longName ?? symbol,
    price,
    changePercent,
  };
}

const MAX_PER_REQUEST = 25;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Fetch quotes for many symbols. Silently skips symbols with no data.
 * Returns a map of { [symbol]: LiveQuote }
 */
export async function fetchQuotesBatch(symbols: string[]): Promise<Record<string, LiveQuote>> {
  if (!RAPID_KEY) throw new Error('Missing VITE_RAPIDAPI_KEY');

  const unique = Array.from(new Set(symbols.map(s => s.trim()).filter(Boolean)));
  if (unique.length === 0) return {};

  const chunks = chunk(unique, MAX_PER_REQUEST);

  const maps = await Promise.allSettled(
    chunks.map(async (group) => {
      const { data } = await http.get<unknown>('/api/v1/markets/quotes', {
        params: { tickers: group.join(','), region: 'US' },
      });

      if (!isQuotesEnvelope(data)) return {} as Record<string, LiveQuote>;

      const list: unknown =
        (data as { data?: unknown }).data ??
        (data as { quoteResponse?: { result?: unknown[] } }).quoteResponse?.result ??
        [];

      const map: Record<string, LiveQuote> = {};
      if (Array.isArray(list)) {
        for (const item of list) {
          const q = normalize(item as YahooQuote);
          if (q) map[q.symbol] = q;
        }
      }
      return map;
    })
  );

  const out: Record<string, LiveQuote> = {};
  for (const r of maps) {
    if (r.status === 'fulfilled') Object.assign(out, r.value);
  }
  return out;
}

/**
 * Fetch insider trades for a specific symbol.
 */
export async function fetchInsiderTrades(symbol: string): Promise<unknown[]> {
  if (!RAPID_KEY) throw new Error('Missing VITE_RAPIDAPI_KEY');

  const { data } = await http.get<unknown>('/api/v1/markets/insiders', {
    params: { symbol, limit: 10 },
  });

  // The API’s response shape can vary — keep it flexible for now.
  if (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as { data?: unknown[] }).data)
  ) {
    return (data as { data: unknown[] }).data;
  }

  return [];
}