import { exec, ExecException } from 'child_process'

/**
apt-get update && apt-get install openbox wmctrl menu -y

openbox &

openbox &
wmctrl -l
wmctrl -lx

wmctrl -r [ChromeWindowTitle] -b add,fullscreen
wmctrl -r ':ACTIVE:' -b toggle,fullscreen


wmctrl -r "Chromium" -b toggle,fullscreen

supervisord -n -c configs/supervisord.local.conf

supervisorctl -c configs/supervisord.local.conf shutdown all

 */

export const wmctrlFullScreen = () => {
  return new Promise((res) => (
    exec(
      `wmctrl -r "Chromium" -b toggle,fullscreen`,
      (err:ExecException, out:string) => res(out)
    )
  ))
}