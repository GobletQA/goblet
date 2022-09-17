import type { ElementType } from 'react'
import Typography from '@mui/material/Typography'
import AdbIcon from '@mui/icons-material/Adb'

type TLogoProps = {
  href?: string
  title?:string
  mobile?: boolean
  Icon?: ElementType
  styles?: Record<string, Record<string, any> | string>
}

const styles = {
  mobile: {
    icon: { display: { xs: 'flex', md: 'none' }, mr: 1 },
    title: {
      mr: 2,
      display: { xs: 'flex', md: 'none' },
      flexGrow: 1,
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.3rem',
      color: 'inherit',
      textDecoration: 'none',
    }
  },
  main: {
    icon: { display: { xs: 'none', md: 'flex' }, mr: 1 },
    title: {
      mr: 2,
      display: { xs: 'none', md: 'flex' },
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.3rem',
      color: 'inherit',
      textDecoration: 'none',
    }
  }
}

const LogoComp = (props:TLogoProps) => {
  const {
    Icon,
    styles,
    href=`/`,
    title=`GOBLET`
  } = props

  return (
    <>
      {Icon
        ? <Icon sx={styles?.icon} />
        : (<AdbIcon sx={styles?.icon as Record<string, string>} />
      )}
      <Typography
        noWrap
        href={href}
        variant="h6"
        component="a"
        sx={styles?.title as Record<string, string>}
      >
        {title}
      </Typography>
    </>
  )
}

export const Logo = (props:TLogoProps) => {
  return props.mobile
    ? (<LogoComp {...props} styles={styles.mobile} />)
    : (<LogoComp {...props} styles={styles.main} />)
}

