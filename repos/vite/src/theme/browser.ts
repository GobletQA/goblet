import { ScreencastRatio } from '@constants/screencast'

// TODO: fix browser-size this to work in large screens

export const browser = `
  @media (min-width: 1730px) {
    #screencast-browser canvas {
      max-width: 1280px;
      max-height: 1015px;
    }
  }
`
