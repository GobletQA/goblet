import type { AccordionProps } from '@mui/material'
import type { CSSProperties, ReactNode, ComponentType } from 'react'
import type { TransitionProps } from '@mui/material/transitions'

import { forwardRef, useState, useCallback } from 'react'

import { useInline } from '@GBC/hooks'
import Slide from '@mui/material/Slide'
import { TrashIcon } from '../Icons/TrashIcon'
import { IconButton } from '../Buttons/IconButton'
import { emptyObj, cls } from '@keg-hub/jsutils'
import { ExpandIcon as ExpandIconComp } from '@GBC/components/Icons'
import { HeaderText, Body, Container, Header } from './Dropdown.styled'

export type TDropdown = Omit<AccordionProps, `children`> & {
  id:string
  body?:ReactNode
  header?:ReactNode
  actions?:ReactNode
  children?:ReactNode
  headerText?:ReactNode
  disabled?:boolean
  initialExpand?:boolean
  bodySx?:CSSProperties
  headerSx?:CSSProperties
  headerTextSx?:CSSProperties
  expandIconSx?:CSSProperties
  headerContentSx?:CSSProperties
  noIconTransform?: boolean
  onChange?:(expanded: boolean) => void
  ExpandIcon?:ComponentType<typeof ExpandIconComp>
}

type TTransition = TransitionProps & { children: React.ReactElement<any, any> }

const Transition = forwardRef((props: TTransition, ref: React.Ref<unknown>) => (
  <Slide
    direction="down"
    ref={ref}
    {...props}
  />
))

export const Dropdown = (props:TDropdown) => {
  const {
    id,
    body,
    bodySx,
    actions,
    headerSx,
    disabled,
    headerText,
    headerTextSx,
    expandIconSx,
    children=body,
    headerContentSx,
    noIconTransform,
    header:headerComp,
    onChange:onChangeCB,
    initialExpand=false,
    TransitionProps=emptyObj,
    ExpandIcon=ExpandIconComp,
    ...rest
  } = props

  const [expanded, setExpanded] = useState<boolean>(initialExpand)

  const inlineCB = useInline(onChangeCB)

  const onChange = useCallback((event: React.SyntheticEvent, newExpanded: boolean) => {
    if(disabled) return

    const updated = !expanded
    inlineCB?.(updated)
    setExpanded(updated)
  }, [expanded, disabled])

  return (
    <Container
      elevation={0}
      square={true}
      onChange={onChange}
      expanded={expanded}
      disableGutters={true}
      {...rest}
      className={cls(
        `gc-dropdown`,
        expanded && `expanded`,
        disabled && `disabled`,
        rest.className,
      )}
      TransitionProps={{
        ...TransitionProps,
        unmountOnExit: true,
      }}
    >
      <Header
        id={`${id}-header`}
        className='gc-dropdown-header'
        aria-controls={`${id}-content`}
        noIconTransform={noIconTransform}
        sx={[headerSx, { [`& .MuiAccordionSummary-content`]: headerContentSx }] as CSSProperties[]}
        expandIcon={(
          // @ts-ignore
          <ExpandIcon
            sx={expandIconSx}
            expand={expanded}
            noIconTransform={noIconTransform}
            className={cls(`gr-dropdown-expand-icon`, expanded && `expanded`)}
          />
        )}
      >
        {headerComp || (<HeaderText sx={headerTextSx} >{headerText}</HeaderText>)}
        {actions}
      </Header>
      <Body
        sx={bodySx}
        className='gc-dropdown-body'
      >
        {children}
      </Body>
    </Container>
  )
}