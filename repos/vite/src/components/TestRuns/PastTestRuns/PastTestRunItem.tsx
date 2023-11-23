import type { TTestRun } from '@types'

import {wordCaps} from '@keg-hub/jsutils'
import { TestRunDeco } from '../TestRunHelpers/TestRunDeco'
import { usePastTestRun } from '@hooks/testRuns/usePastTestRun'
import { downloadReport } from '@actions/files/api/downloadReport'
import { DownloadIcon, Tooltip, KeyboardArrowRightIcon } from '@gobletqa/components'
import {
  PastTestRunListItem,
  PastTestRunStatusText,
  PastTestRunListItemText,
  PastTestRunListItemContent,
  PastTestRunListItemIcon,
  PastTestRunDecoContainer,
  PastTestRunListItemButton,
  PastTestRunListItemDownload,
} from './PastTestRuns.styled'


export type TPastTestRunItem = {
  run: TTestRun
  onClick:(id:string) => void
}


export const PastTestRunItem = (props:TPastTestRunItem) => {
  const { run, onClick } = props
  const { name, date, status, htmlReport } = usePastTestRun(props)

  return (
    <PastTestRunListItem
      key={run.runId}
      className={`gb-past-test-runs-list-item item ${status}`}
    >
        <PastTestRunListItemButton
          onClick={() => onClick(run.runId)}
          className={`gb-past-test-runs-list-item-button ${status}`}
        >

          <PastTestRunListItemContent className={`gb-past-test-runs-list-item-text ${status}`} >

            <PastTestRunListItemText className={`gb-past-test-runs-list-item-name name ${status}`} >
              {wordCaps(name)}
            </PastTestRunListItemText>

            <PastTestRunListItemText className={`gb-past-test-runs-list-item-date date ${status}`} >
              {date.toLocaleString()}
            </PastTestRunListItemText>

            <PastTestRunDecoContainer className={`gb-past-test-runs ${status}`}>
              <TestRunDeco
                status={status}
                className='gb-past-run-status-deco'
              />
              <PastTestRunStatusText className={`gb-past-run-status-text ${status}`} >
                {wordCaps(status)}
              </PastTestRunStatusText>
            </PastTestRunDecoContainer>

          </PastTestRunListItemContent>

          {htmlReport && (
            <PastTestRunListItemDownload
              tooltip='Download html report'
              Icon={DownloadIcon}
              onClick={(evt:any) => {
                evt.preventDefault()
                evt.stopPropagation()
                downloadReport(htmlReport)
              }}
            />
          )|| null}

          <Tooltip
            loc='bottom'
            describeChild
            title={`Go to test results`}
          >
            <PastTestRunListItemIcon className={`gb-past-test-runs-list-item-icon ${status}`} >
              <KeyboardArrowRightIcon className={`gb-past-test-runs-link-icon ${status}`} />
            </PastTestRunListItemIcon>
          </Tooltip>

        </PastTestRunListItemButton>
    </PastTestRunListItem>
  )
}
