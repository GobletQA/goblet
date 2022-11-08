import { noOpObj } from '@keg-hub/jsutils'
import { UpdateModalEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { createContext, useEffect, useState, memo } from 'react'

export type TModalProvider = {
  children: any
}

export type TModalActions = {
  text?: string
  type?: string
  action?: (...args:any[]) => any
}

export type TModalEvtProps = {
  title: string
  content?: any
  className?: string
  actions: TModalActions
  onOk?: (...args:any[]) => any
  onCancel?: (...args:any[]) => any,
}

const ModalChild = memo((props:TModalProvider) => {
  return (<>{props.children}</>)
})

/**
 * Create modal provider, and add event listener for updating the props
 */
export const ModalContext = createContext({})

export const ModalProvider = (props:TModalProvider) => {

  const [modalProps, setModalProps] = useState(noOpObj)

  useEffect(() => {
    EE.on<TModalEvtProps>(UpdateModalEvt, setModalProps, UpdateModalEvt)

    return () => {
      EE.off<TModalEvtProps>(UpdateModalEvt, UpdateModalEvt)
    }
  }, [])

  return (
    <ModalContext.Provider value={modalProps}>
      <ModalChild {...props} />
    </ModalContext.Provider>
  )

}