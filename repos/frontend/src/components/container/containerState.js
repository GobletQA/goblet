import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks'
import { Times } from 'HKAssets/icons/times'
import { Check } from 'HKAssets/icons/check'
import { Exclamation } from 'HKAssets/icons/exclamation'

import { tapColors } from 'HKTheme/tapColors'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Loading, Text, View } from '@keg-hub/keg-components'
const { CONTAINER, CATEGORIES, STORAGE } = Values

const ReMain = reStyle(View)(theme => ({
  lt: 0,
  bt: 0,
  zI: 11,
  h: 18,
  w: 125,
  pL: 0,
  d: `flex`,
  bTRR: `5px`,
  jtC: `center`,
  pos: `absolute`,
  bgC: tapColors?.defaultDark,
}))

const ReText = reStyle(Text)(theme => ({
  w: `100%`,
  d: `flex`,
  ftSz: `12px`,
  jtC: `space-evenly`,
  c: tapColors?.accentBackground,
}))

const ReLoading = reStyle(Loading)(theme => ({
  pR: 5
}))

const usePropsFromContainerState = (user, containerState) => {
  return useMemo(() => {
    const data = { styles: {}, content: `Session ${containerState}` }

    switch(containerState){
      case CONTAINER.STATE.RUNNING: {
        data.content = `Session Ready`
        data.styles.bgC = tapColors?.successDark
        data.Icon = (<Check color="#FFFFFF" size="14px" />)
        break
      }
      case CONTAINER.STATE.CREATING: {
        data.styles.bgC = tapColors?.infoDark
        data.Icon = (<ReLoading size='small' />)
        break
      }
      case CONTAINER.STATE.ERROR:
      case CONTAINER.STATE.MISSING:
      case CONTAINER.STATE.STOPPED: {
        data.styles.bgC = tapColors?.dangerDark
        data.Icon = (<Times color="#FFFFFF" size="14px" />)
        break
      }
      default: {
        data.content = `Session Unknown`
        data.styles.bgC = tapColors?.defaultDark
        data.Icon = (<Exclamation color="#FFFFFF" size="14px" />)
      }
    }
    return data

  }, [containerState])
}

export const ContainerState = (props) => {
  const { ...mainProps } = props
  const { user, routes } = useSelector(STORAGE.USER, CATEGORIES.ROUTES)
  const containerState = routes?.meta?.state
  
  const {
    Icon,
    content,
    styles:mainStyle,
  } = usePropsFromContainerState(user, containerState)
  return (
    <ReMain
      className='gb-container-state'
      {...mainProps}
      style={mainStyle}
    >
      <ReText>
        {Icon} {content}
      </ReText>
    </ReMain>
  )
}