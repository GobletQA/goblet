import type { TModalProps } from './setActiveModal'

import { EModalTypes } from '@types'
import { setActiveModal } from './setActiveModal'

export const signInModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.signIn,
  props?.visible,
  props
)
export const connectModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.connect,
  props?.visible,
  props
)
export const confirmModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.confirm,
  props?.visible,
  props
)
export const settingsModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.settings,
  props?.visible,
  props
)
export const artifactsModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.artifacts,
  props?.visible,
  props
)
export const environmentsModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.environments,
  props?.visible,
  props
)
export const idleModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.idle,
  props?.visible,
  props
)
export const waitingModal = (props?:TModalProps) => setActiveModal(
  EModalTypes.waiting,
  props?.visible,
  props
)

