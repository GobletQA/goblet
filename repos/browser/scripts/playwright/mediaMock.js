

/**
 * Need to hijack requests and add the correct headers to ensure the video can be played
 */
const mockVideo = (type) => {
  if(mockVideo.init) return

  mockVideo.init = true

  const video = document.createElement(`video`)

  video.setAttribute(`id`, `gobletqa-video-mock`)
  video.setAttribute(`src`, `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`)
  video.setAttribute(`crossorigin`, '')
  video.setAttribute(`controls`, ``)

  video.oncanplay = () => {
    const stream = video.captureStream()
    navigator.mediaDevices.getUserMedia = () => Promise.resolve(stream)
  }

  document.body.appendChild(video)
}

typeof window !== `undefined`
  && window.addEventListener('load', () => mockVideo(`window-load`))

typeof document !== `undefined`
  && (document.onreadystatechange = () => (document.readyState === `complete` && mockVideo(`document-readyState`)))