import { http } from './http' // your axios instance

export type RealtimeQuote = {
  meta: {
    version: string
    status: number
    copywrite: string
  }
  body: {
    symbol: string
    companyName: string
    stockType: string
    exchange: string
    primaryData: {
      lastSalePrice: string
      netChange: string
      percentageChange: string
      deltaIndicator: string
      lastTradeTimestamp: string
      isRealTime: boolean
      bidPrice: string
      askPrice: string
      bidSize: string
      askSize: string
      volume: string
      currency: string | null
    }
    secondaryData: Record<string, unknown>
    marketStatus: string
    assetClass: string
    keyStats: Record<string, { label: string; value: string }>
  }
}

export async function fetchRealtimeQuoteSingle(
  ticker: string,
  type: 'STOCKS' | 'ETF' | 'MUTUALFUNDS' = 'STOCKS'
): Promise<RealtimeQuote> {
  const { data } = await http.get<RealtimeQuote>(
    '/api/v1/markets/quote',
    { params: { ticker, type } }
  )
  return data
}