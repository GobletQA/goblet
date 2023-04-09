import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { checkForAncestor } from '@GTU/Support/validate'

/**
 * Clicks the element `selector` that is a descendant of the registered ancestor.
 * @param {String} selector - valid playwright selector
 * @param {Object} world - world object, containing the ancestor metadata
 */
export const clickDescendent = async (
  selector:string,
  world:TWorldConfig
) => {
  checkForAncestor(world)
  const descendent = await getLocator(
    `${world.meta.ancestorSelector} ${selector}`
  )

  return descendent.click({
    force: true
  })
}

When('I click the descendent element {string}', clickDescendent, {
  module: `clickDescendent`,
  description: `Locates a element by selector and clicks.\nThere must be a preceding step that establishes an ancestor.`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the element. Selector must be specific enough to locate a single element.`,
      example: "button[name='button-name']",
    },
  ],
})

