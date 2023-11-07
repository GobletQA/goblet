
import {toggleTestRunScrollLock} from '@actions/testRuns/toggleTestRunScrollLock'
import { cls } from '@keg-hub/jsutils'

import {
  TestRunScrollLockIcon,
  TestRunScrollLockButton,
  TestRunScrollLockIconOpen,
  TestRunScrollLockContainer,
} from './TestRunsToggleScroll.styled'


export const TestRunToggleScroll = (props:{ scrollLock?:boolean }) => {
  const { scrollLock } = props
  
  return (
    <TestRunScrollLockContainer className='gb-test-run-scroll-lock-container' >
      <TestRunScrollLockButton
        onClick={() => toggleTestRunScrollLock(!scrollLock)}
        Icon={scrollLock ? TestRunScrollLockIcon : TestRunScrollLockIconOpen}
        tooltip={scrollLock ? `Scrolling is Locked` : `Scrolling is Unlocked`}
        className={cls(`gb-test-run-scroll-lock`, scrollLock ? `locked` : `unlocked`)}
      />
    </TestRunScrollLockContainer>
  )
}
