import type { TBrowserAction } from '@gobletqa/components'

import { noOp } from '@keg-hub/jsutils'

export const EmptyAction:TBrowserAction = {
  onClick: noOp,
  Component: () => null,
  name: `empty-browser-action`,
}