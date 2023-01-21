import type { TFormFooter } from '@GBC/types'
import type { ReactNode, ComponentType, ComponentProps } from 'react'

import { forwardRef } from 'react'
import {
  FormMain,
  FormContainer,
  FormFooterContainer,
  FormHeaderContainer,
} from './Form.styled'

export type TForm = ComponentProps<typeof FormContainer> & {
  Footer?:ComponentType<any>
  Header?:ComponentType<any>
  children?: ReactNode
  headerProps?:Record<any, any>
  footerProps?:TFormFooter
}

export const Form = forwardRef<HTMLFormElement, TForm>((props:TForm, ref) => {
  const {
    Header,
    footerProps,
    headerProps,
    Footer,
    children,
    ...rest
  } = props

  return (
    <FormMain>
      {Header && (
        <FormHeaderContainer>
          {<Header {...headerProps } />}
        </FormHeaderContainer>
      )}
      <FormContainer {...rest} ref={ref}>
        {children}
      </FormContainer>
      {Footer && (
        <FormFooterContainer>
          {<Footer {...footerProps } />}
        </FormFooterContainer>
      )}
    </FormMain>
  )
})
