import { toNum } from "@keg-hub/jsutils"

// Get all allowed emails from the env
export const AllowedUsers = (process.env.GB_GITHUB_AUTH_USERS || '').split(',')

export const GoogleSearchUrl = `https://www.google.com/search?igu=1&q=`
export const GobletQAUrl = process.env.GB_GOBLET_URL || `https://www.gobletqa.com`

export const ScreencastBrowserSelector = `screencast-browser`

export const WSRecordActions = {
  stop:`stop`,
  start:`start`,
}
export const WSPlayActions = {
  stop:`stop`,
  start:`start`,
}

export const ResetAllGroupSetting = `reset-all-group-setting`


// Default to 15min for idle prompt timeout
export const IdlePromptTimeout = toNum(process.env.GB_FE_IDLE_PROMPT_TIMEOUT) || 900

// Default to 20min for idle timeout
export const IdleTimeout = toNum(process.env.GB_FE_IDLE_TIMEOUT) || 1200