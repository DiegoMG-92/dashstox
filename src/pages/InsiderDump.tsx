import { useQuery } from '@tanstack/react-query'

type JsonDumpProps<T> = {
  title?: string
  queryKey: readonly unknown[]
  queryFn: () => Promise<T>
  refetchIntervalMs?: number
}

export default function InsiderDump<T>({
  title,
  queryKey,
  queryFn,
  refetchIntervalMs,
}: JsonDumpProps<T>) {
  const { data, isLoading, isError, error } = useQuery<T>({
    queryKey,
    queryFn,
    refetchInterval: refetchIntervalMs,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <div>Loading…</div>
  if (isError) return <div>Error: {(error as Error).message}</div>

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
      {title && <h2 className="font-semibold mb-2">{title}</h2>}
      <pre className="text-xs whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}