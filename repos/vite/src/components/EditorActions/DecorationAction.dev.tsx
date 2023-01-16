import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { get, deepMerge } from '@keg-hub/jsutils'
import { playEvent } from '@actions/socket/local/playEvent'
import { BaseAction, TrashIcon } from '@gobletqa/components'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'
import { passTest, failTest } from './testEventData'

const type = `fail`
const testTypes = {
  parr: passTest,
  fail: failTest
}

const buildSteps = () => (testTypes[type].cycle)
let currentSteps = buildSteps()

const getStep = () => {
  let step = currentSteps.shift()
  if(!step){
    currentSteps = buildSteps()
    return
  }

  return get(testTypes[type], step)
}

const DecorationComp = (props:TSidebarActionProps) => {
  return (
    <BaseAction
      Icon={TrashIcon}
      onClick={props.onClick}
      className='goblet-decoration-action'
      tooltip='Clear test results from the editor'
    />
  )
}

export const DecorationActionDev:TSidebarAction = {
  Component: DecorationComp,
  name: `decoration-editor-action-dev`,
  onClick: async (event, editor, loc, content) => {
    const eventData = getStep()

    eventData
      ? playEvent(deepMerge(eventData))
      : clearEditorDecorations(loc)
  }
}