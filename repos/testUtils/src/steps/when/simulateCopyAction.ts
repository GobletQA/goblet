import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

export const simulateCopyAction = async () => {
  const page = await getPage()
  await page.keyboard.press('Control+C')
}

const meta = {
  race: true,
  module: `simulateCopyAction`,
  alias: [`Simulate copy action`],
  name: `Simulate copy action`,
  description: `Simulating copy action`,
  examples: [
    `When I simulate copy action`
  ]
}

When(`I simulate copy action`, simulateCopyAction, meta)