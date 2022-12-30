import type { TGobletTheme } from '@gobletqa/components'
import type { ComponentProps, ComponentType } from 'react'

import Box from '@mui/material/Box'
import MuiStack from '@mui/material/Stack'
import { Text } from '@gobletqa/components'
import { styled } from '@mui/material/styles'

type TGutterComp = ComponentProps<typeof Box> & {
  gutter?:boolean
  theme?:TGobletTheme
}


const gutterComp = (Component:ComponentType<any>, styles:string=``) => {
  return styled(Component, {
    shouldForwardProp: (prop:string) => prop !== 'gutter'
  })(({ theme, gutter }:TGutterComp) => {
      return `
        width: 100%;
        ${styles}
        ${
          gutter
            ? [
                `padding-left: ${theme?.gutter?.padding?.px};`,
                `padding-right: ${theme?.gutter?.padding?.px};`
              ].join(`\n`)
            : ``
        }
      `
  })

}

export const Container = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;

  // Remove this once theme is setup properly
  background-color: #ffffff;
  color: #111111 !important;
`)


export const Body = gutterComp(Box)
export const Stack = gutterComp(MuiStack)

export const Action = styled(Box)``
export const Actions = styled(Box)``
export const HeaderTitle = styled(Text)``
export const Header = gutterComp(Box)


