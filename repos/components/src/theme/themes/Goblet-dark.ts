import { colors } from '../colors'

export const darkTheme = {
  inherit: true,
  base: `vs-dark`,
  encodedTokensColors: [],
  rules: [
    {
      token: ``,
      foreground: colors.white00,
      background: colors.black19,
    },
    {
      token: `invalid`,
      foreground: colors.red08
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
      foreground: `74B0DF`
    },
    {
      token: `variable.predefined`,
      foreground: `4864AA`
    },
    {
      token: `variable.parameter`,
      foreground: colors.darkEditor.green
    },
    {
      token: `constant`,
      foreground: `569CD6`
    },
    {
      foreground: `#828C9C`,
      fontStyle: `italic`,
      token: `comment`
    },
    {
      token: `number`,
      foreground: colors.green08
    },
    {
      token: `number.hex`,
      foreground: `5BB498`
    },
    {
      token: `regexp`,
      foreground: `B46695`
    },
    {
      token: `annotation`,
      foreground: `cc6666`
    },
    {
      token: `type`,
      foreground: `3DC9B0`
    },
    {
      token: `delimiter`,
      foreground: `DCDCDC`
    },
    {
      token: `delimiter.html`,
      foreground: `808080`
    },
    {
      token: `delimiter.xml`,
      foreground: `808080`
    },
    {
      token: `tag`,
      foreground: `569CD6`
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
      foreground: `A79873`
    },
    {
      token: `meta.tag`,
      foreground: `CE9178`
    },
    {
      token: `metatag`,
      foreground: `DD6A6F`
    },
    {
      token: `metatag.content.html`,
      foreground: colors.darkEditor.green
    },
    {
      token: `metatag.html`,
      foreground: `569CD6`
    },
    {
      token: `metatag.xml`,
      foreground: `569CD6`
    },
    {
      token: `metatag.php`,
      fontStyle: `bold`
    },
    {
      token: `key`,
      foreground: colors.darkEditor.green
    },
    {
      token: `string.key.json`,
      foreground: colors.darkEditor.green
    },
    {
      token: `string.value.json`,
      foreground: colors.darkEditor.purple
    },
    {
      token: `string.js`,
      foreground: colors.darkEditor.purple,
    },
    {
      token: `attribute.name`,
      foreground: colors.darkEditor.green
    },
    {
      token: `attribute.value`,
      foreground: `CE9178`
    },
    {
      token: `attribute.value.number.css`,
      foreground: colors.green08
    },
    {
      token: `attribute.value.unit.css`,
      foreground: colors.green08
    },
    {
      token: `attribute.value.hex.css`,
      foreground: `D4D4D4`
    },
    {
      token: `string`,
      foreground: colors.darkEditor.purple
    },
    {
      token: `string.quote`,
      foreground: colors.darkEditor.orange,
    },
    {
      token: `string.sql`,
      foreground: `FF0000`
    },
    {
      token: `keyword`,
      foreground: `569CD6`
    },
    {
      token: `keyword.flow`,
      foreground: `C586C0`
    },
    {
      token: `keyword.json`,
      foreground: `CE9178`
    },
    {
      token: `keyword.flow.scss`,
      foreground: `569CD6`
    },
    {
      foreground: colors.yellow10,
      token: `keyword`
    },
    {
      foreground: colors.gray05,
      token: `delimiter.parenthesis.js`
    },
    {
      foreground: colors.gray05,
      token: `delimiter.bracket.js`
    },
    {
      foreground: colors.gray05,
      token: `delimiter.square.js`
    },
    {
      token: `operator.scss`,
      foreground: `909090`
    },
    {
      token: `operator.sql`,
      foreground: `778899`
    },
    {
      token: `operator.swift`,
      foreground: `909090`
    },
    {
      token: `predefined.sql`,
      foreground: `FF00FF`
    },
  ],
  colors: {
    [`editor.border`]: colors.black10,
    [`editor.background`]: colors.purple23,
    [`editor.foreground`]: colors.white00,

    [`tab.border`]: colors.purple23,
    [`tab.activeBorder`]: colors.purple03,
    [`tab.activeBackground`]: colors.purple23,
    [`tab.activeForeground`]: colors.purple00,
    [`tab.inactiveBackground`]: colors.black10,
    [`tab.inactiveForeground`]: colors.gray06,
    [`tab.unfocusedActiveBorder`]: colors.purple02,
    [`tab.unfocusedActiveForeground`]: colors.purple02,
    [`tab.unfocusedInactiveForeground`]: colors.purple02,

    // [`editorGroup.background`]: colors.black09,
    [`editorGroupHeader.tabsBorder`]: colors.black10,
    [`editorGroupHeader.tabsBackground`]: colors.black09,
    [`editorGroupHeader.noTabsBackground`]: colors.black09,

    [`sideBar.border`]: colors.black09,
    [`sideBar.background`]: colors.purple23,
    [`sideBarSectionHeader.border`]: colors.purple23,
    [`sideBarSectionHeader.background`]: colors.purple23,
    [`sideBarSectionHeader.foreground`]: colors.purple02,
    [`statusBarItem.activeBackground`]: colors.black09,
    [`statusBarItem.hoverBackground`]: colors.black09,


    [`list.focusBackground`]: colors.black09,
    [`list.focusForeground`]: colors.purple02,

    [`list.hoverBackground`]: colors.black09,
    [`list.hoverForeground`]: colors.purple02,

    [`list.inactiveSelectionForeground`]: colors.gray08,
    [`list.inactiveSelectionBackground`]: colors.purple19,

    [`list.activeSelectionBackground`]: colors.black09,
    [`list.activeSelectionForeground`]: colors.purple00,

    [`list.highlightForeground`]: colors.purple10,
    [`list.warningForeground`]: colors.yellow10,

    [`list.deemphasizedForeground`]: colors.red10,
    [`list.errorForeground`]: colors.red10,
    [`list.filterMatchBackground`]: `${colors.purple13}66`,
    [`list.filterMatchBorder`]: `${colors.purple11}66`,
    [`list.focusOutline`]: colors.purple18,
    [`list.invalidItemForeground`]: `${colors.red10}4d`,

    [`errorForeground`]: colors.red10,
    [`editorCursor.foreground`]: colors.purple03,

    [`scrollbar.shadow`]: `#${colors.purple19}00`,
    [`scrollbarSlider.background`]: `${colors.purple13}66`,
    [`scrollbarSlider.hoverBackground`]: `${colors.purple13}99`,
    [`scrollbarSlider.activeBackground`]: `${colors.purple13}b3`,

    [`selection.background`]: colors.purple12,


    // All other colors are not included in the light theme
    [`activityBar.activeBorder`]: colors.purple03,
    [`activityBar.background`]: colors.purple23,
    [`activityBar.border`]: colors.purple23,
    [`activityBar.foreground`]: `${colors.purple02}cc`,
    [`activityBar.inactiveForeground`]: `${colors.purple02}99`,
    [`activityBarBadge.background`]: colors.purple03,
    [`activityBarBadge.foreground`]: colors.yellow16,
    [`badge.background`]: `${colors.purple03}33`,
    [`badge.foreground`]: colors.purple03,
    [`button.background`]: colors.purple03,
    [`button.foreground`]: colors.yellow16,
    [`button.hoverBackground`]: colors.yellow11,
    [`button.secondaryBackground`]: `${colors.purple02}33`,
    [`button.secondaryForeground`]: colors.purple00,
    [`button.secondaryHoverBackground`]: `${colors.purple02}80`,
    [`debugConsoleInputIcon.foreground`]: colors.purple03,
    [`debugExceptionWidget.background`]: colors.purple20,
    [`debugExceptionWidget.border`]: colors.purple19,
    [`debugIcon.breakpointDisabledForeground`]: `${colors.yellow05}80`,
    [`debugIcon.breakpointForeground`]: colors.yellow05,
    [`debugToolBar.background`]: colors.purple20,
    [`descriptionForeground`]: colors.purple02,
    [`diffEditor.diagonalFill`]: colors.purple19,
    [`diffEditor.insertedTextBackground`]: `#7fd9621f`,
    [`diffEditor.removedTextBackground`]: `${colors.red08}1f`,
    [`dropdown.background`]: colors.purple21,
    [`dropdown.border`]: `${colors.purple02}45`,
    [`dropdown.foreground`]: colors.purple02,
    [`editor.findMatchBackground`]: colors.purple11,
    [`editor.findMatchBorder`]: colors.purple11,
    [`editor.findMatchHighlightBackground`]: `${colors.purple11}66`,
    [`editor.findMatchHighlightBorder`]: `${colors.purple13}66`,
    [`editor.findRangeHighlightBackground`]: `#6c598040`,
    [`editor.inactiveSelectionBackground`]: `#409fff21`,
    [`editor.lineHighlightBackground`]: `#131721`,
    [`editor.rangeHighlightBackground`]: `#6c598033`,
    [`editor.selectionBackground`]: `#409fff4d`,
    [`editor.selectionHighlightBackground`]: `#7fd96226`,
    [`editor.selectionHighlightBorder`]: `#7fd96200`,
    [`editor.snippetTabstopHighlightBackground`]: `#7fd96233`,
    [`editor.wordHighlightBackground`]: `#73b8ff14`,
    [`editor.wordHighlightBorder`]: `#73b8ff80`,
    [`editor.wordHighlightStrongBackground`]: `#7fd96214`,
    [`editor.wordHighlightStrongBorder`]: `#7fd96280`,
    [`editorBracketMatch.background`]: `#6c73804d`,
    [`editorBracketMatch.border`]: `#6c73804d`,
    [`editorCodeLens.foreground`]: `#acb6bf8c`,
    [`editorError.foreground`]: colors.red10,
    [`editorGroup.background`]: colors.purple20,
    [`editorGroup.border`]: colors.purple19,
    [`editorGutter.addedBackground`]: `#7fd962cc`,
    [`editorGutter.deletedBackground`]: `${colors.red08}cc`,
    [`editorGutter.modifiedBackground`]: `#73b8ffcc`,
    [`editorHoverWidget.background`]: colors.purple20,
    [`editorHoverWidget.border`]: colors.purple19,
    [`editorIndentGuide.activeBackground`]: `#6c738080`,
    [`editorIndentGuide.background`]: `#6c738033`,
    [`editorLineNumber.activeForeground`]: `#6c7380e6`,
    [`editorLineNumber.foreground`]: `#6c738099`,
    [`editorLink.activeForeground`]: colors.purple03,
    [`editorMarkerNavigation.background`]: colors.purple20,
    [`editorOverviewRuler.addedForeground`]: `#7fd962`,
    [`editorOverviewRuler.border`]: colors.purple19,
    [`editorOverviewRuler.bracketMatchForeground`]: `#6c7380b3`,
    [`editorOverviewRuler.deletedForeground`]: colors.red08,
    [`editorOverviewRuler.errorForeground`]: colors.red10,
    [`editorOverviewRuler.findMatchForeground`]: colors.purple11,
    [`editorOverviewRuler.modifiedForeground`]: `#73b8ff`,
    [`editorOverviewRuler.warningForeground`]: colors.purple03,
    [`editorOverviewRuler.wordHighlightForeground`]: `#73b8ff66`,
    [`editorOverviewRuler.wordHighlightStrongForeground`]: `#7fd96266`,
    [`editorRuler.foreground`]: `#6c738033`,
    [`editorSuggestWidget.background`]: colors.purple20,
    [`editorSuggestWidget.border`]: colors.purple19,
    [`editorSuggestWidget.highlightForeground`]: colors.purple03,
    [`editorSuggestWidget.selectedBackground`]: colors.purple18,
    [`editorWarning.foreground`]: colors.purple03,
    [`editorWhitespace.foreground`]: `#6c738099`,
    [`editorWidget.background`]: colors.purple20,
    [`editorWidget.border`]: colors.purple19,
    [`extensionButton.prominentBackground`]: colors.purple03,
    [`extensionButton.prominentForeground`]: colors.yellow16,
    [`extensionButton.prominentHoverBackground`]: colors.yellow11,
    [`focusBorder`]: `${colors.purple03}b3`,
    [`foreground`]: colors.purple02,
    [`gitDecoration.conflictingResourceForeground`]: `#ff0000`,
    [`gitDecoration.deletedResourceForeground`]: `${colors.red08}b3`,
    [`gitDecoration.ignoredResourceForeground`]: `${colors.purple02}80`,
    [`gitDecoration.modifiedResourceForeground`]: `#73b8ffb3`,
    [`gitDecoration.submoduleResourceForeground`]: `#d2a6ffb3`,
    [`gitDecoration.untrackedResourceForeground`]: `#7fd962b3`,
    [`icon.foreground`]: colors.purple02,
    [`input.background`]: colors.purple21,
    [`input.border`]: `${colors.purple02}45`,
    [`input.foreground`]: colors.purple00,
    [`input.placeholderForeground`]: `${colors.purple02}80`,
    [`inputOption.activeBackground`]: `${colors.purple03}33`,
    [`inputOption.activeBorder`]: `${colors.purple03}4d`,
    [`inputOption.activeForeground`]: colors.purple03,
    [`inputValidation.errorBackground`]: colors.purple21,
    [`inputValidation.errorBorder`]: colors.red10,
    [`inputValidation.infoBackground`]: colors.purple23,
    [`inputValidation.infoBorder`]: `#39bae6`,
    [`inputValidation.warningBackground`]: colors.purple23,
    [`inputValidation.warningBorder`]: `#ffb454`,
    [`keybindingLabel.background`]: `${colors.purple02}1a`,
    [`keybindingLabel.border`]: `${colors.purple00}1a`,
    [`keybindingLabel.bottomBorder`]: `${colors.purple00}1a`,
    [`keybindingLabel.foreground`]: colors.purple00,
    [`listFilterWidget.background`]: colors.purple20,
    [`listFilterWidget.noMatchesOutline`]: colors.red10,
    [`listFilterWidget.outline`]: colors.purple03,
    [`minimap.background`]: colors.purple23,
    [`minimap.errorHighlight`]: colors.red10,
    [`minimap.findMatchHighlight`]: colors.purple11,
    [`minimap.selectionHighlight`]: `#409fff4d`,
    [`minimapGutter.addedBackground`]: `#7fd962`,
    [`minimapGutter.deletedBackground`]: colors.red08,
    [`minimapGutter.modifiedBackground`]: `#73b8ff`,
    [`panel.background`]: colors.purple23,
    [`panel.border`]: colors.purple19,
    [`panelTitle.activeBorder`]: colors.purple03,
    [`panelTitle.activeForeground`]: colors.purple00,
    [`panelTitle.inactiveForeground`]: colors.purple02,
    [`peekView.border`]: colors.purple18,
    [`peekViewEditor.background`]: colors.purple20,
    [`peekViewEditor.matchHighlightBackground`]: `${colors.purple11}66`,
    [`peekViewEditor.matchHighlightBorder`]: `${colors.purple13}66`,
    [`peekViewResult.background`]: colors.purple20,
    [`peekViewResult.fileForeground`]: colors.purple00,
    [`peekViewResult.lineForeground`]: colors.purple02,
    [`peekViewResult.matchHighlightBackground`]: `${colors.purple11}66`,
    [`peekViewResult.selectionBackground`]: colors.purple18,
    [`peekViewTitle.background`]: colors.purple18,
    [`peekViewTitleDescription.foreground`]: colors.purple02,
    [`peekViewTitleLabel.foreground`]: colors.purple00,
    [`pickerGroup.border`]: colors.purple19,
    [`pickerGroup.foreground`]: `${colors.purple02}80`,
    [`progressBar.background`]: colors.purple03,
    [`settings.headerForeground`]: colors.purple00,
    [`settings.modifiedItemIndicator`]: `#73b8ff`,
    [`sideBarTitle.foreground`]: colors.purple02,
    [`statusBar.background`]: colors.purple23,
    [`statusBar.border`]: colors.purple23,
    [`statusBar.debuggingBackground`]: colors.yellow05,
    [`statusBar.debuggingForeground`]: colors.purple21,
    [`statusBar.foreground`]: colors.purple02,
    [`statusBar.noFolderBackground`]: colors.purple20,
    [`statusBarItem.prominentBackground`]: colors.purple19,
    [`statusBarItem.prominentHoverBackground`]: `#00000030`,
    [`statusBarItem.remoteBackground`]: colors.purple03,
    [`statusBarItem.remoteForeground`]: colors.yellow16,
    [`terminal.ansiBlack`]: colors.purple19,
    [`terminal.ansiBlue`]: `#53bdfa`,
    [`terminal.ansiBrightBlack`]: `#686868`,
    [`terminal.ansiBrightBlue`]: `#59c2ff`,
    [`terminal.ansiBrightCyan`]: `#95e6cb`,
    [`terminal.ansiBrightGreen`]: `#aad94c`,
    [`terminal.ansiBrightMagenta`]: `#d2a6ff`,
    [`terminal.ansiBrightRed`]: `#f07178`,
    [`terminal.ansiBrightWhite`]: `#ffffff`,
    [`terminal.ansiBrightYellow`]: `#ffb454`,
    [`terminal.ansiCyan`]: `#90e1c6`,
    [`terminal.ansiGreen`]: `#7fd962`,
    [`terminal.ansiMagenta`]: `#cda1fa`,
    [`terminal.ansiRed`]: `#ea6c73`,
    [`terminal.ansiWhite`]: `#c7c7c7`,
    [`terminal.ansiYellow`]: `#f9af4f`,
    [`terminal.background`]: colors.purple23,
    [`terminal.foreground`]: colors.purple00,
    [`textBlockQuote.background`]: colors.purple20,
    [`textLink.activeForeground`]: colors.purple03,
    [`textLink.foreground`]: colors.purple03,
    [`textPreformat.foreground`]: colors.purple00,
    [`titleBar.activeBackground`]: colors.purple23,
    [`titleBar.activeForeground`]: colors.purple00,
    [`titleBar.border`]: colors.purple23,
    [`titleBar.inactiveBackground`]: colors.purple23,
    [`titleBar.inactiveForeground`]: colors.purple02,
    [`tree.indentGuidesStroke`]: `#6c738080`,
    [`walkThrough.embeddedEditorBackground`]: colors.purple20,
    [`welcomePage.buttonBackground`]: `${colors.purple03}66`,
    [`welcomePage.progress.background`]: `#131721`,
    [`welcomePage.tileBackground`]: colors.purple23,
    [`widget.shadow`]: `#00000080`
  },
}


export {
  darkTheme as default
}