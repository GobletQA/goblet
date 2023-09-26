import { colors } from '@gobletqa/components'


// This is a hack to fix the spinner not being removed
// The spinner classes are kept on the decorator alongside failed / passed classes
// Seems to be a bug in monaco
const decoratorFinishedHack = `
  .gb-test-runs-deco.finished.failed,
  .gb-player-glyph.gb-player-finished.code.failed {
    border: none;
    animation: none;
  }

  .gb-test-runs-deco.finished.passed,
  .gb-player-glyph.gb-player-finished.code.passed {
    border: none;
    animation: none;
  }
`

/**
 * The .code class is only used for the monaco editor, not for race
 * The decos have different styles, so the extra class is used to separate them
 */
export const decorators = `

  .gb-test-runs-line.running,
  .gb-player-line.gb-player-running.code {
    background-color: ${colors.purple10}33;
    border-bottom: 2px solid ${colors.purple10}66;
  }

  .gb-test-runs-line.passed,
  .gb-player-line.gb-player-finished.code.passed {
    background-color: ${colors.green10}33;
    border-bottom: 2px solid ${colors.green10}66;
  }

  .gb-test-runs-line.failed,
  .gb-player-line.gb-player-finished.code.failed {
    background-color: ${colors.red10}33;
    border-bottom: 2px solid ${colors.red10}66;
  }

  .gb-test-runs-line.canceled,
  .gb-player-line.gb-player-finished.code.canceled {
    opacity: 0.7;
    background-color: ${colors.yellow12}33;
    border-bottom: 2px solid ${colors.yellow12}66;
  }

  .gb-test-runs-deco-spin,
  .gb-player-glyph.gb-player-running.code {
    margin: 0px auto;
    font-size: 3px;
    position: absolute;
    border-radius: 50%;
    text-indent: -9999em;
    left: 3px !important;
    width: 18px !important;
    height: 18px !important;
    border-left: 1em solid ${colors.purple10};
    border-top: 1em solid ${colors.purple10}33;
    border-right: 1em solid ${colors.purple10}33;
    border-bottom: 1em solid ${colors.purple10}33;
  }

  ${decoratorFinishedHack}

  .gb-test-runs-deco-spin,
  .gb-player-glyph.gb-player-running {
    transform: translateZ(0);
    -ms-transform: translateZ(0);
    -webkit-transform: translateZ(0);
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

  .gb-player-glyph.gb-player-finished.code.passed {
    left: 12px !important;
    width: 8px !important;
    display: inline-block;
    height: 14px !important;
    transform: rotate(36deg);
    border-right: 3px solid ${colors.green10};
    border-bottom: 3px solid ${colors.green10};
  }

  .gb-player-glyph.gb-player-finished.code.failed {
    position: absolute;
    left: 0px !important;
    width: 18px !important;
    height: 18px !important;
  }

  .gb-player-glyph.gb-player-finished.code.failed:before,
  .gb-player-glyph.gb-player-finished.code.failed:after {
    position: absolute;
    width: 3px;
    left: 15px;
    height: 16px;
    content: ' ';
    background-color: ${colors.red10};
  }

  .gb-player-glyph.gb-player-finished.code.failed:before {
    transform: rotate(45deg);
  }

  .gb-player-glyph.gb-player-finished.code.failed:after {
    transform: rotate(-45deg);
  }
`