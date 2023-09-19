import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { EModalTypes } from '@types'
import { ExamRun } from '@components/ExamRun'
import { colors, GobletIcon } from '@gobletqa/components'

export const ExamRunModal:TModalRef = (props:TModalComponent) => {
  return (<ExamRun />)
}

ExamRunModal.modalType = EModalTypes.ExamRun
ExamRunModal.modalProps = {
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