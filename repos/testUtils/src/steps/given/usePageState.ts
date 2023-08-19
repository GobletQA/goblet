import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import {isStr} from '@keg-hub/jsutils/isStr'
import { DefaultStateFile } from '@gobletqa/browser'
import { contextStateLoc } from '@GTU/Playwright/browserContext'

/**
 * Saves the page state by name, or default name if not name is passed
 */
export const usePageState = async (name:boolean|string, ctx:TStepCtx) => {
  const contextState = isStr(name) && contextStateLoc(name)
  // TODO: Figure out how to add state to a context

}

const meta = {
  module: `usePageState`,
  examples: [
    `Given I use the saved page state`,
    `Given I use the saved "saved-state-name" page state`,
  ],
  description: `Saves the state of the browser context to be reused at a later time.`,
  expressions: [],
}

Given('I use the saved page state', (ctx:TStepCtx) => usePageState(false, ctx), meta)
Given('I use the saved {string} page state', usePageState, {
  ...meta,
  expressions: [
    {
      type: `string`,
      description: `Name of the context state file that is being saved`,
      example: DefaultStateFile,
    }
  ]
})

