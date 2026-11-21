# Pasar Pagi Adventure

An English practice game for Indonesian primary-school children (CEFR Pre-A1 to A2), set in a morning market. It runs as an installable web app: add it to a tablet's home screen and it opens full-screen, works offline, and keeps progress on the device.

## Install on an Android tablet

1. Open the game's address in **Chrome**.
2. Tap the **⋮** menu, then **Add to home screen** → **Install**.
3. Open it from the new watermelon icon. After the first open it works without internet.

Progress is stored in the tablet's browser storage for this app. It survives closing the app and restarting the tablet. It is lost if the app is uninstalled or Chrome's site data for this address is cleared.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole game (HTML, CSS, JS in one file) |
| `manifest.webmanifest` | App name, icon, colours, full-screen mode |
| `sw.js` | Offline cache. Bump `VERSION` when you change `index.html` |
| `icons/` | Watermelon app icon (192, 512, 180, 32 px) |

## Updating

Edit `index.html`, change `VERSION` in `sw.js`, commit and push. On the tablet, open the app twice: the first open downloads the update in the background, and the second open shows it.
