import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks'
import { tapColors } from 'HKTheme/tapColors'
import { View } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { SlowFlash } from 'HKComponents/slowFlash/slowFlash'
const { STORAGE, CONTAINER, CATEGORIES } = Values

const ReMain = reStyle(View)(theme => ({
  h: 1,
  tp: 0,
  zI: 12,
  w: `100vw`,
  bgC: tapColors?.successDark,
}))

const usePropsFromContainerState = (user, containerState) => {
  return useMemo(() => {
    const data = { styles: {} }
    data.flashing =  Boolean(user?.username && containerState !== CONTAINER.STATE.RUNNING)
    switch(containerState){
      case CONTAINER.STATE.RUNNING: {
        data.styles.bgC = tapColors?.successDark
        break
      }
      case CONTAINER.STATE.CREATING: {
        data.styles.bgC = tapColors?.infoDark
        break
      }
      case CONTAINER.STATE.ERROR:
      case CONTAINER.STATE.MISSING:
      case CONTAINER.STATE.STOPPED: {
        data.styles.bgC = tapColors?.dangerDark
        break
      }
      default: {
        data.styles.bgC = tapColors?.defaultDark
      }
    }
    return data
  }, [user, containerState])
}

export const ContainerProgress = (props) => {
  const { user, routes } = useSelector(STORAGE.USER, CATEGORIES.ROUTES)
  const { flashing, styles } = usePropsFromContainerState(user, routes?.meta?.state)

  return (
    <SlowFlash flashing={flashing} >
      <ReMain className='container-progress-main' style={styles} />
    </SlowFlash>
  )
}