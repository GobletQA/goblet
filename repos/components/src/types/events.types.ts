import type { Dispatch, SetStateAction, ComponentProps } from 'react'
import type { Alert } from '@GBC/components/Alert'

export type TAlertProps = Partial<ComponentProps<typeof Alert>>

export type TResizeSideBarEvent = {
  size?: number
  toggle?:boolean
}


export type TAlertToggle = {
  open?:boolean
  props?: TAlertProps
}

export type TOnAlertEvt = {
  open:boolean
  canceled?:boolean
  confirmed?:boolean
  setOpen:Dispatch<SetStateAction<boolean>>
}

export type TOnAlertOpen = TAlertProps