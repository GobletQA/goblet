import type { TGobletTheme } from '@types'

export type TGlobalStyles = {
  theme:TGobletTheme
}

export const globalStyles = ({ theme }:TGlobalStyles) => {
  const { mode, common, primary } = theme.palette

  return `
    :root {
      color-scheme: light dark;
      font-synthesis: none;
      -webkit-text-size-adjust: 100%;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    body {
      overflow-x: hidden;
      background: ${mode === 'light' ? common.white : common.black};
    }

    *:focus-visible { outline: 2px solid ${primary.main} }

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