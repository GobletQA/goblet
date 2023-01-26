import type { TFormFooter } from '@GBC/types'
import type { CSSProperties, ReactNode, ComponentType, ComponentProps } from 'react'

import { forwardRef } from 'react'
import {
  FormMain,
  FormContainer,
  FormFooterContainer,
  FormHeaderContainer,
} from './Form.styled'

export type TForm = ComponentProps<typeof FormContainer> & {
  children?: ReactNode
  bodySx?: CSSProperties
  headerSx?: CSSProperties
  footerSx?: CSSProperties
  footerProps?:TFormFooter
  containerSx?: CSSProperties
  Footer?:ComponentType<any>
  Header?:ComponentType<any>
  headerProps?:Record<any, any>
}

export const Form = forwardRef<HTMLFormElement, TForm>((props:TForm, ref) => {
  const {
    bodySx,
    headerSx,
    footerSx,
    containerSx,
    Header,
    footerProps,
    headerProps,
    Footer,
    children,
    ...rest
  } = props

  return (
    <FormMain className='gb-form-container' sx={containerSx} >
      {Header && (
        <FormHeaderContainer className='gb-form-header' sx={headerSx} >
          {<Header {...headerProps } />}
        </FormHeaderContainer>
      )}
      <FormContainer className='gb-form-body' sx={bodySx} {...rest} ref={ref}>
        {children}
      </FormContainer>
      {Footer && (
        <FormFooterContainer className='gb-form-footer' sx={footerSx} >
          {<Footer {...footerProps } />}
        </FormFooterContainer>
      )}
    </FormMain>
  )
})
