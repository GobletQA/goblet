import type { ComponentProps, CSSProperties } from 'react'
import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'

import { SectionBody } from './SectionBody'
import { exists, cls } from '@keg-hub/jsutils'
import { SectionHeader } from './SectionHeader'
import { Container, Stack } from './Section.styled'

type TSectionStyles = {
  section?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  stack?: CSSProperties
}

export type TSection = TSectionBody & Omit<TSectionHeader, `title`> & {
  body?:boolean
  title?:string
  gutter?:boolean
  header?:boolean
  sx?:CSSProperties
  stack?:number|boolean
  styles?:TSectionStyles
  variant?:`outlined`|`filled`|`standard`
  stackProps?:ComponentProps<typeof Stack>
}

export const Section = (props:TSection) => {

  const {
    sx,
    type,
    body,
    title,
    stack,
    styles,
    gutter,
    header,
    variant,
    actions,
    children,
    className,
    stackProps,
  } = props

  return (
    <Container
      className={cls('gr-section', className)}
      sx={[sx as CSSProperties, styles?.section as CSSProperties]}
    >

      {(header && (title || actions) && (
        <SectionHeader
          type={type}
          gutter={gutter}
          variant={variant}
          actions={actions}
          title={title || ``}
          sx={styles?.header}
        />
      )) || null}

      {
        body
          ? (
              <SectionBody
                type={type}
                gutter={gutter}
                sx={styles?.body}
                children={children}
              />
            )
          : exists(stack) || stackProps
            ? (
                <Stack
                  spacing={stack}
                  {...stackProps}
                  gutter={gutter}
                  sx={styles?.stack}
                  children={children}
                  className='gr-section-stack'
                />
              )
            : children
      }
    </Container>
  )
}