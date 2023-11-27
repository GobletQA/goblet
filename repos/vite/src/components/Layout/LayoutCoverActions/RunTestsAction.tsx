import { RunTestSuite } from '@components/BrowserActions/TestSuiteAction'
import { RunTestsActionContainer } from './LayoutCoverActions.styled'

export type RunTestsAction = {}

export const RunTestsAction = (props:RunTestsAction) => {

  return (
    <RunTestsActionContainer className='gb-layout-run-tests-action-container' >
      <RunTestSuite
        variant={`contained`}
        className='gb-layout-run-tests-action'
      />
    </RunTestsActionContainer>
  )
}
