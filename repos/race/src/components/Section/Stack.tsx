
import type { ReactNode, ComponentProps, CSSProperties } from 'react'

import { ESectionType } from '@GBR/types'
import { exists, cls } from '@keg-hub/jsutils'
import { StackContainer, StackContent, StackBody } from './Section.styled'

export type TStack = {
  body?:boolean
  gutter?:boolean
  sx?:CSSProperties
  type:ESectionType
  className?:string
  children?: ReactNode
  stack?:number|boolean
  bodySx?:CSSProperties
  stackSx?:CSSProperties
  stackProps?:ComponentProps<typeof StackContent>
}

const styles = {
  section: {
    padding: '0px',
  },
  body: {
    
  },
  stack: {
    
  }
}

export const Stack = (props:TStack) => {

  const {
    sx,
    type,
    body,
    stack,
    gutter,
    bodySx,
    stackSx,
    children,
    className,
    stackProps,
  } = props

  return (
    <StackContainer
      className={cls('gr-section-stack', className)}
      sx={[styles?.section, sx] as CSSProperties[]}
    >
      {
        body
          ? (
              <StackBody
                gutter={gutter}
                className='gr-stack-body'
                sx={[styles?.body, bodySx] as CSSProperties[]}
              >
                {children}
              </StackBody>
            )
          : exists(stack) || stackProps
            ? (
                <StackContent
                  spacing={stack}
                  {...stackProps}
                  gutter={gutter}
                  children={children}
                  className='gr-section-stack'
                  sx={[stackSx, styles?.stack]}
                />
              )
            : children
      }
    </StackContainer>
  )
}