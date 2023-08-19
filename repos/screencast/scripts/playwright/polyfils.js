
/**
 * Adds a `playing` field to the `HTMLMediaElement` `prototype`
 * This allows us to easily validate if the video/audio is playing or not
 */
typeof HTMLMediaElement.prototype.playing === 'undefined'
  && (
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      get: function(){
        return !!(
          this.currentTime > 0
            && !this.paused
            && !this.ended
            && this.readyState > 2
        )
      }
    })
  )


// console.log(`---- SETTING BROWSER FULL SCREEN... ----`)
// document.documentElement.requestFullscreen()
