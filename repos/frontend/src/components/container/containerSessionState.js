import React, { useMemo } from 'react'
import { Values } from 'GBConstants'
import { useSelector } from 'GBHooks'
import { Times } from 'GBAssets/icons/times'
import { CheckFilled } from 'GBAssets/icons/checkFilled'
import { ExclamationCircle } from 'GBAssets/icons/exclamationCircle'

import { tapColors } from 'GBTheme/tapColors'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Loading, Text, View } from '@keg-hub/keg-components'
const { CATEGORIES, CONTAINER } = Values


const ReMain = reStyle(View)(theme => ({
  minH: 20,
  d: `flex`,
  flD: `row`,
  alI: `center`,
  jtC: `space-between`,
  // bBW: 1,
  // bBC: tapColors.border,
  mT: theme.margin.size,
  mB: theme.margin.size * -1,
  p: theme.padding.size / 2,
  pT: 0,
  pB: 0,
}))

const ReText = reStyle(Text)(theme => ({
  ftSz: 12,
  ftWt: `bold`,
  pL: theme.padding.size / 4
}))

const ReWrapText = reStyle(View)(theme => ({
  d: `flex`,
  flD: `row`,
  alI: `center`,
}))

const ReLoading = reStyle(Loading)(theme => ({
  pR: theme.padding.size * 1.5,
}))

const usePropsFromContainerState = (containerState) => {
  return useMemo(() => {
    const data = { mStyles: {}, tStyles: {}, content: containerState }
    switch(containerState){
      case CONTAINER.STATE.RUNNING: {
        data.tStyles.c = tapColors?.success
        data.Icon = (<CheckFilled color={tapColors?.success} size="14"  />)
        data.content = `Session Ready`

        break
      }
      case CONTAINER.STATE.CREATING: {
        data.tStyles.c = tapColors?.info
        data.Icon = (<ReLoading color={tapColors?.info} size='small' />)
        data.content = `${containerState} Session`
        break
      }
      case CONTAINER.STATE.ERROR:
      case CONTAINER.STATE.MISSING:
      case CONTAINER.STATE.STOPPED: {
        data.tStyles.c = tapColors?.danger
        data.Icon = (<Times color={tapColors?.danger} size="14" />)
        data.content = `Session ${containerState}`
        break
      }
      default: {
        data.tStyles.c = tapColors?.defaultDark
        data.Icon = (<ExclamationCircle color={tapColors?.defaultDark} size="14" />)
        data.content = `Session Unknown`
      }
    }
    
    return data
  })
}

export const ContainerSessionState = (props) => {
  const { routes } = useSelector(CATEGORIES.ROUTES)
  const {
    Icon,
    content,
    mStyles,
    tStyles,
  } = usePropsFromContainerState(routes?.meta?.state)

  return (
    <ReMain className='container-session-state' style={mStyles} >
      <ReText className="session-state-text" style={tStyles} >
      </ReText>
      <ReWrapText className="session-state-wrap" >
        {Icon}
        <ReText className="session-state-content" style={tStyles} >
          {content}
        </ReText>
      </ReWrapText>
    </ReMain>
  )
  
}