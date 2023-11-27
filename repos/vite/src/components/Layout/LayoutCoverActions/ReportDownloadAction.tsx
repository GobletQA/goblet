import { DownloadIcon } from '@gobletqa/components'
import { useReportDownload } from '@hooks/testRuns/useReportDownload'
import {
  ReportDownload,
  ReportDownloadActionContainer,
} from './LayoutCoverActions.styled'

export type TReportDownloadAction = {
  htmlReport:string
}

export const ReportDownloadAction = (props:TReportDownloadAction) => {

  const {onReportDownload} = useReportDownload(props)

  return (
    <ReportDownloadActionContainer>
      <ReportDownload
        text='Report'
        Icon={DownloadIcon}
        onClick={onReportDownload}
        tooltip='Download an HTML report of the test run'
      />
    </ReportDownloadActionContainer>
  )
}
