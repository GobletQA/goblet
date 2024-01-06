import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getContext } from '@GTU/Playwright/browserContext'
import { setContextCookie, DefaultCookieFile } from '@gobletqa/browser'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const usePageCookie = async (
  name:string|false,
  ctx:TStepCtx
) => {
  const context = await getContext()
  await setContextCookie(context, name)
}

const meta = {
  name: `Use saved page cookie`,
  module: `usePageCookie`,
  examples: [
    `Given I use the saved page cookie`,
    `Given I use the saved "saved-cookie-name" page cookie`,
  ],
  description: `Saves the cookie of the browser context to be reused at a later time.`,
  expressions: [],
  race: true
}

Given(`I use the saved page cookie`, (ctx:TStepCtx) => usePageCookie(false, ctx), meta)
Given(`I use the saved {string} page cookie`, usePageCookie, {
  name: `Use saved page cookie`,
  ...meta,
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `Name of the context cookie file that is being used`,
      example: DefaultCookieFile,
    }
  ]
})
