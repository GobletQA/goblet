import { colors, dims } from '@gobletqa/components/theme'
const { divider } = dims.panel

export const layout = () => `
  .sash {
    opacity: 0;
    z-index: 100;
    position: relative;
    box-sizing: border-box;
    background: ${colors.white};
    background-clip: padding-box;
    transition: opacity 200ms ease-in-out;


    &.sash-vertical {
      height: 100%;
      cursor: col-resize;
      max-width: ${divider.wpx};
      border-left: ${divider.hvrpx} solid ${colors.royalPurple};
      border-right: ${divider.hvrpx} solid ${colors.royalPurple};
    }

    &.sash-horizontal {
        width: 100%;
        cursor: row-resize;
        max-height: ${divider.hpx};
        border-top: ${divider.hvrpx} solid ${colors.royalPurple};
        border-bottom: ${divider.hvrpx} solid ${colors.royalPurple};
    }

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