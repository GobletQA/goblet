import type { ComponentType } from 'react'


export type TModalCreate = {
  target?: any
  title: string
  className: string
  onOk: (...args:any[]) => any
  content: (...args:any[]) => any
}

export type TModalConfirm = {
  target?: any,
  title: string,
  okText: string,
  cancelText: string,
  onCancel: (...args:any[]) => any,
  onOk: (...args:any[]) => any,
  content: (...args:any[]) => any,
}

export class Modal {
  
  Component:ComponentType<any>
  
  constructor(ModalComp:ComponentType<any>){
    this.Component = ModalComp
  }

  create = (params:TModalCreate) => {
    
  }

  confirm = (params:TModalConfirm) => {
    
    console.log(`------- confirm -------`)
    
  }

} 

