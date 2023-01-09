import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { get, deepMerge } from '@keg-hub/jsutils'
import { EditorAction } from './EditorAction'
import { ClearAllIcon } from '@gobletqa/components'
import { playEvent } from '@actions/socket/local/playEvent'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

const eventData = {
  feature: {
    start: {
      "id": "27dca400-132d-43c2-b4b3-6f2133106f07",
      "message": "Player - Suite Start",
      "error": false,
      "data": {
        "id": "suite-0",
        "action": "start",
        "testPath": "/suite-0",
        "fullName": "Feature > Form Missing Input",
        "type": "describe",
        "failedExpectations": [],
        "passedExpectations": [],
        "failed": false,
        "passed": false,
        "description": "Feature > Form Missing Input",
        "timestamp": 1673234159603
      },
      "group": "XdH0ZLT9QSWRz_9JAAAF",
      "name": "PLAY-SUITE-START",
      "isRunning": false,
      "timestamp": 1673234159603,
      "isPlaying": true,
      "location": "/goblet/repos/lancetipton/goblet/bdd/features/missing-input.feature",
      "fileType": "feature",
      "socketId": "XdH0ZLT9QSWRz_9JAAAF",
      "groupId": "goblet"
    },
    end: {
        "id": "75e8f085-a2dd-4c6c-a92f-2a331e7b83f6",
        "message": "Player - Suite Done",
        "error": false,
        "data": {
          "id": "suite-0",
          "action": "end",
          "testPath": "/suite-0",
          "fullName": "Feature > Form Missing Input",
          "type": "describe",
          "failedExpectations": [],
          "passedExpectations": [],
          "failed": false,
          "passed": true,
          "description": "Feature > Form Missing Input",
          "timestamp": 1673234159603,
          "describes": [],
          "tests": []
        },
        "group": "XdH0ZLT9QSWRz_9JAAAF",
        "name": "PLAY-SUITE-DONE",
        "isRunning": false,
        "timestamp": 1673234162281,
        "isPlaying": true,
        "location": "/goblet/repos/lancetipton/goblet/bdd/features/missing-input.feature",
        "fileType": "feature",
        "socketId": "XdH0ZLT9QSWRz_9JAAAF",
        "groupId": "goblet"
    },
  },
  scenario: {
    start: {
      "id": "5d31a634-634f-4fea-b9dd-fd4c84830660",
      "message": "Player - Suite Start",
      "error": false,
      "data": {
        "id": "suite-0-0",
        "action": "start",
        "testPath": "/suite-0-0",
        "fullName": "Scenario > Missing all inputs in request demo form",
        "type": "describe",
        "failedExpectations": [],
        "passedExpectations": [],
        "failed": false,
        "passed": false,
        "description": "Scenario > Missing all inputs in request demo form",
        "timestamp": 1673234159604
      },
      "group": "XdH0ZLT9QSWRz_9JAAAF",
      "name": "PLAY-SUITE-START",
      "isRunning": false,
      "timestamp": 1673234159604,
      "isPlaying": true,
      "location": "/goblet/repos/lancetipton/goblet/bdd/features/missing-input.feature",
      "fileType": "feature",
      "socketId": "XdH0ZLT9QSWRz_9JAAAF",
      "groupId": "goblet"
    },
    end: {
        "id": "e584cc76-740b-4d9c-b178-c7b9c9c6e717",
        "message": "Player - Suite Done",
        "error": false,
        "data": {
          "id": "suite-0-0",
          "action": "end",
          "testPath": "/suite-0-0",
          "fullName": "Scenario > Missing all inputs in request demo form",
          "type": "describe",
          "failedExpectations": [],
          "passedExpectations": [],
          "failed": true,
          "passed": false,
          "description": "Scenario > Missing all inputs in request demo form",
          "timestamp": 1673234159604,
          "tests": []
        },
        "group": "XdH0ZLT9QSWRz_9JAAAF",
        "name": "PLAY-SUITE-DONE",
        "isRunning": false,
        "timestamp": 1673234162281,
        "isPlaying": true,
        "location": "/goblet/repos/lancetipton/goblet/bdd/features/missing-input.feature",
        "fileType": "feature",
        "socketId": "XdH0ZLT9QSWRz_9JAAAF",
        "groupId": "goblet"
    },
  },
  step: {
    start: {
        "id": "5bf7e760-70b8-463b-919f-450fe3dc7fbd",
        "message": "Player - Spec Start",
        "error": false,
        "data": {
          "id": "spec0",
          "action": "start",
          "testPath": "/suite-0-0/spec0",
          "fullName": "Scenario > Missing all inputs in request demo form > Given I navigate to \"https://abstrakt.ai/\"",
          "type": "test",
          "failedExpectations": [],
          "passedExpectations": [],
          "failed": false,
          "passed": false,
          "description": "Given I navigate to \"https://abstrakt.ai/\"",
          "timestamp": 1673234159604
        },
        "group": "XdH0ZLT9QSWRz_9JAAAF",
        "name": "PLAY-SPEC-START",
        "isRunning": false,
        "timestamp": 1673234159604,
        "isPlaying": true,
        "location": "/goblet/repos/lancetipton/goblet/bdd/features/missing-input.feature",
        "fileType": "feature",
        "socketId": "XdH0ZLT9QSWRz_9JAAAF",
        "groupId": "goblet"
    },
    end: {
        "id": "7a0d3ae5-14f0-423e-9fc9-a64fc934fee9",
        "message": "Player - Spec Done",
        "error": false,
        "data": {
          "id": "spec0",
          "action": "end",
          "testPath": "/suite-0-0/spec0",
          "fullName": "Scenario > Missing all inputs in request demo form > Given I navigate to \"https://abstrakt.ai/\"",
          "type": "test",
          "failedExpectations": [],
          "passedExpectations": [],
          "failed": false,
          "passed": true,
          "description": "Given I navigate to \"https://abstrakt.ai/\"",
          "timestamp": 1673234160582,
          "status": "passed"
        },
        "group": "XdH0ZLT9QSWRz_9JAAAF",
        "name": "PLAY-SPEC-DONE",
        "isRunning": false,
        "timestamp": 1673234160582,
        "isPlaying": true,
        "location": "/goblet/repos/lancetipton/goblet/bdd/features/missing-input.feature",
        "fileType": "feature",
        "socketId": "XdH0ZLT9QSWRz_9JAAAF",
        "groupId": "goblet"
    },
  },
}


const allSteps = [
  `feature.start`,
  `scenario.start`,
  `step.start`,
  `step.end`,
  `scenario.end`,
  `feature.end`,
]

const buildSteps = () => ([...allSteps])
let currentSteps = buildSteps()

const getStep = () => {
  let step = currentSteps.shift()
  if(!step){
    currentSteps = buildSteps()
    return
  }

  return get(eventData, step)
}

const DecorationComp = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      Icon={ClearAllIcon}
      onClick={props.onClick}
      className='goblet-decoration-action'
      tooltip='Clear test results from the editor'
    />
  )
}

export const DecorationAction:TSidebarAction = {
  Component: DecorationComp,
  name: `decoration-editor-action`,
  onClick: async (event, editor, loc, content) => {
    clearEditorDecorations()
    
    // const eventData = getStep()

    // eventData
    //   ? playEvent(deepMerge(eventData))
    //   : clearEditorDecorations()
  }
}