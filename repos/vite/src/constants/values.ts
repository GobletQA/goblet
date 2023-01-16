// Get all allowed emails from the env
export const AllowedUsers = (process.env.GB_GITHUB_AUTH_USERS || '').split(',')

export const EditorSidebarWidth = 230

export const GobletQAUrl = `https://www.gobletqa.com`
export const GoogleSearchUrl = `https://www.google.com/search?igu=1&q=`

export const ResizePanelClassTxt = `react-page-split`
export const ResizePanelClass = `.${ResizePanelClassTxt}`
export const ScreencastBrowserSelector = `screencast-browser`
export const ResizePanelVClass = `.react-page-split--vertical`
export const ResizePanelSplitClass = `.react-page-split__panel`

export const WSRecordActions = {
  stop:`stop`,
  start:`start`,
}
export const WSPlayActions = {
  stop:`stop`,
  start:`start`,
}

export const ResetAllGroupSetting = `reset-all-group-setting`