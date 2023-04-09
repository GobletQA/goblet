import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { checkElement } from './checkElement'
import { checkForAncestor } from '@GTU/Support/validate'

/**
 * Checks/unchecks the element matching the selector, that is also a descendent of the registered ancestor.
 * @param {String} action - check action
 * @param {string} selector - valid playwright selector
 * @param {Object} world
 */
export const checkDescendent = async (
  action:string,
  selector:string,
  world:TWorldConfig
) => {
  checkForAncestor(world)
  return checkElement(
    action,
    `${world.meta.ancestorSelector} ${selector}`,
    world
  )
}

When(`I {string} the descendent element {string}`, checkDescendent, {
  module: `checkDescendent`,
  description: `Locates a checkbox element by selector and checks the checkbox.\nThere must be a preceding step that establishes an ancestor.`,
  examples: [
    `I "uncheck" the element "input[name=\'unique_name\']"`
  ],
  expressions: [
    {
      type: 'string',
      description: `Valid options are \'check\' or \'uncheck\' only.`,
      example: 'check',
    },
    {
      type: 'string',
      description: `The element selector.  Selector must be specific enough to locate a single element.  Valid for checkbox and radio inputs.`,
      example: "input[name='unique_name']",
    },
  ],
})

