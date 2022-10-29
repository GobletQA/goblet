
export type TModalAction = {
  text?: string
  type?: string
  action?: (...args:any[]) => any
}

export type TModalActions = TModalAction[]

export type TModalCreate = {
  title: string
  className?: string
  actions: TModalActions
  content?: any
  onOk?: (...args:any[]) => any
  onCancel?: (...args:any[]) => any,
}

export type TModalConfirm = {
  title: string,
  content?: any,
  className?: string
  actions?: TModalActions
  onOk?: (...args:any[]) => any,
  onCancel?: (...args:any[]) => any,
}

export type TModalOpts = {
  openModal: (...args:any[]) => any
  closeModal: (...args:any[]) => any
  confirmModal?: (...args:any[]) => any
}

const wrapActions = (modal:Modal, actions:TModalActions) => {
  return actions.map((act) => {
    const { action, ...rest } = act
    return {
      ...act,
      action: (...args:any) => {
        const resp = action?.(...args)
        modal.closeModal?.(resp, ...args)
      }
    }
  })
}

export class Modal {
  openModal: (...args:any[]) => any
  closeModal: (...args:any[]) => any
  confirmModal?: (...args:any[]) => any

  constructor(modalConf:TModalOpts){
    const {
      openModal,
      closeModal,
      confirmModal=openModal
    } = modalConf

    this.openModal = openModal
    this.closeModal = closeModal
    this.confirmModal = confirmModal
  }

  create = (params:TModalCreate) => {
    this.openModal({
      ...params,
      actions: wrapActions(this, params.actions || [])
    })
  }

  confirm = (params:TModalConfirm) => {
    this.confirmModal?.({
      ...params,
      actions: wrapActions(this, params.actions || [])
    })
  }

} 

