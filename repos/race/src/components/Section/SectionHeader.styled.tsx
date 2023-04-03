import { styled } from '@mui/material/styles'
import { Span, gutter } from '@gobletqa/components'


export const headerCss = {
  textShared: `
    font-size: 14.5px;
    font-weight: bold;
    transition: color 300ms ease, opacity 300ms ease;
    color: var(--goblet-list-deemphasizedForeground);
  `,
  textActive: `
    & > .gb-section-dropdown {
      & > .gb-dropdown-header {
        & .gb-section-header-text-type {
          color: var(--goblet-list-highlightForeground);
          opacity: 1;
        }
        & .gb-section-header-text-content {
          color: var(--goblet-editor-foreground);
          opacity: 1;
        }
        & .gb-section-header-text-exp {
          opacity: 1;
        }
      }
    }
  `
}

export const SectionHeaderText = styled(Span)`
  font-size: 14.5px;
  padding: ${gutter.padding.qpx};
`

export const SectionHeaderType = styled(Span)`
  ${headerCss.textShared}
  opacity: 0.8;
  margin-right: 5px;
`

export const SectionHeaderContent = styled(Span)`
  ${headerCss.textShared}
`
