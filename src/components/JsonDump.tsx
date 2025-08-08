import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

type Props<TData> = {
  title: string;
  queryKey: UseQueryOptions<TData>['queryKey'];
  queryFn: () => Promise<TData>;
  refetchIntervalMs?: number;
};

export default function JsonDump<TData>({ title, queryKey, queryFn, refetchIntervalMs }: Props<TData>) {
  const { data, isLoading, isError, error } = useQuery<TData>({
    queryKey,
    queryFn,
    refetchInterval: refetchIntervalMs,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <pre className="text-xs whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-800 p-3 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}