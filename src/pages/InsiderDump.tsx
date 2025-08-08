import { useQuery } from '@tanstack/react-query';
import { fetchInsiderTrades } from '../api/stockAPI'; // now coming from stockAPI.ts

type InsiderDumpProps = {
  symbol: string;
};

export default function InsiderDump({ symbol }: InsiderDumpProps) {
  const { data, isLoading, isError, error } = useQuery<unknown[]>({
    queryKey: ['insider-trades', symbol], // 👈 key includes the symbol
    queryFn: () => fetchInsiderTrades(symbol), // 👈 pass symbol to API
    refetchInterval: 60000, // refresh every 60s
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <pre className="text-xs whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-800 p-3 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}