import React from 'react'
import { CmdOutput } from './cmdOutput'
import { Aside } from 'HKComponents/aside'
import { ReCmdSurface } from './cmd.restyle'

const asideProps = {
  to: 0,
  type: 'spring',
  location: 'right',
  sidebarWidth: `60vw`,
  config: {
    speed: 20,
    bounciness: 1,
  },
  styles: {
    container: {
      minHeight: '90vh',
    },
  },
}

export const AsideCmdOutput = props => {
  // TODO: Add listener for browser window side
  // When it changes, need to also change the asideProps to match

  return (
    <Aside {...asideProps}>
      <ReCmdSurface
        capitalize={false}
        className={`cmd-main`}
        prefix={`Test Output`}
        title={props?.activeFile?.name}
      >
        <CmdOutput activeFile={props.activeFile} />
      </ReCmdSurface>
    </Aside>
  )
}
