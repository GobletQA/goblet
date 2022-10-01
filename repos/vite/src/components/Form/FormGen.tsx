import type { ComponentProps } from 'react'
import { Form } from './Form'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { InputTypes } from './InputTypes'

export type TFCBase = {
  id?: string
  key?: string
  name?: string
  parentKey?: string
}

export type TFCRulePattern = {
  value: string,
  message: string
}

export type TFCRule = {
  required?: boolean,
  pattern?: TFCRulePattern
}

export type TFCItem<T=Record<any, any>> = TFCBase & {
  label?: string
  itemProps?: T
  rules?: TFCRule
  type: keyof typeof InputTypes
}

export type TFCRow<T=ComponentProps<typeof Grid>> = TFCBase & {
  rowProps?: T
  RowNode?: any
  size?: number
  items?: TFCItem[]
  sections?: TFCSection[]
}

export type TFCSection<T=ComponentProps<typeof Paper>> = TFCBase & {
  rows?: TFCRow[]
  items?: TFCItem[]
  sectionProps?: T,
  SectionNode?: any,
  parentKey?: string
}


export type TFConfig = TFCBase & {
  rows?: TFCRow[]
  sections?: TFCSection[]
}

// R=extends React.FC<any> | React.ComponentClass<any>
export type TFormContainer = ComponentProps<typeof Grid>

export type TFormGen = {
  RootNode?: any
  ContainerNode?: any
  containerProps?:TFormContainer
  config: TFConfig
}


const generateKeys = (props:TFCBase, child:TFCBase) => {
  const {
    id,
    name,
    parentKey,
  } = props

  const parent = `${parentKey || ``}-${id || props.key || name || ``}`.trim()
  const full = `${parent}-${child.id || child.key || name || ``}`

  return {
    key: full,
    parentKey: full
  }
}

const RenderItem = (props:TFCItem) => {
  const { type, label, name, parentKey, rules, ...itemProps } = props
  const Comp = InputTypes[type]
  const compProps = itemProps as ComponentProps<typeof Comp>
  return (
    // @ts-ignore
    <Comp
      label={label || name}
      {...itemProps}
    />
  )
}

const RenderRow = (props:TFCRow) => {
  const {
    items,
    size=12,
    rowProps,
    sections,
    RowNode=Grid,
  } = props

  return (
    <RowNode item xs={size} {...rowProps} >
      {items && items.map((item) => (
        <RenderItem
          {...generateKeys(props, item)}
          {...item}
        />
      ))}
      {sections && sections.map((section) => (
        <RenderSection
          {...generateKeys(props, section)}
          {...section}
        />
      ))}
    </RowNode>
  )
}

const RenderSection = (props:TFCSection) => {
  const {
    id,
    rows,
    items,
    sectionProps,
    SectionNode=Paper,
  } = props
  return (
    <SectionNode
      id={id}
      elevation={0}
      {...sectionProps}
    >
      {items && items.map((item) => (
        <RenderItem
          {...generateKeys(props, item)}
          {...item}
        />
      ))}
      {rows && rows.map((row) => (
        <RenderRow
          {...generateKeys(props, row)}
          {...row} />
      ))}
    </SectionNode>
  )
}

const RenderContainer = (props:TFormContainer) => {
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...props}
    />
  )
}

export const FormGen = (props:TFormGen) => {
  const {
    RootNode=Form,
    containerProps,
    ContainerNode=RenderContainer,
    config
  } = props

  const { rows, sections } = config

  return (
    <RootNode>
      <ContainerNode {...containerProps} >
        {sections && sections.map((section) => (
          <RenderSection
            {...generateKeys(config, section)}
            {...section}
          />
        ))}
        {rows && rows.map((row) => (
          <RenderRow
            {...generateKeys(config, row)}
            {...row} />
        ))}
      </ContainerNode>
    </RootNode>
  )
}