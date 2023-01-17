import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useCallback } from 'react'
import { useFiles } from '@store'
import { EBrowserState } from '@types'
import { getFileModel } from '@utils/files/getFileModel'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { BaseAction, gutter, PlayCircleOutlineIcon } from '@gobletqa/components'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'
import { useBrowserState } from '@hooks/screencast/useBrowserState'


const RunTests = (props:TBrowserActionProps) => {
  
  const repoFiles = useFiles()
  const { browserState } = useBrowserState()

  const onClick = useCallback(async (...args:any[]) => {
    if(!repoFiles.activeFile)
      return console.warn(`Can not run tests, a file must be active in the editor.`)

    const fileModel = getFileModel(repoFiles.activeFile)

    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, repoFiles.activeFile)
    
    clearEditorDecorations(rmRootFromLoc(repoFiles.activeFile))

    await startBrowserPlay(fileModel, `feature`)
  }, [repoFiles.activeFile])

  const noActiveFile = !Boolean(repoFiles.activeFile)
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
      variant={ noActiveFile ? `outlined` : `contained`}
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