import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { EModalTypes } from '@types'
import { TestRuns } from '@components/TestRuns'
import { colors, GobletIcon } from '@gobletqa/components'

export const TestRunsModal:TModalRef = (props:TModalComponent) => {
  return (<TestRuns />)
}

TestRunsModal.modalType = EModalTypes.TestRuns
TestRunsModal.modalProps = {
  maxWidth: `lg`,
  sx: {
    height: `100vh`,
    [`& .MuiDialog-container`]: {
      height: `100vh`,
    }
  },
  PaperProps: {
    sx: {
      height: `100vh`,
    }
  },
  title: `Run Test Suite`,
  titleProps: {
    Icon: (<GobletIcon sx={{ color: colors.purple10}} />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}