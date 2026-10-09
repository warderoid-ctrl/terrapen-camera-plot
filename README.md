<p align="center"><img src="icons/logo.svg" width="160" alt="terraLens logo: a lens filled with wave lines"></p>

# terraLens

*Formerly terraPen Camera Plot.*


Point your phone camera at something and turn it into pen-plotter line art in real time, then save an SVG ready for the [terraPen](https://terrapen.xyz) (or any plotter).

**Live page:** https://warderoid-ctrl.github.io/terrapen-camera-plot/

## Use it

1. Open the live page on your phone and tap the shutter button to start the camera. Allow camera access when asked.
2. Swipe the style carousel above the shutter. Each thumbnail previews that style on your picture, and the one in the centre is active (or just tap one). The plot updates as you move the phone.
3. Tap the shutter to freeze the frame, and again to resume.
4. Tap the download button to save the SVG. It's sized in millimetres for the paper you chose.

No camera permission? The camera button beside the shutter opens your camera app instead, and the picture button loads an image from your gallery.

## Install as an app

It's a Progressive Web App, so it installs from the browser with no app store:

- **Android (Chrome):** open the page, then tap **Install** when prompted, or open the settings sheet and tap **Install terraLens**.
- **iPhone / iPad (Safari):** tap **Share**, then **Add to Home Screen**.
- **Desktop (Chrome / Edge):** click the install icon in the address bar.

Once installed it opens full screen, has its own icon, works offline and keeps your settings. Updates arrive automatically the next time it opens with a connection.

## Gestures

| On the picture    | Does                         |
| ----------------- | ---------------------------- |
| Drag left / right | Spacing (levels for Contour) |
| Drag up / down    | Contrast                     |
| Pinch             | Zoom in to check the lines   |
| Double-tap        | Zoom in 3×, or back out      |
| Tap               | Hide or show all controls    |
| Long-press        | Place a focal point; keep holding and drag to move it |

Swipe up on the bottom bar (or tap its handle) for every setting. While you drag a slider, the panel turns see-through so you can watch the full-size plot change.

## Pen colours

Four colour swatches set the colour of pens 1–4. Each pen is its own layer in the SVG, with a matching stroke colour,
so plotter software can pause for a pen change between layers. Duotone always uses pens 1 and 2; the other styles
show the colours when **Show pen colours** is on (Hatch layers, Blobs outline/fill and Technical lineweights are on
separate pens).

## Focal point

Long-press the picture to drop a point that the current style reacts to. A target marker shows while you place or drag it, then fades; turn on **Show target** to keep it visible (it is never in the SVG). The settings sheet has **Attract / Repel**, a **Pull** strength slider and **Remove point**. With no point placed, every style behaves as normal.

| Style   | Attract                                   | Repel                       |
| ------- | ----------------------------------------- | --------------------------- |
| Waves   | Lines pinch in towards the point          | Lines bulge away (lens)     |
| Spiral  | Spiral starts at the point                | same                        |
| Contour | A hill rises at the point                 | A pit sinks                 |
| Flow    | Whirlpool draining into the point         | Whirl spiralling outward    |
| Blobs   | Hatch radiates, cross adds rings, spiral fill centres on the point | same |
| Hatch   | Lines converge on the point (vanishing point); extra layers add rings | same |
| Engrave | Hatch converges on the point | Hatch rings round the point |
| Etch    | Strokes converge, vignette centres on the point | Strokes ring round the point |
| Dots    | Dots sit on rings around the point        | same                        |
| Hairs   | Combed towards the point, like iron filings | Combed into circles around it |
| Arrows  | Aim at the point                          | Aim away                    |
| Suns    | Rays stretch towards the point            | Rays stretch away           |
| Swirls  | Orbit the point, tighter close to it      | Orbit the other way         |
| ASCII   | Characters sit on rings around the point  | same                        |
| Growth  | Grows only around the point; Pull sets how far | same                   |
| Voronoi | Cells shrink towards the point (attract) or grow (repel) | same |
| Subdiv  | Mesh is pulled towards the point | same |
| Ridges  | Raises (attract) or sinks (repel) a bump at the point | same |

## Top bar

- **Readout**: paper, total line length, number of lines
- **Flip camera**: front or back (shown while the camera is on)
- **Paper shape**: cycles portrait → landscape → square
- **Source preview**: small thumbnail of what the camera sees, for aiming
- **Full screen**: on browsers that support it

## Styles

| Style   | What it draws                                                                 |
| ------- | ----------------------------------------------------------------------------- |
| Waves   | Horizontal lines whose wave height and frequency follow darkness              |
| Spiral  | One continuous spiral from the centre, wobbling with darkness                 |
| Contour | Lines of equal tone, like a map's height lines                                |
| Flow    | Streamlines that follow the edges in the picture                              |
| Blobs   | Smooth shapes from the dark areas, filled with hatch, cross-hatch, contours or a spiral |
| Hatch   | 1–4 layers of cross-hatching; darker areas get more layers                    |
| Technical | Technical drawing: heavy outlines (pen 1), tone lines (pen 2) and section hatching in tonal bands (pen 3), with an optional border frame |
| Duotone | Two-ink print: angled line screens, dark ink (pen 1) for shadows and light ink (pen 2) for highlights and midtones |
| Engrave | Etching hybrid: blob outlines (or form contours), evenly spaced hatch lines that end and split as the tone lightens, cross-hatch building up in the shadows, dots in the light tones. Hatch: Flow (wraps round forms), Rigid (straight diagonal) or Facets (shards). Pen 1 outlines, pen 2 hatch and dots, pen 3 cross-hatch |
| Etch    | Loose needle etching (after Rembrandt): tone from small groups of parallel strokes at shifting angles round the form, stacking in the shadows; broken, restated outlines; curls where the picture is busy; fades to the edges. Pen 1 outlines, pen 2 light hatching, pen 3 shadows |
| Dots    | Hexagonal grid of circles sized by darkness                                   |
| Hairs   | Short strokes along the edges                                                 |
| Arrows  | Arrows pointing towards darker areas                                          |
| Suns    | Circles with rays, sized by darkness                                          |
| Swirls  | A small spiral per cell, turned by the image                                  |
| ASCII   | Characters chosen by darkness, drawn as single pen strokes                    |
| Growth  | Reaction-diffusion pattern grown inside the dark areas                        |
| Voronoi | Cells packed small in the dark areas and large in the light; Cell gap shrinks each cell into its own outline, with extra rings in the darkest |
| Subdiv  | A quad mesh pulled towards the dark areas and smoothed with Catmull-Clark subdivision (rows on pen 1, columns on pen 2) |
| Ridges  | Rows lifted by the image as a height field, with hidden lines removed, like a joy-division plot |

Contour, Flow, Hairs, Arrows, Suns, Swirls, ASCII and Growth are ported from
[hauntedPoints](https://github.com/warderoid-ctrl/hauntedPoints), where they were driven by
point-cloud displacement. Here darkness takes the place of the data value and the image's
gradient takes the place of the displacement direction.

Blobs puts the outlines on pen 1 and the fill on pen 2, so they can be plotted in two colours.

## Controls

- **Reset sliders** (top of the settings) puts every slider back to its default. Double-tap a slider's name to reset just that one
- The settings are grouped into folding sections (Background, Colour bands, Layer colours, Focal point, Paper, Export). With the menu open the style carousel steps aside and a Style bar shows the current style. Tap the picture to hide the menu and keep just the carousel, so you can swipe through styles while pointing at a subject
- **Paper colour** (in Paper): white, cream, kraft, grey, shell green, black or any colour, as a preview of the sheet you plot on. Strokes that would vanish on dark paper are drawn light. Optionally adds a hidden-able Paper layer to the SVG
- **Cell fill** also offers **Zigzag**, one continuous back-and-forth line; Blobs has a Zigzag fill too
- **Line wobble** and **Hatch wobble**: hand-drawn wobble, set separately for the main lines and for hatching or fills (Hatch wobble shows for Hatch, Blobs, Technical and filled Voronoi or Subdiv cells). Each stroke wobbles differently and the wobble is saved in the SVG
- The menu is an accordion: Settings, Background, Colour bands, Layer colours, Focal point, Paper and Export. Opening one folds the others
- **Thin zone** and **Lines reaching point** (Focal point): stops lines piling up and saturating the paper where they converge. Each stroke stops at its own random distance from the point, so only the chosen share (10% by default) run right in and the line density stays level. Set Thin zone to 0 to turn it off
- **Layer colours**: pick an ink for each pen layer; choosing one turns the colour preview on. Reset colours returns the pens, preview and paper to the defaults

- **Spacing**: distance between lines, rings, dots or grid cells (mm); the label changes with the style
- **Second slider** (wave height, dot size, line length, blob amount…): how strongly darkness drives the style
- **Hatch layers** (Hatch) and **Contour levels** (Contour, 2–200; drag sideways on the picture to double or halve)
- **Spacing** goes down to 0.5 mm for very dense plots; the live preview slows down to keep up
- **Technical options**: heavy outlines (each outline drawn three times, side by side) and a border frame; the second slider sets **Shading**
- **Blob fill** (Blobs): hatch, cross-hatch, contours or spiral
- **Cell fill** (Voronoi, Subdiv): fill each cell with hatch, cross-hatch, an orthogonal grid, an isometric grid or stipple. Fills go on their own pen, get tighter in darker cells, and Cross, Grid and Iso add directions as the tone deepens. **Fill density** scales it
- **Curve smoothing** (Voronoi): rounds the cell corners from sharp polygons to soft pebbles
- **Background**: culls the source image before any style sees it. Light or Dark removes tones past a cutoff, Flat removes areas of even tone (plain walls and skies), Radial keeps a disc around the focal point or the centre. Falloff sets how soft the edge is. Radial has Centre across and down sliders to move the disc
- **Colour bands**: Linear or Radial gradient of pens across the sheet, one pen per band (2 to 4). Edge blend scatters strokes across each boundary so some marks take the neighbouring pen. Position sliders move the radial centre, or the line for Linear. Replaces the style's own pen layers
- **Contrast, Brightness, Auto levels, Invert**: tone adjustments before plotting
- **Pen width**: stroke width for the preview and the SVG
- **Paper**: A6 up to A0, each as portrait, landscape or square (square uses the short side, e.g. A4 square is 210 × 210 mm). Changing size scales the line spacing and margin with it, so the drawing keeps its look and the live preview stays fast
- **Margin**: blank border around the drawing (mm)
- **Send SVG**: opens the phone's share sheet (AirDrop, Nearby Share, email) where supported
- **Copy SVG**: copies the SVG markup to the clipboard

## SVG output

- Units are millimetres (`width="210mm"` etc.), so it imports at true size.
- Every stroke is a plain path with no fill, ordered back-and-forth to cut pen-up travel.
- Each pen is its own Inkscape layer with its colour as the stroke, labelled with a leading number (`1 pen 1 #17321b`, `2 pen 2 #e83b68` …) so AxiDraw-style software can plot one layer at a time.
- **Save each pen as its own file** (Export section) saves one SVG per colour instead, for software that ignores layers. Send SVG shares them all together.

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

## Video clips as the live source
Tap the gallery button and pick a short video instead of a picture: it loops as the "live" feed, so every filter, gesture and slider works on it. Handy for demos and for working without a camera.

## Demo mode
Open `index.html?demo` to get a scripted tour of every feature with on-screen captions and a simulated finger. Options: `&speed=2` (faster), `&notitle` (skip the title card). Pick one or two clips in the panel, then press Play tour. `record.js` (Playwright) records it headlessly to video.
