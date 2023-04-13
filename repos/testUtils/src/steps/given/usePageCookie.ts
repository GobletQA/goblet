import type { TWorldConfig } from '@ltipton/parkin'
import { Given } from '@GTU/Parkin'
import {
  getContext,
  setContextCookie,
  defaultCookieFile,
} from '@GTU/Playwright/browserContext'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const usePageCookie = async (
  name:boolean|string,
  world:TWorldConfig
) => {
  const context = await getContext()
  await setContextCookie(context, name)
}

const meta = {
  name: `Save page cookie`,
  module: `usePageCookie`,
  examples: [
    `Given I use the saved page cookie`,
    `Given I use the saved "saved-cookie-name" page cookie`,
  ],
  description: `Saves the cookie of the browser context to be reused at a later time.`,
  expressions: [],
  race: true
}

Given(`I use the saved page cookie`, (world:TWorldConfig) => usePageCookie(false, world), meta)
Given(`I use the saved {string} page cookie`, usePageCookie, {
  name: `Save page cookie as`,
  ...meta,
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `Name of the context cookie file that is being saved`,
      example: defaultCookieFile,
    }
  ]
})
