
import {toggleTestRunScrollLock} from '@actions/testRuns/toggleTestRunScrollLock'
import { cls } from '@keg-hub/jsutils'

import {
  ToggleScrollLockIcon,
  ToggleScrollLockButton,
  ToggleScrollLockIconOpen,
  ToggleScrollLockContainer,
} from './LayoutCoverActions.styled'


export const ToggleScrollAction = (props:{ scrollLock?:boolean }) => {
  const { scrollLock } = props
  
  return (
    <ToggleScrollLockContainer className='gb-test-run-scroll-lock-container' >
      <ToggleScrollLockButton
        text={scrollLock ? `Locked` : `Unlocked`}
        onClick={() => toggleTestRunScrollLock(!scrollLock)}
        Icon={scrollLock ? ToggleScrollLockIcon : ToggleScrollLockIconOpen}
        tooltip={scrollLock ? `Click to unlock scrolling` : `Click to lock scrolling`}
        className={cls(`gb-test-run-scroll-lock`, scrollLock ? `locked` : `unlocked`)}
      />
    </ToggleScrollLockContainer>
  )
}
