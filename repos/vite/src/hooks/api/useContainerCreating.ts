import { useMemo } from 'react'
import { useContainer } from '@store'
import { EContainerState } from '@types'

export const useContainerCreating = () => {
    const container = useContainer()

    return useMemo(() => {
      return !container?.meta?.state
        || container?.meta?.state === EContainerState.Creating
    }, [container?.meta?.state])
}
