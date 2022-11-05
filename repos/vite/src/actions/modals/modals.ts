import type { TModalProps } from './setActiveModal'

import { ModalTypes } from '@constants'
import { setActiveModal } from './setActiveModal'


export const repoModal = (props?:TModalProps) => setActiveModal(ModalTypes.repo, props?.visible, props)
export const signInModal = (props?:TModalProps) => setActiveModal(ModalTypes.signIn, props?.visible, props)
export const connectModal = (props?:TModalProps) => setActiveModal(ModalTypes.connect, props?.visible, props)
export const confirmModal = (props?:TModalProps) => setActiveModal(ModalTypes.confirm, props?.visible, props)
export const settingsModal = (props?:TModalProps) => setActiveModal(ModalTypes.settings, props?.visible, props)
