import { useContext } from 'react'
import { ModalContext } from './ModalContext'


export const useModalProps = () => {
  return useContext(ModalContext)
}