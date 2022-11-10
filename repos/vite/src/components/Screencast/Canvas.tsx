import type { ComponentProps, RefObject } from 'react'
import type { VncScreenHandle } from 'react-vnc/dist/types/lib/VncScreen'

import { VncScreen } from 'react-vnc'
import { Loading } from '@components/Loading'

export type RfbOpts = {
  shared?: boolean;
  credentials?: {
    target?: string;
    username?: string;
    password?: string;
  };
  repeaterID?: string;
  wsProtocols?: string[]
}

export type VNCSrcProps = ComponentProps<typeof VncScreen>
export type VNCSrc = Omit<VNCSrcProps, `rfbOptions`>

export type TCanvas = VNCSrc & {
  rfbOptions?: RfbOpts
  canvasRef?: RefObject<VncScreenHandle>
  // url: string;
  // style?: object;
  // className?: string;
  // viewOnly?: boolean;
  // focusOnClick?: boolean;
  // clipViewport?: boolean;
  // dragViewport?: boolean;
  // scaleViewport?: boolean;
  // resizeSession?: boolean;
  // showDotCursor?: boolean;
  // background?: string;
  // qualityLevel?: number;
  // compressionLevel?: number;
  // autoConnect?: number; // defaults to true
  // retryDuration?: number; // in milliseconds
  // debug?: boolean; // show logs in the console
  // loadingUI?: React.ReactNode; // custom component that is displayed when loading
  // onConnect?: (rfb?: RFB) => void;
  // onDisconnect?: (rfb?: RFB) => void;
  // onCredentialsRequired?: (rfb?: RFB) => void;
  // onSecurityFailure?: (e?: { detail: { status: number, reason: string } }) => void;
  // onClipboard?: (e?: { detail: { text: string } }) => void;
  // onBell?: () => void;
  // onDesktopName?: (e?: { detail: { name: string } }) => void;
  // onCapabilities?: (e?: { detail: { capabilities: RFB["capabilities"] } }) => void;
}

export const Canvas = (props:TCanvas) => {
  const {
    url,
    canvasRef,
    ...rest
  } = props

  return url
    ? (
        <VncScreen
          {...(rest as Omit<VNCSrcProps, 'url'>)}
          url={url}
          ref={canvasRef}
          loadingUI={<Loading />}
        />
      )
    : <Loading />
}