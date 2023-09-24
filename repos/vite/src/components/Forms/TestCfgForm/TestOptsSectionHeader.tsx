import type { ReactNode } from 'react'

import { useState } from 'react'
import { cls } from '@keg-hub/jsutils'
import {
  TestCfgExpandIcon,
  TestOptsHeaderText,
  TestOptsHeaderTitle,
  TestOptsHeaderContainer,
} from './TestCfgForm.styled'

export type TTestOpts = {
  initial?:boolean
  className?:string
  titleClass?:string
  title?:ReactNode
  onChange?:(state:boolean) => void
}

export const TestOptsSectionHeader = (props:TTestOpts) => {

  const {
    title,
    initial,
    onChange,
    className,
    titleClass,
  } = props

  const onClick = () => {
    const update = !open
    setOpen(update)
    onChange?.(update)
  }

  const [open, setOpen] = useState(initial)

  return (
    <TestOptsHeaderContainer
      onClick={onClick}
      className={cls(className, `gb-test-cfg-header`)}
    >
      <TestOptsHeaderTitle
        className={cls(
          open && `open`,
          titleClass,
          `gb-test-cfg-header-title`
        )}
      >
        <TestCfgExpandIcon expand={open} />
        <TestOptsHeaderText>
          {title}
        </TestOptsHeaderText>
      </TestOptsHeaderTitle>
    </TestOptsHeaderContainer>
  )
}
