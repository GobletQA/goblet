import { toNum } from '@keg-hub/jsutils'

/**
 * Gets the screen dimensions from the current ENV
 * Uses GOBLET_CONTEXT_WIDTH && GOBLET_CONTEXT_HEIGHT envs first
 * 
 * @returns {Object} - Screen Dims Object
 */
export const getScreenDims = () => {
  const {
    GB_VNC_VIEW_WIDTH,
    GB_VNC_VIEW_HEIGHT,
    GOBLET_CONTEXT_WIDTH=GB_VNC_VIEW_WIDTH,
    GOBLET_CONTEXT_HEIGHT=GB_VNC_VIEW_HEIGHT,
  } = process.env

  return {
    width: toNum(GOBLET_CONTEXT_WIDTH),
    height: toNum(GOBLET_CONTEXT_HEIGHT),
  }
}
