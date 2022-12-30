import type { ReactNode } from 'react'
import type { AccordionProps } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'

import { forwardRef } from 'react'
import Slide from '@mui/material/Slide'
import { H5 } from '@GBC/components/Text'
import { emptyObj } from '@keg-hub/jsutils'
import { ExpandMoreIcon } from '@GBC/components/Icons'
import { Body, Container, Header } from './Dropdown.styled'

export type TDropdown = AccordionProps & {
  id:string
  body?:ReactNode
  header?:ReactNode
  children?:ReactNode
  expandIcon?:ReactNode
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
    header,
    children=body,
    TransitionProps=emptyObj,
    expandIcon=(<ExpandMoreIcon />),
    ...rest
  } = props
  
  return (
    <Container
      elevation={0}
      square={true}
      disableGutters={true}
      className='gc-dropdown'
      {...rest}
      TransitionProps={{
        ...TransitionProps,
        unmountOnExit: true,
      }}
    >
      <Header
        id={`${id}-header`}
        expandIcon={expandIcon}
        className='gc-dropdown-header'
        aria-controls={`${id}-content`}
      >
        <H5>
          {header}
        </H5>
      </Header>
      <Body className='gc-dropdown-body' >
        {children}
      </Body>
    </Container>
  )
}