import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getStepTimeout } from '@GTU/Support'
import { getLocator, getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Checks that the parent element contains the child element
 */
export const assertElementChild = async (
  parentSelector:string,
  childSelector:string,
  ctx:TStepCtx
) => {

  const timeout = getStepTimeout(ctx)
  const child = getLocator(childSelector)

  const page = await getPage()
  const parent = page.locator(parentSelector).filter({ has: child });

  return await parent.waitFor({ timeout })

}

const meta = {
  race: true,
  module: `assertElementChild`,
  alias: [`child`, `parent`],
  name: `Assert element has child`,
  description: `Validates that a parent element contains a child element.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The parent element selector.`,
      example: `div#items-container`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The child element selector.`,
      example: `div#item-1`,
    },
  ],
}

Then(`element {string} has child {string}`, assertElementChild, meta)
