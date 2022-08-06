
const fromConfig = process.env.GB_NO_VNC_PATH

/**
 * Gets the websocket path for vnc
 */
export const getVncPath = () => {
  return fromConfig || '/novnc'
}