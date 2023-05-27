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