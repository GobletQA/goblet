import { useMemo } from 'react'
import { useSelector } from '@store'
import { ModalRoot } from './ModalRoot'
import { ModalMessage } from './ModalMessage'
import * as ModalMap from '@components/Modals'

export const ModalManager = () => {
  const { type, visible, modalProps } = useSelector(state => state.modal)
  const Modal = useMemo(() => Object.values(ModalMap).find(Modal => Modal.modalType === type), [type])

  return Modal && (
    // @ts-ignore
    <ModalRoot
      {...Modal?.modalProps}
      type={type ||  Modal.modalType}
      visible={visible}
      {...modalProps}
    >
      <Modal
        ModalMessage={ModalMessage}
        type={type ||  Modal.modalType}
        visible={visible}
        {...modalProps}
      />
    </ModalRoot>
  ) || null
}