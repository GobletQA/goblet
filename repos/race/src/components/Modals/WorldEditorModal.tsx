import type { TModalRef, TModalComponent } from '@gobletqa/components'


import { WorldIcon } from '@gobletqa/components'
import { WorldEditor } from '@GBR/components/WorldEditor'

export const WorldEditorModal:TModalRef = (props:TModalComponent) => {
  return (<WorldEditor />)
}

WorldEditorModal.modalType = `WorldEditor`
WorldEditorModal.modalProps = {
  title: `World Editor`,
  maxWidth: `md`,
  titleProps: {
    Icon: (<WorldIcon />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}