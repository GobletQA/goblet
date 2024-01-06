import type { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { EBrowserState } from '@types'
import { EE } from '@services/sharedService'
import { DangerousIcon } from '@gobletqa/components'
import { useCallback, useMemo, useState } from 'react'
import { getFileModel } from '@utils/files/getFileModel'
import { EditorPathChangeEvt } from '@constants'
import { getActiveFileMeta } from '@utils/files/getActiveFileMeta'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'
import {
  useOnEvent,
  BaseAction,
  PlayCircleOutlineIcon
} from '@gobletqa/components'

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

const callSetLocation = (props:TEditorPathChange, times=0) => {
  if(__localSetLocation) return __localSetLocation(props.location)
  times === 0 && setTimeout(() => callSetLocation(props, 1), 1000)
}

EE.once<TEditorPathChange>(EditorPathChangeEvt, (props) => callSetLocation(props, 0))

export const usePlayAction = (props:TBrowserActionProps) => {

  const { browserState } = useBrowserState()
  const [location, setLocation] = useState<string>(``)
  __localSetLocation = setLocation

  useOnEvent<TEditorPathChange>(EditorPathChangeEvt, ({ location }) => setLocation(location))

  const noActiveFile = !Boolean(location)

  const onClick = useCallback(async (...args:any[]) => {
    const activeFile = await getActiveFileMeta()
    if(!activeFile?.location)
      return console.warn(`Can not run tests, a file must be active in the editor.`)

    const {
      ast,
      content,
      location,
    } = activeFile

    let model = activeFile?.model || getFileModel(location)
    if(!model) return console.warn(`Can not run tests, file model could not be loaded for ${location}.`)

    /**
     * Ensure we have the most up-to-date Content and AST from the editor
     * It could be that the file was changed, but not saved
     * Which means the model content may not be up-to-date with what's displayed in the editor
     */
    if(ast) model = {...model, ast}
    if(content) model = {...model, content}

    clearEditorDecorations(location)
    startBrowserPlay(model)
  }, [])

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