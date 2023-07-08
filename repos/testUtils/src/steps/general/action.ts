import type { TStepCtx } from '@GTU/Types'

import { getLocator, getPage } from '@GTU/Playwright'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const generalAction = async (action:string, selector:string, ctx:TStepCtx) => {
  const page = await getPage()
  await getLocator(selector, ctx)
  return page[action](selector, { force: true })
}

const meta = (exp1='word', exp2='string') => ({
  module: `general-action`,
  examples: [
    `Given I click "button[name='submit']"`,
    `When I check "input[name='checkbox']"`,
    `Then I uncheck "input[name='checkbox']"`,
  ],
  description: `Locates an element by selector and preforms an action on it.`,
  expressions: [
    {
      type: exp1,
      description: `The action to perform on the element`,
      example: "click",
    },
    {
      type: exp2,
      description: `The element selector. Selector must be specific enough to locate a single element.`,
      example: "button[name='unique_name']",
    },
  ],
})

// Then('I {word} {string}', generalAction, meta())
// Then('I {word} the {string}', generalAction, meta())
// Then('I {word} {word}', generalAction, meta(`word`, `word`))
// Then('I {word} the {word}', generalAction, meta(`word`, `word`))

