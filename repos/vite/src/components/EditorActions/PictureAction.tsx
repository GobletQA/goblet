import type { TMenuItem } from '@gobletqa/components'

import { CameraAltIcon } from '@gobletqa/components'

export const PictureAction:TMenuItem = {
  onClick: async (event) => {
    console.log(`------- TODO - Take a Picture of the page -------`)
  },
  disabled: true,
  closeMenu:true,
  Icon: CameraAltIcon,
  id:`picture-browser-action`,
  key:`picture-browser-action`,
  text: `Browser - Screenshot`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `COMING SOON - Take a picture of the browser`,
  },
}