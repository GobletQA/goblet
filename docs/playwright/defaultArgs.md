

## Default Args 
* These are the default args playwright passes to the chrome browser
```sh
--disable-field-trial-config
--disable-background-networking
--enable-features=NetworkService,NetworkServiceInProcess
--disable-background-timer-throttling
--disable-backgrounding-occluded-windows
--disable-back-forward-cache
--disable-breakpad
--disable-client-side-phishing-detection
--disable-component-extensions-with-background-pages
--disable-default-apps
--disable-dev-shm-usage
--disable-extensions
--disable-features=ImprovedCookieControls,LazyFrameLoading,GlobalMediaControls,DestroyProfileOnBrowserClose,MediaRouter,DialMediaRouteProvider,AcceptCHFrame,AutoExpandDetailsElement,CertificateTransparencyComponentUpdater,AvoidUnnecessaryBeforeUnloadCheckSync,Translate
--allow-pre-commit-input
--disable-hang-monitor
--disable-ipc-flooding-protection
--disable-popup-blocking
--disable-prompt-on-repost
--disable-renderer-backgrounding
--disable-sync
--force-color-profile=srgb
--metrics-recording-only
--no-first-run
--password-store=basic
--use-mock-keychain
--no-service-autorun
--export-tagged-pdf
--no-sandbox
--remote-debugging-pipe
```

## Extra Args
* These args are added by Goblet
```sh
--app
--disable-gpu
--start-maximized
--start-fullscreen
--window-position=0,-74
--allow-insecure-localhost
--user-data-dir=/goblet/app/temp/user
--unsafely-treat-insecure-origin-as-secure
```

## Ignored Args
* These args are normally passed by playwright, but Goblet forces them to be ignored
```sh
--enable-automation
```