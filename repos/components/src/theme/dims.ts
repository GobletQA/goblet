const bNavH = 37
const bUrlH = 28
const bActH = 35

const tTabH = 30
const tHeaderH = 30

const divider = 1
const headerH = 40

const defHeaderH = 35

export const dims = {
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
    openWidth: 280,
    closedWidth: 50,
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
  }
}