import type { TModalRef } from '@types'

import { useMemo } from 'react'
import { useSelector } from '@store'
import { ModalRoot } from './ModalRoot'
import { useModalProps } from '@contexts'
import { ModalMessage } from './ModalMessage'
import * as ModalMap from '@components/Modals'

const MapModals = ModalMap as unknown as Record<any, TModalRef>

export const ModalManager = () => {
  const { type, visible, modalProps } = useSelector(state => state.modal)
  const Modal = useMemo(() => Object.values(MapModals).find(Modal => Modal.modalType === type), [type])
  const contextProps = useModalProps()

  return Modal && (
    <ModalRoot
      {...Modal?.modalProps}
      type={type ||  Modal.modalType}
      visible={visible}
      {...modalProps}
      {...contextProps}
    >
      <Modal
        ModalMessage={ModalMessage}
        type={type ||  Modal.modalType}
        visible={visible}
        {...modalProps}
        {...contextProps}
      />
    </ModalRoot>
  ) || null
}