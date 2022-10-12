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

import { omitKeys } from '@keg-hub/jsutils'
import { Form } from './Form'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { FormLoading } from './FormLoading'
import { InputTypes } from './Inputs/InputTypes'

const generateKeys = (props:any, child:TFCItem|TFCSection|TFCRow|TFCBase) => {
  const {
    id,
    name,
    parentKey,
  } = props

  const parent = `${parentKey || ``}-${id || props.path || name || ``}`.trim()
  const childKey = child.id || (child as TFCItem)?.path || (child as TFCItem)?.placeholder || (child as TFCItem)?.label || name || ``
  const key = childKey && `${parent}-${childKey}`

  return { key, parentKey: key || `-${parent}` }
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
      {items && items.map((item) => {
        const {key, ...rest} = generateKeys(props, item)
        return (
          <RenderItem
            {...rest}
            {...item}
            key={key || item.key}
          />
        )
      })}
      {sections && sections.map((section) => (
        <RenderSection
          {...generateKeys(props, section)}
          {...omitKeys(section, [`key`])}
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
          {...omitKeys(item, [`key`])}
        />
      ))}
      {rows && rows.map((row) => (
        <RenderRow
          {...generateKeys(props, row)}
          {...omitKeys(row, [`key`])} />
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
                {...omitKeys(section, [`key`])}
              />
            ))}
            {rows && rows.map((row) => (
              <RenderRow
                {...generateKeys(config, row)}
                {...omitKeys(row, [`key`])} />
            ))}
          </ContainerNode>
        </RootNode>
      )
}
