const bNavH = 45
const bUrlH = 40
const headerH = 40
const divider = 10

export const dims = {
  panel: {
    divider: {
      width: divider,
      wpx: `${divider}px`,
      height: divider,
      hpx: `${divider}px`,
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
  }
}