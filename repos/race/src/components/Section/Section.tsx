import type { ComponentProps, CSSProperties } from 'react'
import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'

import { SectionBody } from './SectionBody'
import { exists, cls } from '@keg-hub/jsutils'
import { SectionHeader } from './SectionHeader'
import { Container, Stack } from './Section.styled'

export type TSection = TSectionBody & Omit<TSectionHeader, `title`> & {
  body?:boolean
  title?:string
  gutter?:boolean
  header?:boolean
  sx?:CSSProperties
  stack?:number|boolean
  bodySx?:CSSProperties
  stackSx?:CSSProperties
  headerSx?:CSSProperties
  variant?:`outlined`|`filled`|`standard`
  stackProps?:ComponentProps<typeof Stack>
}

const styles = {
  section: {
    padding: '0px',
  },
  header: {
    
  },
  body: {
    
  },
  stack: {
    
  }
}

export const Section = (props:TSection) => {

  const {
    sx,
    type,
    body,
    title,
    stack,
    gutter,
    bodySx,
    header,
    variant,
    actions,
    stackSx,
    headerSx,
    children,
    className,
    stackProps,
  } = props

  return (
    <Container
      className={cls('gr-section', className)}
      sx={[styles?.section, sx] as CSSProperties[]}
    >

      {(header && (title || actions) && (
        <SectionHeader
          type={type}
          gutter={gutter}
          variant={variant}
          actions={actions}
          title={title || ``}
          sx={[styles?.header, headerSx] as CSSProperties[]}
        />
      )) || null}

      {
        body
          ? (
              <SectionBody
                type={type}
                gutter={gutter}
                children={children}
                sx={[styles?.body, bodySx] as CSSProperties[]}
              />
            )
          : exists(stack) || stackProps
            ? (
                <Stack
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
    </Container>
  )
}