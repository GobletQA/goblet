import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getLocators } from '@GTU/Playwright'
import { saveWorldData } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Expects the number of dom elements matching `selector` to equal `count`
 * @param {string} selector - valid playwright selector
 * @param {string} worldPath - Path on the world object
 */
export const saveElementCount = async (
  selector:string,
  worldPath:string,
  ctx:TStepCtx
) => {

  const elements = await getLocators(selector)
  const count = await elements.count()
  const { world } = ctx

  await saveWorldData({ selector, elements, count }, world, worldPath)
  
}

Given(`I save the count of {string} as {string}`, saveElementCount, {
  name: `Save element count`,
  module : `saveElementCount`,
  description: `Locates elements by selector and stores the amount that exist`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the elements.`,
      example: `li.list-item`,
    },
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `Path on the world where the count should be saved`,
      example: `page.items.count`,
    },
  ],
  race: true
})
