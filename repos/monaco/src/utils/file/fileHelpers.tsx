import { colors } from '@gobletqa/components'

export const toolTipProps = {
  loc: `bottom` as const,
  enterDelay: 500,
  fontSize: `10px`,
  describeChild: true
}

export const styles = {
  name: {
    flex: 1
  },
  row: {
    paddingLeft: `5px`,
    position: `relative`,
  },
  iconFolder: {
    fontSize: `16px`,
    marginRight: `2.5px`,
    color: colors.purple10
  },
  iconFile: {
    fontSize: `16px`,
    marginRight: `2.5px`,
    marginLeft: `14px`,
    color: colors.purple10
  },
  altIcon: {
    fontSize: `16px`,
    marginRight: `2.5px`,
  },
  altIconLast: {
    fontSize: `16px`,
    marginRight: `5px`,
  },
  conflictFolder: {
    color: `#E83333`,
  },
  conflictFile: {
    color: `#E83333`,
    border: `1px solid #E83333`,
  },
}