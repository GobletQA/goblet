import type { CSSProperties, ComponentProps, MouseEvent } from 'react'

import { useMemo } from 'react'
import { isStr } from '@keg-hub/jsutils'
import {
  ToggleGrp,
  ToggleBtn,
  ToggleWrap,
  ToggleLabel,
  ToggleContainer,
} from './Inputs.styled'

type TToggleOpt = {
  value:string
  text:string
}

export type TOnToggle = (event: MouseEvent<HTMLElement>, value:string) => void

export type TToggle = {
  color?:string
  label?:string
  exclusive?:boolean
  onChange?:TOnToggle
  value?: string|TToggleOpt
  options:string[]|TToggleOpt[]
  sx?:CSSProperties
  labelSx?:CSSProperties
  toggleSx?:CSSProperties
  toggleGrpSx?:CSSProperties
}

export const Toggle = (props:TToggle) => {
  const {
    sx,
    label,
    value,
    labelSx,
    toggleSx,
    toggleGrpSx,
    options,
    onChange,
    ...rest
  } = props

  const curVal = useMemo(() => {
    const val = value || options[0]
    return isStr(val) ? val : val?.value
  }, [value, options])

  return (
    <ToggleContainer
      sx={sx}
      className='gb-toggle-container'
    >
      {label && (
        <ToggleLabel
          sx={labelSx}
          className='gb-toggle-label'
        >
          {label}
        </ToggleLabel>
      ) || null}
      <ToggleWrap>
        <ToggleGrp
          exclusive
          value={curVal}
          color='primary'
          sx={toggleGrpSx}
          onChange={onChange}
          aria-label="Platform"
          className='gb-toggle-group'
          {...rest as ComponentProps<typeof ToggleGrp>}
        >
          {options.map(opt => {
            const [val, text] = isStr(opt)
              ? [opt, opt]
              : [opt.value, opt.text]
            
            return (
              <ToggleBtn
                value={val}
                sx={toggleSx}
                key={`${val}-${text}`}
                className={`gb-toggle-btn gb-toggle-btn-${val}`}
              >
                {text}
              </ToggleBtn>
            )
          })}
        </ToggleGrp>
      </ToggleWrap>
    </ToggleContainer>
  )
}