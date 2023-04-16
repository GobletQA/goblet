import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { EBrowserState } from '@types'
import { useCallback, useState } from 'react'
import { EditorPathChangeEvt } from '@constants'
import { getFileModel } from '@utils/files/getFileModel'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
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
    
    clearEditorDecorations(rmRootFromLoc(location))

    await startBrowserPlay(fileModel, `feature`)
  }, [location])

  useOnEvent<TEditorPathChange>(EditorPathChangeEvt, ({ location }) => setLocation(location))

  const noActiveFile = !Boolean(location)
  const disabled = (browserState !== EBrowserState.idle) || noActiveFile

  return (
    <BaseAction
      text='Play'
      as='button'
      loc='bottom'
      color='success'
      onClick={onClick}
      disabled={disabled}
      Icon={PlayCircleOutlineIcon}
      className='goblet-browser-run-tests'
      variant={ noActiveFile ? `text` : `contained`}
      tooltip='Play the steps from active file in the browser'
      disabledTooltip='DISABLED - Open a test or script to use this action'
    />
  )
}

export const PlayAction:TBrowserAction = {
  Component: RunTests,
  containerSx: {
    marginLeft: gutter.margin.hpx,
  },
  name: `play-browser-action`,
}