import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import {
  contextStateLoc,
  defaultStateFile,
} from '@GTU/Playwright/browserContext'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const usePageState = async (name:boolean|string, world:TWorldConfig) => {
  const contextState = contextStateLoc(name)
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

Given('I use the saved page state', (world) => usePageState(false, world), meta)
Given('I use the saved {string} page state', usePageState, {
  ...meta,
  expressions: [
    {
      type: 'string',
      description: `Name of the context state file that is being saved`,
      example: defaultStateFile,
    }
  ]
})

