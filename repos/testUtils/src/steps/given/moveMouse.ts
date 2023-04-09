import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

const randomInt = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Moves the mouse on the page to some X,Y coordinates
 */
export const moveMouse = async (
  XPos:number,
  YPos:number,
  world:TWorldConfig
) => {
  const page = await getPage()
  await page.mouse.move(XPos, YPos);
}

const moveMouseRandom = async (world:TWorldConfig) => {
  const page = await getPage()
  const { width, height } = page.viewportSize()
  await moveMouse(randomInt(1, width), randomInt(1, height), world)
}

Given('I move the mouse', moveMouseRandom, {
  description: `Moves the mouse on the page some arbitrary amount.`,
  expressions: [
    {
      type: 'int',
      description: `String expected to match the page title.`,
      example: 'Goblet Blog',
    },
  ],
  module: `moveMouse`
})

Given('I move the mouse to {int}, {int}', moveMouse, {
  description: `Moves the mouse to a specific X,Y coordinates of the page.`,
  expressions: [
    {
      type: 'int',
      description: `X coordinate`,
      example: 100,
    },
    {
      type: 'int',
      description: `Y coordinate`,
      example: 100,
    },
  ],
  module: `moveMouse`
})
