# Template, Package, App · posit::conf(2026)

Quarto reveal.js deck, split into one `.qmd` per section so two people can edit
without collisions.

```
index.qmd            ← YAML + an ordered list of includes; no slide content. Reorder the talk = reorder lines.
_quarto.yml          ← reveal config (1920×1080, theme, header/footer includes); renders index.qmd only
sections/            one file per talk section, one owner each (BEAT · OWNER line at the top)
  01-title.qmd       T    slide 1
  02-hook.qmd        T    slides 2–4  (1930 · 1938 · 1953; they share the timeline tape)
  03-playbook.qmd    J    slide 5     (the rings, built by fragments, and the thesis)
  04-template.qmd    J    slides 6–7  (output slide, boundary slide)
  05-package.qmd     J    slides 8–9  (anatomy, what a developer runs)
  06-app.qmd         T    slides 10, 10b, 10c (stack intro, recorded demo, What We Saw)
  07-lessons.qmd     T/J  slides 11–14 (one slide, four beats on three clicks)
  08-close.qmd       T    slides 15–16 (Three Layers, Three Audiences; the close)
  _archive/          earlier versions, not rendered (see its README)
theme/brand.scss     brand.css translated into a reveal theme (all tokens as $vars + :root)
_extensions/rings/   the {{< rings >}} and {{< stack >}} shortcodes (see below)
assets/
  head.html          Inter font link + rings.css link  (include-in-header)
  rings.css          styles for the rings slide + the reusable rings graphic
  rings.js           fragment-driven rings animation (slide 5)
  rings-symbols.html the rings graphic as SVG symbols (include-after-body)
  rings-init.html    loads rings.js                    (include-after-body)
  timeline.css       styles for the timeline tape under the hook slides
  timeline.js        the tape: one overlay, scrolls to each hook slide's milestone
  timeline-init.html loads timeline.js                 (include-after-body)
  deck-footer.js     the logo lockup (WSDA | IndieVisual), bottom-right of every slide, tinted to the slide
  deck-footer-init.html loads deck-footer.js           (include-after-body)
  demo-video.js      hides the demo slide's placeholder tag once a recording exists
  demo-video-init.html loads demo-video.js             (include-after-body)
images/              placeholders; see images/README.md
```

## Editing your section

Open your file under `sections/` and nothing else. Run `quarto preview` from the
repo root; it live-reloads, and `m` in the browser opens a slide menu to jump
to your slides. Everything you need fits in six building blocks:

```
## Layer 1: Template [· The Recipe]{.h2-sub} {#my-slide}     a slide: ## + title + a unique id
{{< rings lit=1 class="rings--crumb" >}}                     the breadcrumb, lit to your layer (1, 2 or 3)

::: {.lede}                                                  one line under the title
What the audience should take from this slide.
:::

::: {.fill .fill--center}                                    the content area; add .fill--row for two columns
```{=html}
<div class="placeholder">                                    a dashed box for content still to come
  <div class="placeholder__label">Placeholder · ask Jadey</div>
  <p>What goes here.</p>
</div>
```
:::

::: {.notes}                                                 speaker notes; press s while presenting
*⏱ 1:00 · Jadey*
What you say. **[click: what appears]** for each fragment.
:::
```

Images go in `images/` and are referenced as `images/name.png`. Cards are
`.card .card--l1|l2|l3` (see `sections/05-package.qmd`). A code window, for
slide 9's `library(soils)` call, is:

````
```{=html}
<div class="code-window">
<div class="chrome"><span class="r"></span><span class="y"></span><span class="g"></span><span class="filename">report.R</span></div>
```
```r
library(soils)
```
```{=html}
</div>
```
````

Keep one idea per slide and check the beat line at the top of your file before
adding a slide.


## Talk structure

Every section `.qmd` serves one beat. Check the beat before editing a slide.
Slide numbers count fragments on Lessons Learned (11–14) and the demo/post-demo
slides after the App (10b, 10c); ≈ 17:00 of content + 3:00 Q&A.

| Section | Time | Slides | Note |
|---|---|---|---|
| Title | 0:30 | 1 | no change |
| Cookie hook (1930 / 38 / 53) | 1:30 | 2–4 | subtitles name who's locked out |
| Playbook | 1:00–1:30 | 5 | trimmed from 2:00; Jadey leads |
| Layer 1 · Template · The Recipe | 2:30 | 6–7 | output slide + boundary slide; **stakes line** on 6 |
| Layer 2 · Package · The Cookbook | 2:00 | 8–9 | 8 is the first cut if time is short |
| Layer 3 · App · The Store Shelf | 4:00 | 10, 10b, 10c | intro + recorded demo (≤ 2:00, cut tight) + post-demo |
| Lessons Learned | 2:30–3:00 | 11–14 (1 slide, 4 fragments) | gets the time from Playbook |
| Three Layers + Close | 1:30 | 15–16 | matrix retitled; close gets thesis + result stat (optional) |

Total ≈ 17:00 content + 3:00 Q&A. The talk track in the speaker notes runs
≈ 15:00–15:30 on paper; live pacing, laughs and the demo eat the rest. If it's
still short in rehearsal, extend the stakes beat on 6 and the user reaction on 10c.

The arc is hook → map → three layers → what broke → recap. Two beats hold it
together: **stakes before the layers** (what a farmer does with a report, slide 6)
and **result after them** (who used the app and what changed, slides 10c and 16).

### Beat and tone, by section

- **Hook (1–4):** warm, narrative, no tech. Photo + one line. The subtitles name
  who's locked out (one kitchen, one baker · anyone who can bake · anyone at all).
  The audience shouldn't know it's a technical talk until slide 4's pivot.
- **Playbook (5):** the map. Jadey leads. State the thesis once: *"Impact stops
  where access stops."* (It replaced "code trapped on a laptop has zero impact",
  which contradicted "each layer is right for someone".) Don't explain the layers
  here; the layer slides do that. Rings read You / Anyone who
  codes / Everyone, and the matrix's Who column mirrors them.
- **Layer 1 (6–7):** Jadey, first person, callback to 2023. Show the **output**
  before the mechanism. End on the boundary: one kitchen.
- **Layer 2 (8–9):** plain, practical. A published cookbook for anyone with R and
  a soil survey, not an internal tool. End on "not everyone is comfortable in R."
- **Layer 3 (10–10c):** the payoff. Zero friction. Then the honest turn: the app
  showed where the package was thin.
- **Lessons (11–14):** candid, generalizable. The diagram is the argument; keep
  text to one line per fragment.
- **Close (15–16):** answer the hook. 15 is the plain-language recap (no cookie
  names); 16 repeats the thesis and says who took the cookie off the shelf.

### Slide-writing rules

- One idea per slide.
- One line of text max on story slides.
- Code appears only where the audience needs to see the thing (slides 6, 9).
- Metaphor names (Recipe / Cookbook / Store Shelf) stay on every layer header.
- The ring graphic is the only recurring visual, and its lit state must match the
  layer (see "The rings graphic" below).
- "Friction" / "zero friction" for the delivery idea; "accessibility" only for
  WCAG / contrast.

### Speaker split

- **Tanya:** 1–4, 10–10b, 11–13, 15, half of 16 (≈ 7:20).
- **Jadey:** 5 (Tanya interjects once), 6–9, 10c, 14, half of 16 (≈ 7:45).
- **Handoffs:** 4→5 (Jadey's "what does a cookie have to do with…" is the pivot),
  9→10 ("they still had to find someone like me" → "this is where I come in"),
  10b→10c, 13→14 (Tanya owns the mess she shipped, Jadey owns the fix), 15→16.
- The speaker notes on every slide are the talk track, with **[click: …]** cues.

## The stack graphic

Slide 10 shows the app as the top of a stack, not a UI: three bars (Dirt Data
Reports · {soils} · Quarto template) with a connector between each, all shown
at once.

```
{{< stack highlight=all >}}                  slide 10: all three bars, full colour, no clicks
{{< stack highlight=all arrows=up >}}        Lessons callback: connectors reversed (app → package → template)
{{< stack highlight=app fragments=true >}}   optional: built bottom-up by fragments, the named bar full colour, the rest at 40 %
```

`highlight` is `app`, `package`, `template` or `all`; `arrows` is `down`
(default) or `up`; `fragments=true` adds the bottom-up build. The bar text lives
in `_extensions/rings/stack.lua`.

## Render

```
quarto render          # → index.html
quarto preview         # live reload while editing
```

## Speaker notes

Each slide's script lives in a `::: {.notes}` block at the end of its section.
Press `s` while presenting (in a browser, not the RStudio pane) for the speaker
view: current slide, next slide, notes, timer. Notes are per slide, so
click-driven slides carry **[click: …]** cues at the moment each fragment lands.
The matrix slide has no note yet.

## Slide names in the menu and the tab

The document `<title>` comes from `pagetitle:` in `index.qmd` (not `title:`, which
would add an automatic title slide). Every slide has a real `##` heading so that
navigators (RStudio's slide list, the `m` menu) and screen readers can name it; on
the title slide and the three hook slides the heading is visually hidden
(`.cover > h2`, `.hook > h2` in `brand.scss`).

## Adding a slide

Add a `## Title {#id}` heading (or `## {#id}` for a title-less slide) to the
section file it belongs to; the section files are included by `index.qmd` in
order. A new section is a new `sections/NN-name.qmd` plus one include line.
Dark slides: add `.slide-dark background-color="#1A1D20"` to the header attributes.
Content that should fill the slide below the title goes in `::: {.fill}` (add
`.fill--center` to center vertically, `.fill--row` for a two-column split).

## The timeline tape (hook slides)

A calendar strip sits at the foot of slides 2–4 and scrolls under a fixed cursor
as you move between them: Aug 1930 → late 1938 → 1953. It is one element
appended to `.slides` by `assets/timeline.js`, so it survives slide changes and
scales with the deck. Each hook slide names its stop in the header:

```
## {#cookbook .hook data-milestone="1938-10" transition="fade" transition-speed="fast"}
```

- `data-milestone` must be a key in the strip's schema (top of `timeline.js`:
  months in 1930 and 1938, bare years everywhere else through 1953). A month
  stop is `"1938-10"`, a year stop is `"1953"`. Add years there to extend it.
- `.hook` reserves the band at the foot of the slide (`brand.scss`).
- Content wrapped in `.tl-content` is held invisible while the tape is moving and
  fades in as it lands. `transition="fade"` lets the outgoing slide dissolve as
  the tape starts.
- Arriving from a non-hook slide (menu, hash, walking back from slide 5) snaps
  the tape with no motion. `prefers-reduced-motion` always snaps.
- PDF export hides the tape and shows each slide's plain `.tl-static` rail.

## Placeholders

`images/README.md` lists the assets still to be dropped in: the posit::conf(2023)
screenshot (slide 6), the app screenshot used as the video poster, and the
recorded demo itself (slides 10 and 10b). Each is a one-line swap in the slide file.

## The rings slide

Three invisible `.fragment` spans in `sections/03-playbook.qmd` drive the build:
down/right arrow adds a ring (creator → coders → everyone), left arrow walks it
back, and jumping into the slide from elsewhere renders the current fragment state
instantly with no walking. Timings and radii live at the top of `assets/rings.js`.

## The rings graphic

The playbook's rings are the deck's one recurring visual. A static copy is
available on any slide through a shortcode: three evenly spaced rings in the
same colours, each person a dot (centre 1, ring 2 twelve, ring 3 twenty-four) so it
stays crisp at any size. The audience has seen the figures on slide 5, so the
dots read as people by association.

```
{{< rings lit=1 class="rings--crumb" >}}   layer slide: top-right, on the title line, only the centre lit
{{< rings lit=2 >}}                        130px, rings 1–2 lit, ring 3 dimmed
{{< rings lit=3 size=260 >}}               larger, all three lit
```

- `lit` (0–3) says which layer the slide is on; rings above it turn neutral
  grey (colour for lit, grey for unlit: two cues, so it survives a washed-out
  projector and colour-blind viewers). On layer slides the rings **are** the
  breadcrumb, there is no text breadcrumb, so `lit` must match the layer. (Lessons Learned lights App only
  on arrival and all three on the refactor click, via CSS in `brand.scss`.)
- `size` is in slide pixels (default 130). `class` is added to the `<svg>`;
  `rings--crumb` is the title-line placement.
- Put the shortcode on its own line in markdown, not inside a `{=html}` block.

The SVG symbols live in `assets/rings-symbols.html`, the colours and lit rules
in `assets/rings.css`, and the shortcode in `_extensions/rings/rings.lua`.

## Untested here

Built without a Quarto install, so please check on first render:
1. Slide-level attributes on empty headers (`## {.slide-dark …}`): if a stray
   empty `<h2>` shows, `h2:empty { display:none }` in brand.scss should hide it.
2. YAML token colors in the code window (`span.fu` / `span.st` in brand.scss):
   Pandoc's class names for YAML can vary by version.
3. Rings positioning at odd window sizes: it reads `Reveal.getScale()`, which
   should cover both `transform` and `zoom` scaling modes.
