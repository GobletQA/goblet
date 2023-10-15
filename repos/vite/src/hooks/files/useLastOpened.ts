import { useMemo } from 'react'
import { useRepo } from '@store'
import { localStorage } from '@services/localStorage'

export const useLastOpened = (files:Record<string, any>) => {
  const repo = useRepo()
  const lastOpened = useMemo(() => localStorage.getLastOpenedSync(), [repo.name])

  return useMemo(() => {
    return !lastOpened?.length
      ? lastOpened
      : lastOpened.filter(loc => Boolean(loc in files))
  }, [lastOpened, files])
}
