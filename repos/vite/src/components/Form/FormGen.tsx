import type { ComponentProps } from 'react'
import type {
  TFCRow,
  TFCBase,
  TFCItem,
  TFormGen,
  TFCSection,
  TFormContainer,
} from './form.types'
export * from './form.types'

import { Form } from './Form'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { FormLoading } from './FormLoading'
import { InputTypes } from './Inputs/InputTypes'

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
      {...compProps}
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
    config,
    loading,
    loadingProps,
    RootNode=Form,
    containerProps,
    ContainerNode=RenderContainer,
    Loading=(<FormLoading {...loadingProps} />),
  } = props

  const { rows, sections } = config

  return loading
    ? <>{Loading}</>
    : (
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
