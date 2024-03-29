import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const pageTitleOneOf = async (title:string, ctx:TStepCtx) => {
  const page = await getPage()
  const pageTitle = await page.title()
  const opts = (title || ``).split(`,`)
  const found = opts.reduce((matched, opt) => matched || opt.trim() === pageTitle.trim(), false)

  expect(found).toBe(true)
}

Then(`the page title is one of {string}`, pageTitleOneOf, {
  description: `Verifies page title matches one of the passed in title options.`,
  expressions: [
    {
      type: `string`,
      description: `A comma separated list of Strings that the page title is allow to match`,
      example: `Awesome Website,Online Store,Goblet Blog`,
    },
  ],
  module: `pageTitleOneOf`
})

