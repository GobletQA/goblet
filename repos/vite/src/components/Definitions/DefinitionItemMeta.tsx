import type { TDefinitionMetaExpression, TDefGroupItem } from '@types'
import Box from '@mui/material/Box'
import { Text } from '@components/Text'
import {
  DefItemMeta,
  DefMetaTitle,
  DefMetaItemWrap,
  DefMetaItemPair,
  DefMetaItemText,
  DefMetaItemTitle,
  DefMetaItemExpWrap,
  DefMetaExpItemWrap,
} from './Definitions.styled'

export type TDefinitionItemMeta = {
  item:TDefGroupItem
}

export type TMetaData = {
  examples?:string[]
  description?:string
  expressions?:TDefinitionMetaExpression[]
}


const MetaDescription = (props:TMetaData) => {
  const { description } = props

  return description && (
    <DefMetaItemWrap className='goblet-def-meta-description' >
      <DefMetaItemPair>
        <DefMetaTitle>
          Description
        </DefMetaTitle>
        <DefMetaExpItemWrap>
          <DefMetaItemText className='goblet-def-meta-description-text' >
            {description}
          </DefMetaItemText>
        </DefMetaExpItemWrap>
      </DefMetaItemPair>
    </DefMetaItemWrap>
  ) || null
}

const MetaExpressions = (props:TMetaData) => {
  const { expressions } = props

  return expressions?.length && (
    <DefMetaItemExpWrap className='goblet-def-meta-expressions' >

      <DefMetaTitle>
        Expressions
      </DefMetaTitle>

      {expressions.map((expression, idx) => {
        const spacer = idx === expressions.length - 1 ? `0px` : `10px`
        
        const { type, example, description } = expression
        return (
          <DefMetaExpItemWrap
            key={description}
            marginBottom={spacer}
            className='goblet-def-meta-expression'
          >
            {type && (
              <DefMetaItemPair>
                <DefMetaItemTitle>
                  type:
                </DefMetaItemTitle>
                <DefMetaItemText>
                  {type}
                </DefMetaItemText>
              </DefMetaItemPair>
            ) || null}
            {example && (
              <DefMetaItemPair>
                <DefMetaItemTitle>
                  example:
                </DefMetaItemTitle>
                <DefMetaItemText>
                  {example}
                </DefMetaItemText>
              </DefMetaItemPair>
            ) || null}
            {description && (
              <DefMetaItemPair>
                <DefMetaItemTitle>
                  description:
                </DefMetaItemTitle>
                <DefMetaItemText>
                  {description}
                </DefMetaItemText>
              </DefMetaItemPair>
            ) || null}
          </DefMetaExpItemWrap>
        )
      })}
    </DefMetaItemExpWrap>
  ) || null
}

const MetaExamples = (props:TMetaData) => {
  const { examples } = props

  return examples?.length && (
    <DefMetaItemWrap className='goblet-def-meta-examples' >
      <DefMetaTitle>
        Examples
      </DefMetaTitle>

      {examples.map((example) => {
        return (
          <DefMetaExpItemWrap
            key={example}
            className='goblet-def-meta-example'
          >
            <DefMetaItemText>
              {example}
            </DefMetaItemText>
          </DefMetaExpItemWrap>
        )
      })}
    </DefMetaItemWrap>
  ) || null
}

export const DefinitionItemMeta = (props:TDefinitionItemMeta) => {
  const { meta } = props.item
  const { description, expressions, examples } = meta

  return (
    <DefItemMeta className='goblet-def-item-meta' >
      <MetaDescription description={description} />
      <MetaExamples examples={examples} />
      <MetaExpressions expressions={expressions} />
    </DefItemMeta>
  )
}
