import type { MutableRefObject } from 'react'
import type { TModalOpts } from '../../components/Modal'

import { useMemo, useRef } from 'react'
import { Modal as ModalCls } from '../../components/Modal'

export type THComponentOverride = {
  Modal:TModalOpts
}

const updateModalMethod = (
  Modal:TModalOpts,
  modalClsRef: MutableRefObject<ModalCls | undefined>,
  method:keyof typeof Modal
) => {
  if(!modalClsRef.current) return
  
  if(Modal?.[method] && modalClsRef?.current?.[method] !== Modal?.[method])
    modalClsRef.current[method] = Modal[method] as any

}

export const useModalActions = (props:THComponentOverride) => {
  const {
    Modal
  } = props

  const modalClsRef = useRef<ModalCls>()
  return useMemo(() => {
    if(!modalClsRef.current) modalClsRef.current = new ModalCls(Modal)

    updateModalMethod(Modal, modalClsRef, `open`)
    updateModalMethod(Modal, modalClsRef, `close`)
    updateModalMethod(Modal, modalClsRef, `confirm`)

    return {
      Modal: modalClsRef.current
    }

  }, [Modal])

}