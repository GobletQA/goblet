
import { useCallback } from 'react'
import { stopEvent } from '@gobletqa/components'
import { downloadReport } from '@actions/files/api/downloadReport'

export type THReportDownload = {
  htmlReport?:string
}

export const useReportDownload = (props:THReportDownload) => {
  const { htmlReport } = props

  const onReportDownload = useCallback((evt:Event) => {
    stopEvent(evt)
    htmlReport && downloadReport(htmlReport)
  }, [htmlReport])
  
  return {
    onReportDownload
  }
}
