import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { useUser, useRepo } from '@store'
import { ScreencastView } from './ScreencastView'

// import { ScreencastLoading } from './ScreencastLoading'
// <ScreencastLoading start={showBrowser} />
      
export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  const user = useUser()
  const repo = useRepo()
  const showBrowser = useMemo(() => Boolean(user.id && repo.name), [user, repo])

  return (
    <>
      {showBrowser && (<ScreencastView {...props} />)}
    </>
  )
}
