import type { ComponentType } from 'react'
import { Modal as ModalCls } from '../../components/Modal'

import { useMemo, useRef } from 'react'

export type THComponentOverride = {
  Modal:ComponentType<any>
}

export const useComponentOverride = (props:THComponentOverride) => {
  const {
    Modal
  } = props

  const modalClsRef = useRef<ModalCls>()

  return useMemo(() => {
    if(!modalClsRef.current)
      modalClsRef.current = new ModalCls(Modal)

    if(modalClsRef.current.Component !== Modal)
      modalClsRef.current.Component = Modal

    return {
      Modal: modalClsRef.current
    }

  }, [Modal])

}