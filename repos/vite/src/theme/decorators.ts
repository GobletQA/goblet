import { colors } from '@gobletqa/components'

export const decorators = `
  .gb-player-line.gb-player-running {
    background-color: ${colors.purple10}33;
    border-bottom: 2px solid ${colors.purple10}66;
  }

  .gb-player-line.gb-player-finished.passed {
    background-color: ${colors.green10}33;
    border-bottom: 2px solid ${colors.green10}66;
  }

  .gb-player-line.gb-player-finished.failed {
    background-color: ${colors.red10}33;
    border-bottom: 2px solid ${colors.red10}66;
  }

  .gb-player-glyph.gb-player-running {
    margin: 0px auto;
    font-size: 3px;
    position: absolute;
    border-radius: 50%;
    text-indent: -9999em;
    left: 3px !important;
    width: 18px !important;
    height: 18px !important;
    transform: translateZ(0);
    -ms-transform: translateZ(0);
    -webkit-transform: translateZ(0);
    border-left: 1em solid ${colors.purple10};
    border-top: 1em solid ${colors.purple10}33;
    border-right: 1em solid ${colors.purple10}33;
    border-bottom: 1em solid ${colors.purple10}33;
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

  .gb-player-glyph.gb-player-finished.passed {
    left: 12px !important;
    width: 8px !important;
    display: inline-block;
    height: 14px !important;
    transform: rotate(36deg);
    border-right: 3px solid ${colors.green10};
    border-bottom: 3px solid ${colors.green10};
  }

  .gb-player-glyph.gb-player-finished.failed {
    position: absolute;
    left: 0px !important;
    width: 18px !important;
    height: 18px !important;
  }
  .gb-player-glyph.gb-player-finished.failed:before,
  .gb-player-glyph.gb-player-finished.failed:after {
    position: absolute;
    width: 3px;
    left: 15px;
    height: 16px;
    content: ' ';
    background-color: ${colors.red10};
  }
  .gb-player-glyph.gb-player-finished.failed:before {
    transform: rotate(45deg);
  }
  .gb-player-glyph.gb-player-finished.failed:after {
    transform: rotate(-45deg);
  }
`