
export const Nav = {}

export const SideNav = {
  openWidth: 240,
  closedWidth: 64,
  groups: [
    {
      name: `core-navigation`,
      items: [
        {
          title: `Files`,
          icon: `FileTree`
        },
        {
          title: `Reports`,
          icon: `RuleCheck`
        },
        {
          title: `Artifacts`,
          icon: `Picture`
        },
        {
          title: `Waypoint`,
          icon: `MapPoint`
        },
        {
          title: `World`,
          icon: `Globe`
        },
        {
          title: `Steps`,
          icon: `Steps`,
        },
      ]
    },
    {
      name: `settings`,
      style: {
        bottom: 0,
        position: `absolute`,
      },
      items: [
        {
          title: `Settings`,
          icon: `Settings`
        }
      ]
    }
  ]
}