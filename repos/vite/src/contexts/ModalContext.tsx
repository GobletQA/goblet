import { useContext } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { UpdateModalEvt } from '@constants'
import { EE } from '@services/sharedService'
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
export const ModalContext = createContext<Record<string, any>>({})

export const useModalProps = () => {
  return useContext(ModalContext)
}

export const ModalProvider = (props:TModalProvider) => {

  const [modalProps, setModalProps] = useState<Record<string, any>>(noOpObj)

  useEffect(() => {
    const off = EE.on<TModalEvtProps>(UpdateModalEvt, setModalProps)

    return () => {
      off?.()
    }
  }, [])

  return (
    <ModalContext.Provider value={modalProps}>
      <ModalChild {...props} />
    </ModalContext.Provider>
  )

}
