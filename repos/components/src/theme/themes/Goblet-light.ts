import { colors } from '../colors'

export const lightTheme = {
  base: `vs`,
  inherit: true,
  encodedTokensColors: [],
  rules: [
    {
      foreground: colors.lightEditor.blueGreen,
      token: `string.js`
    },
    {
      token: ``,
      background: colors.white,
      foreground: colors.black13,
    },
    {
      token: `invalid`,
      foreground: colors.lightEditor.redLight
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
      foreground: colors.lightEditor.darkBlue,
    },
    {
      token: `variable.predefined`,
      foreground: colors.lightEditor.bluePastel
    },
    {
      token: `constant`,
      foreground: colors.lightEditor.red
    },
    {
      token: `comment`,
      foreground: colors.lightEditor.green
    },
    {
      token: `number`,
      foreground: colors.lightEditor.greenPastel
    },
    {
      token: `number.hex`,
      foreground: colors.lightEditor.persianBlue
    },
    {
      token: `regexp`,
      foreground: colors.lightEditor.redMaroon
    },
    {
      token: `annotation`,
      foreground: colors.lightEditor.gray
    },
    {
      token: `type`,
      foreground: colors.lightEditor.blueTeal
    },
    {
      token: `delimiter`,
      foreground: colors.black13
    },
    {
      token: `delimiter.html`,
      foreground: colors.lightEditor.grayJet
    },
    {
      token: `delimiter.xml`,
      foreground: colors.lightEditor.blue
    },
    {
      token: `tag`,
      foreground: colors.lightEditor.redMaroon
    },
    {
      token: `tag.id.pug`,
      foreground: colors.lightEditor.blueGray
    },
    {
      token: `tag.class.pug`,
      foreground: colors.lightEditor.blueGray
    },
    {
      token: `meta.scss`,
      foreground: colors.lightEditor.redMaroon
    },
    {
      token: `metatag`,
      foreground: colors.lightEditor.red
    },
    {
      token: `metatag.content.html`,
      foreground: colors.lightEditor.red
    },
    {
      token: `metatag.html`,
      foreground: colors.lightEditor.gray
    },
    {
      token: `metatag.xml`,
      foreground: colors.lightEditor.gray
    },
    {
      token: `metatag.php`,
      fontStyle: `bold`
    },
    {
      token: `key`,
      foreground: colors.lightEditor.chocolate
    },
    {
      token: `string.key.json`,
      foreground: colors.lightEditor.redPastel
    },
    {
      token: `string.value.json`,
      foreground: colors.lightEditor.blueGreen
    },
    {
      token: `attribute.name`,
      foreground: colors.lightEditor.red
    },
    {
      token: `attribute.value`,
      foreground: colors.lightEditor.bluePoly
    },
    {
      token: `attribute.value.number`,
      foreground: colors.lightEditor.greenPastel
    },
    {
      token: `attribute.value.unit`,
      foreground: colors.lightEditor.greenPastel
    },
    {
      token: `attribute.value.html`,
      foreground: colors.lightEditor.blue
    },
    {
      token: `attribute.value.xml`,
      foreground: colors.lightEditor.blue
    },
    {
      token: `string`,
      foreground: colors.lightEditor.blueGreen
    },
    {
      token: `string.html`,
      foreground: colors.lightEditor.blue
    },
    {
      token: `string.sql`,
      foreground: colors.lightEditor.red
    },
    {
      token: `string.yaml`,
      foreground: colors.lightEditor.blueGreen
    },
    {
      token: `keyword`,
      foreground: colors.lightEditor.blue
    },
    {
      token: `keyword.json`,
      foreground: colors.lightEditor.bluePoly
    },
    {
      token: `keyword.flow`,
      foreground: colors.lightEditor.pinkPurple
    },
    {
      token: `keyword.flow.scss`,
      foreground: colors.lightEditor.blue
    },
    {
      token: `operator.scss`,
      foreground: colors.lightEditor.grayDim
    },
    {
      token: `operator.sql`,
      foreground: colors.lightEditor.graySlate
    },
    {
      token: `operator.swift`,
      foreground: colors.lightEditor.grayDim
    },
    {
      token: `predefined.sql`,
      foreground: colors.lightEditor.pinkSteel
    }
  ],
  colors: {
    // TODO: This is a custom property for the Race editor only
    // Not a fan of having a custom property, will need to refactor at some point
    [`race.featureBackground`]: colors.purple00,

    [`editor.border`]: colors.gray01,

    [`editor.background`]: colors.white,
    [`editor.foreground`]: colors.black08,

    [`tab.border`]: colors.white,
    [`tab.activeBorder`]: colors.white,
    [`tab.activeBackground`]: colors.white,
    [`tab.activeForeground`]: colors.black09,
    [`tab.inactiveBackground`]: colors.white01,
    [`tab.inactiveForeground`]: colors.gray11,
    [`tab.unfocusedActiveBorder`]: colors.gray07,
    [`tab.unfocusedActiveForeground`]: colors.gray07,
    [`tab.unfocusedInactiveForeground`]: colors.gray07,

    [`editorGroup.background`]: colors.purple00,
    [`editorGroupHeader.tabsBorder`]: colors.gray00,
    [`editorGroupHeader.tabsBackground`]: colors.purple00,
    [`editorGroupHeader.noTabsBackground`]: colors.purple00,
    
    [`sideBar.border`]: colors.gray00,
    [`sideBar.background`]: colors.white,
    [`sideBarSectionHeader.border`]: colors.gray01,
    [`sideBarSectionHeader.foreground`]: colors.gray07,
    [`sideBarSectionHeader.background`]: colors.white,
    [`statusBarItem.activeBackground`]: colors.white,
    [`statusBarItem.hoverBackground`]: colors.gray00,

    [`list.focusBackground`]: colors.white01,
    [`list.focusForeground`]: colors.gray21,

    [`list.hoverBackground`]: colors.gray00,
    [`list.hoverForeground`]: colors.gray21,

    [`list.inactiveSelectionBackground`]: colors.white,
    [`list.inactiveSelectionForeground`]: colors.gray12,

    [`list.activeSelectionBackground`]: colors.gray01,
    [`list.activeSelectionForeground`]: colors.purple15,

    [`list.highlightForeground`]: colors.purple10,
    [`list.warningForeground`]: colors.yellow10,

    [`list.deemphasizedForeground`]: colors.gray04,
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
    
    [`input.border`]: colors.gray03,
    // [`input.background`]: colors.white00,
    [`input.foreground`]: colors.black19,
    [`input.placeholderForeground`]: colors.white,
    [`input.background`]: colors.lightEditor.whiteBackground,
    // [`inputOption.activeBorder`]: `#8be0fd`,
    // [`inputValidation.errorBorder`]: `#f92672`,
    // [`inputValidation.infoBorder`]: `#ca94ff`,
    
    
  }
}

export {
  lightTheme as default
}