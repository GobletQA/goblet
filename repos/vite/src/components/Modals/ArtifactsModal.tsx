import type { TModalRef, TModalComponent } from '@types'

import { EModalTypes } from '@types'
import { InsertChartIcon } from '@gobletqa/components'
import { Artifacts } from '@components/Artifacts'

export const ArtifactsModal:TModalRef = (props:TModalComponent) => {
  return (<Artifacts />)
}

ArtifactsModal.modalType = EModalTypes.Artifacts
ArtifactsModal.modalProps = {
  title: `Artifacts`,
  titleProps: {
    Icon: (<InsertChartIcon />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}