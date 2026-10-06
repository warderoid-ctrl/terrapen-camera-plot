# terraPen Camera Plot

Point your phone camera at something and turn it into pen-plotter line art in real time, then save an SVG ready for the terraPen (or any plotter).

**Live page:** https://warderoid-ctrl.github.io/terrapen-camera-plot/

## Use it

1. Open the live page on your phone and tap **Live camera**. Allow camera access when asked.
2. Pick a style and tune the sliders. The preview updates as you move the phone.
3. Tap **Freeze frame** when you like what you see.
4. Tap **Save SVG**. The file is sized in millimetres for the paper you chose.

No camera permission? **Take photo** opens your camera app instead, and **Choose image** loads one from your gallery.

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

## SVG output

- Units are millimetres (`width="210mm"` etc.), so it imports at true size.
- Every stroke is a plain path with no fill, ordered back-and-forth to cut pen-up travel.
- Hatch layers are separate Inkscape layers (`pen 1`, `pen 2` …), so you can swap pens between them.

## Run locally

It's a single `index.html` with no build step or dependencies. Browsers only allow camera access over HTTPS or `localhost`, so serve it rather than double-clicking:

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
