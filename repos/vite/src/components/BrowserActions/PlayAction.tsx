import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { getFileModel } from '@utils/files/getFileModel'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { BaseAction, gutter, PlayCircleOutlineIcon } from '@gobletqa/components'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

const RunTests = (props:TBrowserActionProps) => {
  return (
    <BaseAction
      text='Play'
      as='button'
      loc='bottom'
      variant='outlined'
      onClick={props.onClick}
      Icon={PlayCircleOutlineIcon}
      className='goblet-browser-run-tests'
      disabled={!Boolean(props.activeFile)}
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
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not run tests, a file must be active in the editor.`)

    // Clear out the decorations for the new test run
    clearEditorDecorations(loc)

    const fileModel = getFileModel(loc)

    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, loc)

    await startBrowserPlay(fileModel, `feature`)
  }
}