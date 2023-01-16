import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { getFileModel } from '@utils/files/getFileModel'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { BaseAction, PlayCircleOutlineIcon } from '@gobletqa/components'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

const RunTests = (props:TBrowserActionProps) => {
  return (
    <BaseAction
      onClick={props.onClick}
      Icon={PlayCircleOutlineIcon}
      className='goblet-browser-run-tests'
      disabled={!Boolean(props.activeFile)}
      tooltip={`Run the active file in the browser`}
      disabledTooltip='DISABLED - Open a test or script to use this action'
    />
  )
}

export const RunTestsAction:TBrowserAction = {
  Component: RunTests,
  name: `run-tests-action`,
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