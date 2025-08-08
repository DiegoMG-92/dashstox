import type { LiveQuote } from '../api/stockAPI'

export default function StockWidget({ symbol, data }: { symbol: string; data?: LiveQuote }) {
  if (!data) return <div className="p-4 border rounded">No data for {symbol}</div>
  const up = data.changePercent >= 0
  return (
    <div className="p-4 border rounded shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <h3 className="text-lg font-semibold">
        {data.name} <span className="opacity-70">({data.symbol})</span>
      </h3>
      <p className="text-2xl font-bold mt-1">${data.price.toFixed(2)}</p>
      <p className={up ? 'text-green-600' : 'text-red-600'}>
        {up ? '+' : ''}{data.changePercent.toFixed(2)}%
      </p>
    </div>
  )
}