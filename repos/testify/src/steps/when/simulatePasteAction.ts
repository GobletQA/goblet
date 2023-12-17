import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

export const simulatePasteAction = async () => {
  const page = await getPage()
  await page.keyboard.press('Control+V')
}

const meta = {
  race: true,
  module: `simulatePasteAction`,
  alias: [`Simulate paste action`],
  name: `Simulate paste action`,
  description: `Simulating paste action`,
  examples: [
    `When I simulate paste action`
  ]
}

When(`I simulate paste action`, simulatePasteAction, meta)