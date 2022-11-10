import { useMemo, useState } from 'react'
import { useContainer } from '@store'
import { getScreencastUrl } from '@utils/api/getScreencastUrl'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const useScreencastUrl = () => {
  const container = useContainer()
  return useMemo(() => getScreencastUrl(container.screencast), [container.screencast])
}