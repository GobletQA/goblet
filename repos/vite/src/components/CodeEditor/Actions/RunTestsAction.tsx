import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import { EditorAction } from './EditorAction'
import { runTests } from '@actions/runner/runTests'
import { getFileModel } from '@utils/files/getFileModel'
import { PlayCircleOutlineIcon } from '@components/Icons'


const RunTests = (props:TEditorActionProps) => {
  return (
    <EditorAction
      onClick={props.onClick}
      Icon={PlayCircleOutlineIcon}
      className='goblet-browser-run-tests'
      tooltip='Run a test or script in the browser'
    />
  )
}

export const RunTestsAction:TEditorAction = {
  Component: RunTests,
  name: `run-tests-action`,
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not run tests, no active file.`)

    const fileModel = getFileModel(loc)
    
    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, loc)

    await runTests(fileModel, `feature`)
  }
}