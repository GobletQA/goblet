import type { TGobletTheme } from '@types'

import { gutter } from './gutter'
import { colors } from './colors'

export type TGlobalStyles = {
  theme:TGobletTheme
}

export const globalStyles = ({ theme }:TGlobalStyles) => {
  const { palette, typography } = theme
  const { mode, common, primary } = palette

  return `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap');

    :root {
      color-scheme: light dark;
    }

    body {
      overflow: hidden;
      font-family: ${typography.fontFamily};
      background: ${mode === 'light' ? colors.white00 : colors.black01};
    }

    *:focus-visible { outline: 1px solid ${primary.main} }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      box-shadow: 0 0 0px 40rem #ffff inset;
      -webkit-box-shadow: 0 0 0px 40rem #ffff inset;
      -webkit-text-fill-color: rgba(0,0,0,0.87);
    }

    /* This sets the color of the split divider */
    /* Need to come up with a good way to set the color */
    /* right now just overrides the blue color */
    .react-page-split__divider:focus,
    .react-page-split__divider:hover {
      background-color: ${primary.main} !important;
    }
  `
}