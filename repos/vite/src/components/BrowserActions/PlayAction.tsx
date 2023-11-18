import type { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { EBrowserState } from '@types'
import { EditorPathChangeEvt } from '@constants'
import { DangerousIcon } from '@gobletqa/components'
import { useCallback, useMemo, useState } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { getFileModel } from '@utils/files/getFileModel'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'
import { useOnEvent, BaseAction, PlayCircleOutlineIcon } from '@gobletqa/components'

import {
  CancelButtonID,
  BrowserStateAttr,
  WSCancelPlayerEvent,
  WSCancelAutomateEvent,
} from '@constants'

export type TEditorPathChange = {
  location: string
}

const onCancelPlayers = () => EE.emit(WSCancelPlayerEvent, {})
const onCancelAutomation = () => EE.emit(WSCancelAutomateEvent, {})

let __localSetLocation:(loc: string) => void
EE.once<TEditorPathChange>(EditorPathChangeEvt, (props) => {
  if(__localSetLocation) return __localSetLocation(props.location)
  setTimeout(() => __localSetLocation(props.location), 1000)
})

export const usePlayAction = (props:TBrowserActionProps) => {

  const { browserState } = useBrowserState()
  const [location, setLocation] = useState<string>(``)
  __localSetLocation = setLocation

  useOnEvent<TEditorPathChange>(EditorPathChangeEvt, ({ location }) => setLocation(location))

  const noActiveFile = !Boolean(location)

  const onClick = useCallback(async (...args:any[]) => {
    if(!location)
      return console.warn(`Can not run tests, a file must be active in the editor.`)

    const fileModel = getFileModel(location)

    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, location)
    
    clearEditorDecorations(location)

    startBrowserPlay(fileModel)
  }, [location])

  const actProps = useMemo<TBaseActionAction>(() => {
    return browserState ===  EBrowserState.idle
    ? {
        as: 'button',
        text: 'Play',
        loc: 'bottom',
        variant: 'text',
        color: 'success',
        onClick: onClick,
        disabled: noActiveFile,
        Icon: PlayCircleOutlineIcon,
        className: 'goblet-browser-run-tests',
        tooltip: 'Play the steps from active file in the browser',
        disabledTooltip: 'DISABLED - Open a test or script to use this action',
      }
    : {
        as: 'button',
        loc: 'bottom',
        color: 'error',
        text: 'Cancel',
        variant: 'text',
        id: CancelButtonID,
        Icon: DangerousIcon,
        [BrowserStateAttr]: browserState,
        tooltip: 'Cancel browser automation',
        className: 'goblet-browser-cancel-recording',
        onClick: browserState === EBrowserState.playing ? onCancelPlayers : onCancelAutomation,
      }
  }, [
    onClick,
    noActiveFile,
    browserState,
  ])

  return {
    actProps
  }

}


export const PlayTest = (props:TBrowserActionProps) => {
  const { actProps } = usePlayAction(props)
  return (<BaseAction {...actProps} />)
}

export const PlayAction:TBrowserAction = {
  Component: PlayTest,
  containerSx: {},
  name: `play-browser-action`,
}