import type { TMenuItem } from '@gobletqa/components'

import { CropSquareIcon } from '@gobletqa/components'


export const SquareAction:TMenuItem = {
  onClick: async (event) => {
    console.log(`------- TODO - draw a square on the page -------`)
  },
  disabled: true,
  closeMenu:true,
  Icon: CropSquareIcon,
  id:`square-browser-action`,
  key:`square-browser-action`,
  text: `Browser - Square Draw Tool`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `COMING SOON - Draw a square in the browser`,
  },
}