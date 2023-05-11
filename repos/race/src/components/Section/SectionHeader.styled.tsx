import { styled } from '@mui/material/styles'
import { dims, Span, gutter, colors } from '@gobletqa/components'


export const headerCss = {
  textShared: `
    opacity: 0.8;
    font-size: 14px;
    font-weight: bold;
    transition: color ${dims.trans.avgEase}, opacity ${dims.trans.avgEase};
  `,
  textActive: `
    & > .gb-section-dropdown {
      & > .gb-dropdown-header {

        & .gb-section-header-chunk {
          opacity: 1;
        }
      }
    }
  `
}

export const SectionHeaderText = styled(Span)`
  font-size: 14px;
  padding: ${gutter.padding.qpx};
`

export const SectionHeaderType = styled(Span)`
  ${headerCss.textShared}
  margin-right: 5px;
  color: var(--goblet-list-highlightForeground);
`

export const SectionHeaderContent = styled(Span)`
  ${headerCss.textShared}
  color: var(--goblet-editor-foreground);

  &.gb-section-header-part-general {
    color: ${colors.green13}
  }

`
