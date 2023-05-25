import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { EBrowserState } from '@types'
import { useCallback, useState } from 'react'
import { EditorPathChangeEvt } from '@constants'
import { getFileModel } from '@utils/files/getFileModel'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'
import { useOnEvent, BaseAction, gutter, PlayCircleOutlineIcon } from '@gobletqa/components'

export type TEditorPathChange = {
  location: string
}

const RunTests = (props:TBrowserActionProps) => {
  const { browserState } = useBrowserState()
  const [location, setLocation] = useState<string>(``)

  const onClick = useCallback(async (...args:any[]) => {
    if(!location)
      return console.warn(`Can not run tests, a file must be active in the editor.`)

    const fileModel = getFileModel(location)

    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, location)
    
    clearEditorDecorations(location)

    await startBrowserPlay(fileModel, `feature`)
  }, [location])

  useOnEvent<TEditorPathChange>(EditorPathChangeEvt, ({ location }) => {
    setLocation(location)
  })

  const noActiveFile = !Boolean(location)
  const disabled = (browserState !== EBrowserState.idle) || noActiveFile

  return !disabled && (
    <BaseAction
      text='Play'
      as='button'
      loc='bottom'
      variant='text'
      color='success'
      onClick={onClick}
      disabled={disabled}
      Icon={PlayCircleOutlineIcon}
      className='goblet-browser-run-tests'
      tooltip='Play the steps from active file in the browser'
      disabledTooltip='DISABLED - Open a test or script to use this action'
    />
  ) || null
}

export const PlayAction:TBrowserAction = {
  Component: RunTests,
  containerSx: {},
  name: `play-browser-action`,
}