import { http } from './http' // ✅ use your existing axios instance

const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string

export type InsiderItem = {
  symbol: string
  symbolName: string
  fullName: string
  shortJobTitle: string
  transactionType: string // "Buy" | "Sell" | "Award" | ...
  amount: string
  reportedPrice: string
  usdValue: string
  eodHolding: string
  transactionDate: string // "MM/DD/YY"
  symbolCode: string // e.g. "STK", "UIT", "STK:OTC"
  hasOptions: 'Yes' | 'No'
  symbolType: number
}

export type InsiderMeta = {
  version: string
  status: number
  copywrite: string
  count: number
  total: number
  page: number
}

export type InsiderTradesResponse = {
  meta: InsiderMeta
  body: InsiderItem[]
}

/**
 * Fetch latest insider trades.
 * NOTE: Some Yahoo Finance RapidAPI endpoints don’t support filtering by `symbol`.
 * If needed, we filter client-side after fetching.
 */
export async function fetchInsiderTrades(
  opts?: { limit?: number; symbol?: string }
): Promise<InsiderTradesResponse> {
  if (!RAPID_KEY) throw new Error('Missing VITE_RAPIDAPI_KEY')

  const { limit = 100, symbol } = opts ?? {}

  // ✅ correct endpoint path
  const { data } = await http.get<InsiderTradesResponse>(
    '/api/v1/markets/insider-trades',
    { params: { limit } } // API also supports page= for pagination
  )

  // Optional client-side filter if symbol is provided
  if (symbol) {
    const filtered = data.body.filter(
      (row) => row.symbol?.toUpperCase() === symbol.toUpperCase()
    )
    return { ...data, body: filtered }
  }

  return data
}