import { SidebarCloseWidth, SidebarOpenWidth } from '@GBC/constants/values'

const bNavH = 37
const bUrlH = 28
const bActH = 45

const tTabH = 30
const tHeaderH = 30

const divider = 1
const headerH = 40
const editorTabs = 45
const sectionHeaderH = 40
const raceEditorHeader = 45
const raceSectionHeaderH = 40

const defHeaderH = 35

export const dims = {
  sidebar: {
    panel: {
      header: {
        size: defHeaderH,
        px: `${defHeaderH}px`,
      }
    },
  },
  panel: {
    divider: {
      width: divider,
      wpx: `${divider}px`,
      height: divider,
      hpx: `${divider}px`,
      hover: 3,
      hvrpx: `3px`,
    }
  },
  header: {
    height: headerH,
    hpx: `${headerH}px`,
    avatar: {
      size: 30
    }
  },
  footer: {
    height: 5
  },
  nav: {
    closedWidth: SidebarCloseWidth,
    openWidth: SidebarOpenWidth + SidebarCloseWidth,
  },
  browser: {
    actions: {
      height: bActH,
      hpx: `${bActH}px`,
    },
    nav: {
      height: bNavH,
      hpx: `${bNavH}px`,
    },
    url: {
      height: bUrlH,
      hpx: `${bUrlH}px`,
    }
  },
  terminal: {
    header: {
      height: tHeaderH,
      hpx: `${tHeaderH}px`,
    },
    tab: {
      height: tTabH,
      hpx: `${tTabH}px`,
      maxWpx: `125px`
    }
  },
  defs: {
    header: {
      height: defHeaderH,
      hpx: `${defHeaderH}px`,
    },
    openedHeight: `50%`,
    closedHeight: `${defHeaderH}px`,
  },
  dropdown: {
    header: {
      height: sectionHeaderH,
      px: `${sectionHeaderH}px`,
    }
  },
  editor: {
    tabs: {
      height: editorTabs,
      px: `${editorTabs}px`,
    },
    openedTab: {
      height: editorTabs - 5,
      px: `${editorTabs - 5}px`,
    }
  },
  race: {
    header: {
      zIdx: 5,
      height: {
        size: raceEditorHeader,
        px: `${raceEditorHeader}px`
      }
    },
    section: {
      header: {
        height: raceSectionHeaderH,
        px: `${raceSectionHeaderH}px`,
      }
    }
  },
  trans: {
    avg: `300ms`,
    fastest: `50ms`,
    halfAvg: `150ms`,
    avgEase: `300ms ease`
  }
}