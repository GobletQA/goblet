import type { TModalContext } from '@types'

import { useMemo, useState } from 'react'
import type { TModalRef } from '@types'

import { useSelector } from '@store'
import { ModalRoot } from './ModalRoot'
import { ModalMessage } from './ModalMessage'
import * as ModalMap from '@components/Modals'

const MapModals = ModalMap as unknown as Record<any, TModalRef>

export const ModalManager = () => {
  const { type, visible, modalProps } = useSelector(state => state.modal)
  const Modal = useMemo(() => Object.values(MapModals).find(Modal => Modal.modalType === type), [type])

  const [modalContext, setModalContext] = useState({} as TModalContext) 

  return Modal && (
    <ModalRoot
      {...Modal?.modalProps}
      type={type ||  Modal.modalType}
      visible={visible}
      {...modalProps}
      modalContext={modalContext}
      setModalContext={setModalContext}
    >
      <Modal
        ModalMessage={ModalMessage}
        type={type ||  Modal.modalType}
        visible={visible}
        {...modalProps}
        modalContext={modalContext}
        setModalContext={setModalContext}
      />
    </ModalRoot>
  ) || null
}