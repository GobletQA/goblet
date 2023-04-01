
import type {
  ReactNode,
  ComponentProps,
  CSSProperties,
  ForwardedRef,
  MutableRefObject
} from 'react'

import { forwardRef } from 'react'
import { ESectionType } from '@GBR/types'
import { exists, cls } from '@keg-hub/jsutils'
import { StackContainer, StackContent, StackBody } from './Stack.styled'

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
  contentRef?:MutableRefObject<HTMLElement|undefined>
}

const styles = {
  section: {
    padding: `0px`,
    height: `100%`
  },
  body: {
    
  },
  stack: {
    
  }
}

export const Stack = forwardRef((props:TStack, ref:ForwardedRef<HTMLElement|undefined>) => {

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
    contentRef,
    stackProps,
  } = props

  return (
    <StackContainer
      ref={ref}
      className={cls('gb-section-stack', className)}
      sx={[styles?.section, sx] as CSSProperties[]}
    >
      {
        body
          ? (
              <StackBody
                ref={contentRef}
                gutter={gutter}
                className='gb-stack-body'
                sx={[styles?.body, bodySx] as CSSProperties[]}
              >
                {children}
              </StackBody>
            )
          : exists(stack) || stackProps
            ? (
                <StackContent
                  ref={contentRef}
                  spacing={stack}
                  {...stackProps}
                  gutter={gutter}
                  children={children}
                  sx={[stackSx, styles?.stack]}
                  className='gb-section-stack-content'
                />
              )
            : children
      }
    </StackContainer>
  )
})