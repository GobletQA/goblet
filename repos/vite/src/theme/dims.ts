const tTabH = 26
const tHeaderH = 30
const bNavH = 35
const bUrlH = 30
const headerH = 40
const divider = 1
const defHeaderH = 40

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
    openWidth: 350,
    closedWidth: 50,
  },
  browser: {
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