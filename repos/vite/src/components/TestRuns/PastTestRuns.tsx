import type { TTestRuns, TTestRun } from '@types'

import { ETestRunsSection } from '@types'
import { TestRunsMsg } from './TestRunsMsg'
import { TestRunDeco } from './TestRunDeco'
import { usePastTestRun } from '@hooks/testRuns/usePastTestRun'
import {
  PlayCircleOutlineIcon,
  KeyboardArrowRightIcon,
  useInline
} from '@gobletqa/components'
import {
  TestRunsButton,
  TestRunsButtonContainer
} from './TestRunsMsg.styled'
import {
  PastTestRunListItem,
  PastTestRunsListItems,
  PastTestRunStatusText,
  PastTestRunListItemName,
  PastTestRunListItemDate,
  PastTestRunListItemText,
  PastTestRunListItemIcon,
  PastTestRunDecoContainer,
  PastTestRunsListContainer,
  PastTestRunListItemButton,
} from './PastTestRuns.styled'
import {toNum, wordCaps} from '@keg-hub/jsutils'

export type TPastTestRuns = {
  runs: TTestRuns
  setRunId:(id:string) => void
  onChangeSection:(section:ETestRunsSection) => void
}

export type TPastTestRunList = {
  runs: TTestRun[]
  onClick:(id:string) => void
}

export type TPastTestRunItem = {
  run: TTestRun
  onClick:(id:string) => void
}


const PastTestRunItem = (props:TPastTestRunItem) => {
  const { run, onClick } = props
  const { name, date, status } = usePastTestRun(props)

  return (
    <PastTestRunListItem
      key={run.runId}
      className='gb-past-test-runs-list-item'
    >
      <PastTestRunListItemButton
        onClick={() => onClick(run.runId)}
        className='gb-past-test-runs-list-item-button'
      >

        <PastTestRunListItemText className='gb-past-test-runs-list-item-text' >

          <PastTestRunDecoContainer>
            <TestRunDeco
              status={status}
              className='gb-past-run-status-deco'
            />
            <PastTestRunStatusText className={`gb-past-run-status-text ${status}`} >
              {wordCaps(status)}
            </PastTestRunStatusText>
          </PastTestRunDecoContainer>

          <PastTestRunListItemName className='gb-past-test-runs-list-item-name' >
            {wordCaps(name)}
          </PastTestRunListItemName>


          <PastTestRunListItemDate className='gb-past-test-runs-list-item-date' >
            {date.toLocaleString()}
          </PastTestRunListItemDate>


        </PastTestRunListItemText>

        <PastTestRunListItemIcon className='gb-past-test-runs-list-item-icon' >
          <KeyboardArrowRightIcon />
        </PastTestRunListItemIcon>
      </PastTestRunListItemButton>
    </PastTestRunListItem>
  )
}

const PastTestRunList = (props:TPastTestRunList) => {
  
  const {
    runs,
    onClick,
  } = props
  
  
  return (
    <PastTestRunsListContainer className='gb-past-test-runs-container' >
      <PastTestRunsListItems className='gb-past-test-runs-list' >
        {
          runs.map((run) => {
            return (
              <PastTestRunItem
                run={run}
                key={run.runId}
                onClick={onClick}
              />
            )
          })
        }
      </PastTestRunsListItems>
    </PastTestRunsListContainer>
  )
  
}



export const PastTestRuns = (props:TPastTestRuns) => {
  const { runs, setRunId, onChangeSection } = props
  const testRuns = Object.values(runs)

  const onClick = useInline((id:string) => {
    setRunId(id)
    onChangeSection(ETestRunsSection.reporter)
  })

  return !testRuns?.length
    ? (
        <TestRunsMsg
          className='gb-test-run-no-past-run'
          textClass='gb-test-run-no-past-run-text'
          iconClass='gb-test-run-no-past-run-icon'
          message={`No previous test runs exist`}
        >
          <TestRunsButtonContainer>
            <TestRunsButton
              text='Run Tests'
              variant='contained'
              Icon={PlayCircleOutlineIcon}
              onClick={() => onChangeSection?.(ETestRunsSection.runOptions)}
            />
          </TestRunsButtonContainer>
        </TestRunsMsg>
      )
    : (
        <PastTestRunList
          runs={testRuns}
          onClick={onClick}
        />
      )
}
