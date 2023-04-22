import { Stack } from '../Section'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { colors, gutter, BlockIcon, dims, H3, H4, Text } from '@gobletqa/components'

const { race } = dims

export const FeatureStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== `parentPath`
})(({ theme }) => {
  return `
    padding: 0px ${gutter.padding.hpx};
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;

    background: linear-gradient(90deg, var(--goblet-editorGroup-background) 23px, transparent 1%) center, linear-gradient(var(--goblet-editorGroup-background) 23px, transparent 1%) center, var(--goblet-editor-border);

    background-size: 25px 25px;
    scrollbar-gutter: stable both-edges;

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar {
      width: 0px !important;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    
    & > .gb-section-stack-content {
      height: fit-content;
      padding-bottom: 100px;
    }

    &.gb-feature-empty > .gb-section-stack-content {
      height: 100%;
    }
  ` 
})

export const FeatureContent = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const FeatureHeaderContainer = styled(Box)`
  top: 0;
  display: flex;
  position: sticky;
  align-items: center;
  margin-top: 0;
  z-index: ${race.header.zIdx};
  justify-content: space-between;
  margin-left: -${gutter.margin.px};
  margin-right: -${gutter.margin.px};
  min-height: ${race.header.height.px};
  max-height: ${race.header.height.px};
  background-color: var(--goblet-tab-activeBackground);
  border-bottom: 1px solid var(--goblet-editorGroupHeader-tabsBorder);

  // box-shadow: 0px -1px 5px -1px rgba(0,0,0,0.2);
`

export const FeatureMenuContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`
export const FeatureActionBtn = styled(Button)`
  padding: 4px 8px;
  width: auto;
  min-width: initial;
  border-radius: 0px;
  border-left: 1px solid var(--goblet-sideBar-border);

  color: ${colors.gray08};
  transition: color 300ms ease;
  
  &:hover {
    color: ${colors.purple10};
  }

  &:first-of-type {
    border-left: none;
  }
  
  > span {
    margin-left: auto;
    margin-right: auto;
  }

  & .MuiButton-startIcon {
    margin-right: ${gutter.margin.qpx};
  }
`

export const HeaderText = styled(H3)`
  flex-grow: 1;
  font-size: 16px;
  padding-left: 20px;
  color: var(--goblet-editor-foreground);
`

export const EmptyFeatureContent = styled(Box)`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
`

export const EmptyFeatureTextContainer = styled(Box)`
  width: 100%;
  margin-left: ${gutter.margin.dpx};
  margin-right: ${gutter.margin.dpx};
  padding: ${gutter.padding.dpx};
  padding-bottom: ${gutter.padding.dpx};
  padding-top: ${gutter.padding.size * 3}px;
`

export const EmptyFeatureHeaderText = styled(H4)`
  display: flex;
  font-size: 20px;
  text-align: center;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: ${gutter.padding.hpx};
  color: var(--goblet-tab-inactiveForeground);
`

export const EmptyFeatureText = styled(Text)`
  width: 100%;
  font-size: 16px;
  text-align: center;
  color: var(--goblet-editor-foreground);
`

export const EmptyFeatureIcon = styled(BlockIcon)`
  margin-right: 5px;
  // color: ${colors.cardinal};
`