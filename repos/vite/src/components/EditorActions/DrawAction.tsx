import type { TMenuItem } from '@gobletqa/components'

import { ModeEditIcon } from '@gobletqa/components'

export const DrawAction:TMenuItem = {
  disabled: true,
  closeMenu:true,
  dividerTop: true,
  Icon: ModeEditIcon,
  id:`free-draw-in-editor-action`,
  key:`free-draw-in-editor-action`,
  text: `Browser - Pencil Tool`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `COMING SOON - Free draw in the browser`,
  },
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Draw a line on the page -------`)
  }
}