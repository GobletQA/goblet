import type { TGobletTheme } from '@gobletqa/components'
import { EThemeMode, colors } from '@gobletqa/components'

export type TGlobalStyles = {
  theme:TGobletTheme
}

export const globalStyles = ({ theme }:TGlobalStyles) => {
  const { palette, typography } = theme
  const { mode, primary } = palette

  return `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap');

    :root {
      color-scheme: light dark;
    }

    body {
      overflow: hidden;
      font-family: ${typography.fontFamily};
      background: ${mode === EThemeMode.light ? colors.white : colors.black19};
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



    .goblet-editor-area .monaco-editor .gb-player-line.gb-player-running {
      background-color: ${colors.purple10}33;
      border-bottom: 2px solid ${colors.purple10}66;
    }

    .goblet-editor-area .monaco-editor .gb-player-line.gb-player-finished.passed {
      background-color: ${colors.green10}33;
      border-bottom: 2px solid ${colors.green10}66;
    }

    .goblet-editor-area .monaco-editor .gb-player-line.gb-player-finished.failed {
      background-color: ${colors.red10}33;
      border-bottom: 2px solid ${colors.red10}66;
    }

    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-running {
      margin: 0px auto;
      font-size: 3px;
      position: absolute;
      border-radius: 50%;
      text-indent: -9999em;
      left: 3px !important;
      width: 18px !important;
      height: 18px !important;
      border-top: 1em solid ${colors.purple10}33;
      border-right: 1em solid ${colors.purple10}33;
      border-bottom: 1em solid ${colors.purple10}33;
      border-left: 1em solid ${colors.purple10};
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: gb-player-running-ani 1.1s infinite linear;
      animation: gb-player-running-ani 1.1s infinite linear;
    }
    @-webkit-keyframes gb-player-running-ani {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes gb-player-running-ani {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-finished.passed {
      left: 12px !important;
      width: 8px !important;
      height: 14px !important;
      display: inline-block;
      transform: rotate(36deg);
      border-right: 3px solid ${colors.green10};
      border-bottom: 3px solid ${colors.green10};
    }

    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-finished.failed {
      position: absolute;
      left: 0px !important;
      width: 18px !important;
      height: 18px !important;
    }
    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-finished.failed:before,
    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-finished.failed:after {
      position: absolute;
      left: 15px;
      content: ' ';
      height: 16px;
      width: 3px;
      background-color: ${colors.red10};
    }
    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-finished.failed:before {
      transform: rotate(45deg);
    }
    .goblet-editor-area .monaco-editor .gb-player-glyph.gb-player-finished.failed:after {
      transform: rotate(-45deg);
    }

  `
}