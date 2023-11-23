import { DownloadIcon } from '@gobletqa/components'
import { downloadReport } from '@actions/files/api/downloadReport'
import {
  ReportDownload,
  ReportDownloadContainer,
} from './LayoutCoverActions.styled'


export type TReportDownloadAction = {
  htmlReport:string
}

export const ReportDownloadAction = (props:TReportDownloadAction) => {

  const { htmlReport } = props

  return (
    <ReportDownloadContainer>
      <ReportDownload
        tooltip='Download test run html report'
        Icon={DownloadIcon}
        text='Download Report'
        onClick={(evt:any) => {
          evt.preventDefault()
          evt.stopPropagation()
          downloadReport(htmlReport)
        }}
      />
      Report download
    </ReportDownloadContainer>
  )
}
