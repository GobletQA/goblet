import type { TDefinitionMetaExpression, TDefGroupItem } from '@types'

import {
  DefItemMeta,
  DefMetaTitle,
  DefMetaItemWrap,
  DefMetaItemPair,
  DefMetaItemText,
  DefMetaItemTitle,
  DefMetaItemExpWrap,
  DefMetaExpItemWrap,
} from './DefinitionList.styled'

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
    <DefMetaItemWrap className='gb-def-meta-description' >
      <DefMetaItemPair>
        <DefMetaTitle>
          Description
        </DefMetaTitle>
        <DefMetaExpItemWrap>
          <DefMetaItemText className='gb-def-meta-description-text' >
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
    <DefMetaItemExpWrap className='gb-def-meta-expressions' >

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
            className='gb-def-meta-expression'
          >
            {type && (
              <DefMetaItemPair className='gb-defs-expression-type' >
                <DefMetaItemTitle>
                  type:
                </DefMetaItemTitle>
                <DefMetaItemText>
                  {type}
                </DefMetaItemText>
              </DefMetaItemPair>
            ) || null}
            {example && (
              <DefMetaItemPair className='gb-defs-expression-example' >
                <DefMetaItemTitle>
                  example:
                </DefMetaItemTitle>
                <DefMetaItemText>
                  {example}
                </DefMetaItemText>
              </DefMetaItemPair>
            ) || null}
            {description && (
              <DefMetaItemPair className='gb-defs-expression-description' >
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
    <DefMetaItemWrap className='gb-def-meta-examples' >
      <DefMetaTitle>
        Examples
      </DefMetaTitle>

      {examples.map((example) => {
        return (
          <DefMetaExpItemWrap
            key={example}
            className='gb-def-meta-example'
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
    <DefItemMeta className='gb-def-item-meta' >
      <MetaDescription description={description} />
      <MetaExamples examples={examples} />
      <MetaExpressions expressions={expressions} />
    </DefItemMeta>
  )
}
