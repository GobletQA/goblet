
import { colors, dims } from '@gobletqa/components/theme'
const { divider } = dims.panel

export const layout = () => `

  .sash {
    --separator-border: ${colors.royalPurple};
    
    opacity: 0;
    z-index: 100;
    background: #000;
    box-sizing: border-box;
    background-clip: padding-box;
    transition: opacity 200ms ease-in-out;
    -webkit-transition: opacity 200ms ease-in-out;

    margin: 0;
    height: 100%;
    cursor: col-resize;
    position: relative;
    max-width: ${divider.wpx};
    background: ${colors.white};
    border-left: ${divider.hvrpx} solid ${colors.royalPurple};
    border-right: ${divider.hvrpx} solid ${colors.royalPurple};
  }

  .split-view-view:before,
  .sash:before {
    border: none !important;
    background: none !important;
  }

  .sash:hover {
    opacity: 1;
  }

  .sash-active, .sash-hover {
    opacity: 1;
  }

`