import type { AccordionProps } from '@mui/material'
import type { CSSProperties, ReactNode, ComponentType } from 'react'
import type { TransitionProps } from '@mui/material/transitions'

import { forwardRef, useState, useCallback } from 'react'

import { useInline } from '@GBC/hooks'
import Slide from '@mui/material/Slide'
import { emptyObj, cls } from '@keg-hub/jsutils'
import { HeaderText, Body, Container, Header } from './Dropdown.styled'
import { ExpandIcon as ExpandIconComp } from '@GBC/components/Icons/ExpandIcon'

export type TDropdown = Omit<AccordionProps, `children`> & {
  id:string
  Body?:ReactNode
  Header?:ReactNode
  disabled?:boolean
  noToggle?:boolean
  actions?:ReactNode
  children?:ReactNode
  headerText?:ReactNode
  initialExpand?:boolean
  bodySx?:CSSProperties
  headerSx?:CSSProperties
  transformIconOn?:number
  transformIconOff?:number
  headerTextSx?:CSSProperties
  expandIconSx?:CSSProperties
  headerContentSx?:CSSProperties
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
    bodySx,
    actions,
    headerSx,
    noToggle,
    disabled,
    headerText,
    headerTextSx,
    expandIconSx,
    Body:BodyComp,
    transformIconOn,
    transformIconOff,
    headerContentSx,
    children=BodyComp,
    Header:HeaderComp,
    onChange:onChangeCB,
    initialExpand=false,
    TransitionProps=emptyObj,
    ExpandIcon=ExpandIconComp,
    ...rest
  } = props

  const [expanded, setExpanded] = useState<boolean>(initialExpand)

  const inlineCB = useInline(onChangeCB)

  const onChange = useCallback((event: React.SyntheticEvent, newExpanded: boolean) => {
    if(disabled || noToggle) return

    const updated = !expanded
    inlineCB?.(updated)
    setExpanded(updated)
  }, [expanded, disabled, noToggle])

  return (
    <Container
      elevation={0}
      square={true}
      onChange={onChange}
      expanded={expanded}
      disableGutters={true}
      {...rest}
      className={cls(
        `gb-dropdown`,
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
        transformOn={transformIconOn}
        className='gb-dropdown-header'
        transformOff={transformIconOff}
        aria-controls={`${id}-content`}
        sx={[headerSx, { [`& .MuiAccordionSummary-content`]: headerContentSx }] as CSSProperties[]}
        expandIcon={
          noToggle
            ? (<></>)
            : (
                // @ts-ignore
                <ExpandIcon
                  sx={expandIconSx}
                  expand={expanded}
                  noIconTransform={true}
                  className={cls(`gb-dropdown-expand-icon`, expanded && `expanded`)}
                />
              )
        }
      >
        {HeaderComp ?? (headerText && (<HeaderText sx={headerTextSx} >{headerText}</HeaderText>)) ?? null}
        {actions}
      </Header>
    {children && (
      <Body
        sx={bodySx}
        className='gb-dropdown-body'
      >
        {children}
      </Body>
    ) || null}
    </Container>
  )
}