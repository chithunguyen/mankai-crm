import { useEffect, useState } from 'react'

/** Gọi một hàm async từ `api` và theo dõi trạng thái loading/error. */
export function useData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    let alive = true
    setLoading(true)
    loader()
      .then((d) => alive && setData(d))
      .catch((e: Error) => alive && setError(e))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, deps)

  return { data, loading, error }
}
