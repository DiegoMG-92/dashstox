import JsonDump from '../components/JsonDump';
import {

  fetchRealtimeQuoteSingle,   // ⬅️ add this
} from '../api/marketAPI';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      
      <JsonDump
        title="Realtime Quote: AAPL (raw JSON)"
        queryKey={['realtime-quote-single', { ticker: 'AAPL', type: 'STOCKS' }]}
        queryFn={() => fetchRealtimeQuoteSingle('AAPL', 'STOCKS')}
        refetchIntervalMs={30000}
      />

    </div>
  );
}