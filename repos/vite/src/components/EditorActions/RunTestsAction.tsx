import type { TAction, TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { EditorAction } from './EditorAction'
import { getFileModel } from '@utils/files/getFileModel'
import { PlayCircleOutlineIcon } from '@gobletqa/components'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'


const RunTests = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      onClick={props.onClick}
      Icon={PlayCircleOutlineIcon}
      className='goblet-browser-run-tests'
      disabled={!Boolean(props.activeFile)}
      tooltip={`Run the active file in the browser`}
      disabledTooltip='DISABLED - Open a test or script to use this action'
    />
  )
}

export const RunTestsAction:TSidebarAction = {
  Component: RunTests,
  name: `run-tests-action`,
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not run tests, no active file.`)

    const fileModel = getFileModel(loc)

    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, loc)

    await startBrowserPlay(fileModel, `feature`)
  }
}