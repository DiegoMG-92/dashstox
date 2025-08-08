import InsiderDump from './InsiderDump'
import { fetchRealtimeQuoteSingle } from '../api/marketAPI' // or inline with your axios `http`

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <InsiderDump
        title="Realtime Quote: AAPL"
        queryKey={['realtime-quote', 'AAPL']}
        queryFn={() => fetchRealtimeQuoteSingle('AAPL', 'STOCKS')}
        refetchIntervalMs={30000}
      />
    </div>
  )
}