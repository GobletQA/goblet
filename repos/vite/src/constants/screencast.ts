import { toNum } from '@keg-hub/jsutils'

export const ScreencastWidth = toNum(process.env.GB_VNC_VIEW_WIDTH) || 0
export const ScreencastHeight = toNum(process.env.GB_VNC_VIEW_HEIGHT) || 0
export const ScreencastRatio = (
  Math.round(((ScreencastWidth / ScreencastHeight) + Number.EPSILON) * 100) / 100
)

export const ScreencastPort = process.env.GB_SC_PORT || `19011`

export const WaitTimeout = toNum(process.env.GB_FE_CONTAINER_WAIT) || 20
export const ContainerCheckInterval = (toNum(process.env.GB_FE_CONTAINER_CHECK_INTERVAL) || 4) * 1000