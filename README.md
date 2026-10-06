# terraPen Camera Plot

Point your phone camera at something and turn it into pen-plotter line art in real time, then save an SVG ready for the terraPen (or any plotter).

**Live page:** https://warderoid-ctrl.github.io/terrapen-camera-plot/

## Use it

1. Open the live page on your phone and tap the shutter button to start the camera. Allow camera access when asked.
2. Pick a style (Waves, Hatch, Spiral, Dots). The plot updates as you move the phone.
3. Tap the shutter to freeze the frame, and again to resume.
4. Tap the download button to save the SVG. It's sized in millimetres for the paper you chose.

No camera permission? The camera button beside the shutter opens your camera app instead, and the picture button loads an image from your gallery.

## Install as an app

It's a Progressive Web App, so it installs from the browser with no app store:

- **Android (Chrome):** open the page, then tap **Install** when prompted, or open the settings sheet and tap **Install Camera Plot**.
- **iPhone / iPad (Safari):** tap **Share**, then **Add to Home Screen**.
- **Desktop (Chrome / Edge):** click the install icon in the address bar.

Once installed it opens full screen, has its own icon, works offline and keeps your settings. Updates arrive automatically the next time it opens with a connection.

## Gestures

| On the picture    | Does                         |
| ----------------- | ---------------------------- |
| Drag left / right | Line spacing                 |
| Drag up / down    | Contrast                     |
| Pinch             | Zoom in to check the lines   |
| Double-tap        | Zoom in 3×, or back out      |
| Tap               | Hide or show all controls    |

Swipe up on the bottom bar (or tap its handle) for every setting. While you drag a slider, the panel turns see-through so you can watch the full-size plot change.

## Top bar

- **Readout**: paper, total line length, number of lines
- **Flip camera**: front or back (shown while the camera is on)
- **Rotate paper**: portrait or landscape
- **Source preview**: small thumbnail of what the camera sees, for aiming
- **Full screen**: on browsers that support it

## Styles

| Style  | What it draws                                                        |
| ------ | -------------------------------------------------------------------- |
| Waves  | Horizontal lines whose wave height and frequency follow darkness      |
| Hatch  | 1–4 layers of cross-hatching; darker areas get more layers            |
| Spiral | One continuous Archimedean spiral, modulated by darkness              |
| Dots   | Hexagonal grid of circles sized by darkness                           |

## Controls

- **Spacing**: distance between lines, rings or dots (mm)
- **Wave height / Dot size**: how strongly darkness modulates the line
- **Hatch layers**: number of hatch directions (Hatch only)
- **Contrast, Brightness, Auto levels, Invert**: tone adjustments before plotting
- **Pen width**: stroke width for the preview and the SVG
- **Paper and Margin**: A5, A4, A3 (portrait or landscape) or 200 mm square
- **Send SVG**: opens the phone's share sheet (AirDrop, Nearby Share, email) where supported
- **Copy SVG**: copies the SVG markup to the clipboard

## SVG output

- Units are millimetres (`width="210mm"` etc.), so it imports at true size.
- Every stroke is a plain path with no fill, ordered back-and-forth to cut pen-up travel.
- Hatch layers are separate Inkscape layers (`pen 1`, `pen 2` …), so you can swap pens between them.

## Run locally

It's plain HTML, CSS and JavaScript with no build step or dependencies: `index.html`, plus `manifest.webmanifest`, `sw.js` (offline support) and `icons/`. Browsers only allow camera access over HTTPS or `localhost`, so serve it rather than double-clicking:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Publish with GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)`.

## Credits

Inspired by [mitxela/plotterfun](https://github.com/mitxela/plotterfun). Built for [terraPen](https://terrapen.xyz).

## License

MIT. See [LICENSE](LICENSE).
