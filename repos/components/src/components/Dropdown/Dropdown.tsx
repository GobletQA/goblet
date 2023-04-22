import type { AccordionProps } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'
import type { CSSProperties, ReactNode, ComponentType } from 'react'

import {
  useState,
  useEffect,
  forwardRef,
  useCallback,
} from 'react'

import { colors } from '@GBC/theme'
import { useInline } from '@GBC/hooks'
import Slide from '@mui/material/Slide'
import { emptyObj, cls, exists } from '@keg-hub/jsutils'
import { HeaderText, Body, Container, Header } from './Dropdown.styled'
import { ExpandIcon as ExpandIconComp } from '@GBC/components/Icons/ExpandIcon'

export type TDropdown = Omit<AccordionProps, `children`|`onChange`> & {
  id:string
  Body?:ReactNode
  Header?:ReactNode
  disabled?:boolean
  noToggle?:boolean
  noHeader?:boolean
  expanded?:boolean
  actions?:ReactNode
  children?:ReactNode
  headerText?:ReactNode
  bodySx?:CSSProperties
  headerSx?:CSSProperties
  transformIconOn?:number
  showExpandIcon?:boolean
  transformIconOff?:number
  headerTextSx?:CSSProperties
  expandIconSx?:CSSProperties
  headerContentSx?:CSSProperties
  ExpandIcon?:ComponentType<any>
  onChange?:(expanded: boolean) => void
}

type TTransition = TransitionProps & { children: React.ReactElement<any, any> }

const styles = {
  icon: { color: colors.gray08 }
}

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
    noHeader,
    disabled,
    expanded,
    headerText,
    headerTextSx,
    expandIconSx,
    Body:BodyComp,
    showExpandIcon,
    transformIconOn,
    transformIconOff,
    headerContentSx,
    children=BodyComp,
    Header:HeaderComp,
    onChange:onChangeCB,
    TransitionProps=emptyObj,
    ExpandIcon=ExpandIconComp,
    ...rest
  } = props

  const inlineCB = useInline<(expanded: boolean) => void>(onChangeCB)
  const [localExpand, setLocalExpanded] = useState<boolean>(expanded || false)

  const onChange = useCallback((_: any, newExpanded?: boolean) => {
    if(disabled || noToggle) return

    const updated = exists<boolean>(newExpanded) ? newExpanded : !localExpand

    updated !== localExpand && setLocalExpanded(updated)
    updated !== expanded && inlineCB?.(updated)

  }, [expanded, disabled, noToggle, localExpand])

  useEffect(() => {
    const noOutsideUpdate = !exists<boolean>(expanded) || expanded === localExpand

    if(noOutsideUpdate) return

    onChange(emptyObj, expanded)
  }, [expanded, localExpand])

  return (
    <Container
      elevation={0}
      square={true}
      onChange={onChange}
      expanded={localExpand}
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
      {noHeader !== false && (
        <Header
          id={`${id}-header`}
          transformOn={transformIconOn}
          className='gb-dropdown-header'
          transformOff={transformIconOff}
          aria-controls={`${id}-content`}
          sx={[headerSx, { [`& .MuiAccordionSummary-content`]: headerContentSx }] as CSSProperties[]}
          expandIcon={
            showExpandIcon === false || noToggle
              ? null
              : (
                  <ExpandIcon
                    expand={expanded}
                    noIconTransform={true}
                    sx={[expandIconSx, styles.icon] as CSSProperties[]}
                    className={cls(`gb-dropdown-expand-icon`, expanded && `expanded`)}
                  />
                )
          }
        >
          {
            HeaderComp
              ?? (headerText && (<HeaderText sx={headerTextSx} >{headerText}</HeaderText>))
              ?? null
          }
          {actions}
        </Header>
      )}
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