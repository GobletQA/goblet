import type { ElementType } from 'react'
import { useState, useCallback, Fragment } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { Sidebar } from '../Sidebar'
import { NavList, TNavItemProps } from '../NavList'


const groups = [
  {
    name: 'group 1',
    items: [
      {
        title: 'Group1 - Item 1'
      },
      {
        title: 'Group1 - Item 2'
      },
      {
        title: 'Group1 - Item 3'
      },
    ]
  },
  {
    name: 'group 2',
    items: [
      {
        title: 'Group2 - Item 1'
      },
      {
        title: 'Group2 - Item 2'
      },
      {
        title: 'Group2 - Item 3'
      },
    ]
  },
  {
    name: 'group 3',
    items: [
      {
        title: 'Group3 - Item 1'
      },
      {
        title: 'Group3 - Item 2'
      },
      {
        title: 'Group3 - Item 3'
      },
    ]
  },
]

type TSideNavProps = {
  initialOpen?: boolean
}

type TGroupProps = {
  groups: TGroupItem[]
  toggleDrawer: (...args:any[]) => any
  anchor?: 'top' | 'left' | 'bottom' | 'right'
}

type TGroupItem = {
  name: string
  items: TNavItemProps[]
}

const NavGroups = (props: TGroupProps) => {
  const {
    groups,
    anchor,
    toggleDrawer
  } = props
  
  const groupLength = groups.length - 1
  
  return (
    <Box
      component="div"
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {groups.map((group, index:number) => (
        <Fragment key={group.name}>
          <NavList group={group.name} items={group.items} index={index} />
          {index < groupLength && (<Divider />)}
        </Fragment>
      ))}
    </Box>
  )
}

export const SideNav = (props:TSideNavProps) => {
  const {
    initialOpen
  } = props

  const [open, setOpen] = useState(initialOpen)
  const toggleDrawer = useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    const { type, key } = event as React.KeyboardEvent

    (type !== 'keydown' || (key !== 'Tab' && key !== 'Shift'))
      && setOpen(!open)

  }, [open])
  
  return (
    <Sidebar
      anchor='left'
      initialOpen={initialOpen}
    >
      <NavGroups
        {...props}
        groups={groups}
        toggleDrawer={toggleDrawer}
      />
    </Sidebar>
  )
  
}