import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { get } from '@keg-hub/jsutils'
import { getLocators } from '@GTU/Playwright'
import { cleanWorldPath, greaterLessEqual } from '@GTU/Support/helpers'

// -- TODO: Needs updated to use the saveWorldData helpers
//  -- And to use race

/**
 * Expects the number of dom elements matching `selector` to equal `count`
 * @param {string} selector - valid playwright selector
 * @param {string} worldPath - Path on the world object
 */
export const compareSavedElementCount = async (
  selector:string,
  type:string,
  worldPath:string,
  ctx:TStepCtx
) => {

  const { world } = ctx
  const cleaned = cleanWorldPath(worldPath)
  if(!cleaned) throw new Error(`World Path "${worldPath}" is invalid.`)

  const { count } = get(world, cleaned, {} as any)
  if(!count) throw new Error(`World Path "${worldPath}" does not contain a saved count.`)

  const elements = await getLocators(selector)
  const current = await elements.count()

  greaterLessEqual(current, count, type)
}

const meta = {
  module : `compareSavedElementCount`,
  examples: [
    `Then the "li.list-items" count is "equal" to "app.saved.itemCount"`,
    `Then the count of "li.list-items" is ">=" to "app.saved.itemCount"`,
  ],
  description: `Locates elements by selector and compares the amount of found elements against a previously stored number from the $wold.`,
  expressions: [
    {
      type: `string`,
      description: `The selector for the elements.`,
      example: `li.list-item`,
    },
    {
      type: `string`,
      description: `The word or symbol that defines the validation check. Must be one of ${greaterLessEqual.matchTypes}`,
      example: `<`,
    },
    {
      type: `string`,
      description: `Path on the world where the count should be saved`,
      example: `page.items.count`,
    },
  ],
}

Then(`the {string} count is {string} to {string}`, compareSavedElementCount, meta)

