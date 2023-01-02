import type { ReactNode } from 'react'
import { FromContainer } from './Form.styled'

export type TForm = {
  children:ReactNode
}

export const Form = (props:TForm) => {
  
  const {
    children
  } = props
  
  return (
    <FromContainer>
      {children}
    </FromContainer>
  )
}