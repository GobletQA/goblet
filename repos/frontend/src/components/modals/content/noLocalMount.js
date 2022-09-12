import React, { useCallback, useMemo } from 'react'
import { Modal } from '../modal'
import { Values } from 'GBConstants'
import { Times } from 'GBAssets/icons/times'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Touchable, P } from '@keg-hub/keg-components'
import { signOut } from 'GBActions/admin/user/signOut'
import { GobletButton } from 'GBComponents/buttons/button.restyle'
import { ExclamationCircle } from 'GBAssets/icons/exclamationCircle'
import { setModalVisibility, setLocalModalState } from 'GBActions/modals'

const { MODAL_TYPES } = Values

const RePar = reStyle(P)({
  textAlign: 'center'
})
const ReTouch = reStyle(Touchable)(theme => ({
  mT: theme.margin.size,
  mB: theme.margin.size,
}))


export const NoLocalMountModal = props => {
  const { title = 'Local Mount Warning', visible = false } = props

  const onTouch = useCallback(() => {
    signOut()
    setLocalModalState(MODAL_TYPES.NO_LOCAL_MOUNT, true)
    setModalVisibility(false)
  })

  const modalProps = useMemo(() => {
    return {
      footer: {
        children: (
          <GobletButton
            Icon={Times}
            text='Close'
            type='danger'
            onPress={onTouch}
          />
        )
      }
    }
  }, [onTouch])
  
  return (
    <Modal
      {...modalProps}
      title={title}
      backdrop={false}
      type='localMount'
      visible={visible}
      Icon={ExclamationCircle}
      classPrefix='modal-local-mount'
    >
      <ReTouch onPress={onTouch} showFeedback={false}>
        <RePar>Locally mounted repository could not be found.</RePar>
        <RePar>Actions will not be saved.</RePar>
      </ReTouch>
    </Modal>
  )
}
