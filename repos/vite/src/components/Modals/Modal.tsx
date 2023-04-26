import type { TModalRef } from '@gobletqa/components'

import {
  ModalManager,
} from '@gobletqa/components'

import { useMemo } from 'react'
import { useModal } from '@store'
import { useModalProps } from '@contexts'
import { toggleModal } from '@actions/modals'
import * as ModalMap from '@components/Modals'

const MapModals = ModalMap as unknown as Record<any, TModalRef>

export const Modal = () => {
  const { type, visible, modalProps } = useModal()
  const ActiveModal = useMemo(() => Object.values(MapModals).find(Modal => Modal.modalType === type), [type])
  const contextProps = useModalProps()

  return ActiveModal && (
    <ModalManager
      {...modalProps}
      {...contextProps}
      Modal={ActiveModal}
      open={visible}
      toggleModal={toggleModal}
    />
  )

}