import { http } from './http';

// Generic helper if you want to reuse it elsewhere
async function getJson<T = unknown>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const { data } = await http.get<T>(path, { params });
  return data;
}

// --- Examples you can call from the UI ---

// v1/market/tickers
export function fetchMarketTickers() {
  return getJson<unknown>('/api/v1/market/tickers', { limit: 50 });
}

// v1/market/quotes (real-time)
export function fetchMarketQuotesRealtime() {
  return getJson<unknown>('/api/v1/market/quotes', { symbols: 'AAPL,MSFT,TSLA' });
}

// v1/insider-trades  (what you tested earlier)
export function fetchInsiderTradesDump() {
  return getJson<unknown>('/api/v1/insider-trades', { limit: 100, page: 1 });
}

// You can add more later, e.g. v1/stock/profile, v1/market/news, etc.

export function fetchRealtimeQuoteSingle(
  ticker: string,
  type: 'STOCKS' | 'ETF' | 'MUTUALFUNDS' = 'STOCKS'
) {
  // NOTE the singular path: /api/v1/markets/quote
  return http.get<unknown>('/api/v1/markets/quote', {
    params: { ticker, type },
  }).then(r => r.data);
}