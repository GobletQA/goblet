import { colors } from '../colors'

export const lightTheme = {
  base: `vs`,
  inherit: true,
  encodedTokensColors: [],
  rules: [
    {
      foreground: `#2E879A`,
      token: `string.js`
    },
    {
      token: ``,
      foreground: `000000`,
      background: colors.white
    },
    {
      token: `invalid`,
      foreground: `cd3131`
    },
    {
      token: `emphasis`,
      fontStyle: `italic`
    },
    {
      token: `strong`,
      fontStyle: `bold`
    },
    {
      token: `variable`,
      foreground: `001188`
    },
    {
      token: `variable.predefined`,
      foreground: `4864AA`
    },
    {
      token: `constant`,
      foreground: `dd0000`
    },
    {
      token: `comment`,
      foreground: `008000`
    },
    {
      token: `number`,
      foreground: `098658`
    },
    {
      token: `number.hex`,
      foreground: `3030c0`
    },
    {
      token: `regexp`,
      foreground: `800000`
    },
    {
      token: `annotation`,
      foreground: `808080`
    },
    {
      token: `type`,
      foreground: `008080`
    },
    {
      token: `delimiter`,
      foreground: `000000`
    },
    {
      token: `delimiter.html`,
      foreground: `383838`
    },
    {
      token: `delimiter.xml`,
      foreground: `0000FF`
    },
    {
      token: `tag`,
      foreground: `800000`
    },
    {
      token: `tag.id.pug`,
      foreground: `4F76AC`
    },
    {
      token: `tag.class.pug`,
      foreground: `4F76AC`
    },
    {
      token: `meta.scss`,
      foreground: `800000`
    },
    {
      token: `metatag`,
      foreground: `e00000`
    },
    {
      token: `metatag.content.html`,
      foreground: `FF0000`
    },
    {
      token: `metatag.html`,
      foreground: `808080`
    },
    {
      token: `metatag.xml`,
      foreground: `808080`
    },
    {
      token: `metatag.php`,
      fontStyle: `bold`
    },
    {
      token: `key`,
      foreground: `863B00`
    },
    {
      token: `string.key.json`,
      foreground: `A31515`
    },
    {
      token: `string.value.json`,
      foreground: `#2E879A`
    },
    {
      token: `attribute.name`,
      foreground: `FF0000`
    },
    {
      token: `attribute.value`,
      foreground: `0451A5`
    },
    {
      token: `attribute.value.number`,
      foreground: `098658`
    },
    {
      token: `attribute.value.unit`,
      foreground: `098658`
    },
    {
      token: `attribute.value.html`,
      foreground: `0000FF`
    },
    {
      token: `attribute.value.xml`,
      foreground: `0000FF`
    },
    {
      token: `string`,
      foreground: `#2E879A`
    },
    {
      token: `string.html`,
      foreground: `0000FF`
    },
    {
      token: `string.sql`,
      foreground: `FF0000`
    },
    {
      token: `string.yaml`,
      foreground: `#2E879A`
    },
    {
      token: `keyword`,
      foreground: `0000FF`
    },
    {
      token: `keyword.json`,
      foreground: `0451A5`
    },
    {
      token: `keyword.flow`,
      foreground: `AF00DB`
    },
    {
      token: `keyword.flow.scss`,
      foreground: `0000FF`
    },
    {
      token: `operator.scss`,
      foreground: `666666`
    },
    {
      token: `operator.sql`,
      foreground: `778899`
    },
    {
      token: `operator.swift`,
      foreground: `666666`
    },
    {
      token: `predefined.sql`,
      foreground: `C700C7`
    }
  ],
  colors: {
    [`editor.border`]: colors.gray01,
    [`editor.background`]: colors.white,
    [`editor.foreground`]: colors.black08,

    [`tab.border`]: colors.white,
    [`tab.activeBorder`]: colors.white,
    [`tab.activeBackground`]: colors.white,
    [`tab.activeForeground`]: colors.black09,
    [`tab.inactiveBackground`]: colors.white01,
    [`tab.inactiveForeground`]: colors.gray11,
    [`tab.unfocusedActiveBorder`]: colors.gray06,
    [`tab.unfocusedActiveForeground`]: colors.gray06,
    [`tab.unfocusedInactiveForeground`]: colors.gray06,

    [`editorGroupHeader.tabsBorder`]: colors.gray02,
    [`editorGroupHeader.tabsBackground`]: colors.gray00,
    [`editorGroupHeader.noTabsBackground`]: colors.gray00,
    
    [`sideBar.border`]: colors.gray00,
    [`sideBar.background`]: colors.white,
    [`sideBarSectionHeader.border`]: colors.gray01,
    [`sideBarSectionHeader.foreground`]: colors.gray06,
    [`sideBarSectionHeader.background`]: colors.white,
    [`statusBarItem.activeBackground`]: colors.white,
    [`statusBarItem.hoverBackground`]: colors.gray00,

    [`list.focusBackground`]: colors.gray00,
    [`list.focusForeground`]: colors.gray21,

    [`list.hoverBackground`]: colors.gray00,
    [`list.hoverForeground`]: colors.gray21,

    [`list.inactiveSelectionBackground`]: colors.white,
    [`list.inactiveSelectionForeground`]: colors.gray06,

    [`list.activeSelectionBackground`]: colors.gray01,
    [`list.activeSelectionForeground`]: colors.purple15,

    [`list.highlightForeground`]: colors.purple10,
    [`list.warningForeground`]: colors.yellow10,

    [`list.deemphasizedForeground`]: colors.gray07,
    [`list.errorForeground`]: colors.red10,
    [`list.filterMatchBackground`]: `${colors.purple13}66`,
    [`list.filterMatchBorder`]: `${colors.purple12}66`,
    [`list.focusOutline`]: colors.gray00,
    [`list.invalidItemForeground`]: `${colors.red10}4d`,

    [`errorForeground`]: colors.red10,
    [`editorCursor.foreground`]: colors.purple14,

    [`scrollbar.shadow`]: `${colors.gray07}00`,
    [`scrollbarSlider.background`]: colors.gray03,
    [`scrollbarSlider.hoverBackground`]: colors.gray04,
    [`scrollbarSlider.activeBackground`]: colors.gray05,

    [`selection.background`]: colors.purple12,
  }
}

export {
  lightTheme as default
}