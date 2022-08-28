import { useMemo } from 'react'
import { useSelector } from 'HKHooks'
import { Values } from 'HKConstants'

const { CONTAINER, CATEGORIES } = Values


export const useSessionState = () => {
  const { routes } = useSelector(CATEGORIES.ROUTES)

  return useMemo(() => {
    const session = { state: routes?.meta?.state }
    return Object.entries(CONTAINER.STATE)
      .reduce((acc,[key, value]) => {
        session[key.toLowerCase()] = session.state === value

        return session
      }, session)
  }, [routes])
}