import { useMemo } from 'react'
import * as ModalMap from '@components/Modals'
import { useSelector } from '@store'

export const ModalManager = () => {
  const { type, visible, modalProps } = useSelector(state => state.modal)

  const Modal = useMemo(() => {
    return Object.values(ModalMap).find(Modal => Modal.modalType === type)
  }, [type])

  return Modal ? (<Modal type={type ||  Modal.modalType} visible={visible} {...modalProps} />) : null

}