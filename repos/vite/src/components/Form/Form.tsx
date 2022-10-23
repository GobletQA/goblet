import type { ReactNode } from 'react'
import type { ComponentProps } from 'react'
import { FormContainer as FormContainerMui } from 'react-hook-form-mui'
import { noOpObj, noOp } from '@keg-hub/jsutils'

export type TForm = ComponentProps<typeof FormContainerMui> & {
  children?: ReactNode
  values?: Record<any, any>
  onSuccess?: (data:any) => void
}

export const FormContainer = (props:TForm) => {
  const {
    children,
    values=noOpObj,
    onSuccess=noOp,
    ...rest
  } = props

  return (
    <FormContainerMui
      {...rest}
      onSuccess={onSuccess}
      defaultValues={values}
    >
      {children}
    </FormContainerMui>
  )
}

export const Form  = (props:TForm) => {
  const { children, ...rest } = props
  return (
    <FormContainer {...rest} >
      {children}
    </FormContainer>
  )
}