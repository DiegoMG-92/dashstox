import { useQuery } from '@tanstack/react-query';
import { fetchQuotesBatch, type LiveQuote } from '../api/stockAPI';

export function useQuotes(symbols: string[]) {
  return useQuery<Record<string, LiveQuote>, Error>({
    queryKey: ['quotes', symbols],
    queryFn: () => fetchQuotesBatch(symbols),
    refetchInterval: 30000,
    retry: (count, err) => {
      // back off on 403; be gentle on 429
      const s = (err as unknown as { response?: { status?: number } })?.response?.status;
      if (s === 403) return false;
      if (s === 429) return count < 1;
      return count < 2;
    },
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  });
}