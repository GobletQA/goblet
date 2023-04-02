import { styled } from '@mui/material/styles'
import { Span, gutter } from '@gobletqa/components'


export const headerCss = {
  textShared: `
    font-size: 14.5px;
    font-weight: bold;
    transition: color 300ms ease;
    color: var(--goblet-list-deemphasizedForeground);
  `,
  textActive: `
    & > .gb-section-dropdown > .gb-dropdown-header .section-header-text-type {
      color: var(--goblet-list-highlightForeground);
    }

    & > .gb-section-dropdown > .gb-dropdown-header .section-header-text-content {
      color: var(--goblet-editor-foreground);
    }
  `
}

export const SectionHeaderText = styled(Span)`
  font-size: 14.5px;
  padding: ${gutter.padding.qpx};
`

export const SectionHeaderType = styled(Span)`
  ${headerCss.textShared}
`
export const SectionHeaderContent = styled(Span)`
  margin-left: 5px;
  ${headerCss.textShared}
`
