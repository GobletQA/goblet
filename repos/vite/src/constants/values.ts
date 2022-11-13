import { toNum } from '@keg-hub/jsutils'

// Get all allowed emails from the env
export const AllowedUsers = (process.env.GB_GITHUB_AUTH_USERS || '').split(',')

export const ScreencastWidth = toNum(process.env.GB_VNC_VIEW_WIDTH) || 0
export const ScreencastHeight = toNum(process.env.GB_VNC_VIEW_HEIGHT) || 0

export const Environment = process.env.NODE_ENV || `local`
export const ScreencastPort = process.env.GB_SC_PORT || `7006`

export const FileTreeWidth = 200

export const GobletQAUrl = "https://www.gobletqa.com"
export const GoogleSearchUrl = "https://www.google.com/search?igu=1&q="