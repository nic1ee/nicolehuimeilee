# Motion storyboard: Nic Lee site, Direction A ("Test Article")

The visual identity is fixed: ivory/black, one orange accent, Instrument Serif + Geist + Geist Mono,
hairline technical linework. Motion is the only thing this document designs.

## The motion language

Rhythm across the page: **quiet → tension → reveal → movement → stillness**. Long stretches are
static on purpose so the three signature moments land.

Every animation must do one of five jobs: **hierarchy, transition, causality, physicality, narrative.**

| Token | Value | Used for |
|---|---|---|
| `instrument` ease | `expo.out` (1.0–1.4 s) | things arriving and settling |
| `travel` ease | `none` / `power1.inOut`, scroll-scrubbed | anything the reader drives |
| `micro` | 240–320 ms, `cubic-bezier(.16,1,.3,1)` | hovers, links, cursor |
| No `back`, `elastic` or bounce eases anywhere. Weight comes from the physics sim, not from easing curves. |

Reveal vocabulary (each used in one place only, never the default fade-up):

1. **Baseline rise**: lines of type rise from behind their own baseline (hero statement only).
2. **Tracking resolve**: mono labels close from wide letter-spacing while clipped (metadata only).
3. **Draw**: SVG strokes draw along their length (diagrams, the thread).
4. **Shutter**: clip-path apertures that open like a focal-plane shutter (images).
5. **Section cut**: the engineering-drawing cut that opens Project 01 (signature moment 1).

**The thread.** One hairline recurs through the page and changes job: hero ground line → stimulation
baseline → section-cut line → black field (it thickens into it) → parabolic profile → horizon →
orbit → flight-plan route → final baseline under the name.

**H · S · E.** Three short hairlines in the chapter rail (Human, System, Environment) change their
relationship per chapter: apart → overlapping (wearable) → environment dominant (flight) →
crossing (policy) → converging (trajectory) → one line (end).

---

## Chapter by chapter

### 00 Hero: "coming online"
- **Start**: ivory field, `Nic Lee` and nothing else.
- **On load** (not scroll, sequenced, ~2.4 s): ground line draws left→right; coordinate labels
  resolve at its tick marks one at a time; statement rises line by line from its baselines; the
  portrait's shutter opens to a narrow horizontal band (eyes level).
- **Scroll** (pinned 100 vh): the shutter opens fully (clip-path), a focal-plane scan rule passes
  down the photo, the statement steps back in scale, and the right end of the ground line starts
  to lift, foreshadowing the pull-up.
- **End**: full composition, still.
- **Purpose**: hierarchy (name first, then context, then face) and narrative (the line will fly).
- **How**: GSAP timeline on load; ScrollTrigger pin + scrub; MorphSVG on the ground line.

### 01 Mission → Project 01: ★ SIGNATURE 1, "Section A–A"
- **Start**: the mission sentence fills the viewport.
- **Scroll** (pinned ~320 vh):
  1. Every word except **body** falls out of frame, each accelerating under gravity (power-in, no easing out) with slight rotation and a staggered release, like objects let go.
  2. **body** travels to centre and grows. A stimulation baseline draws beneath it.
  3. Orange biphasic pulses travel along the baseline. Each arrival makes the word *contract like
     a muscle*: letters shorten toward the centre and thicken, then recover with damping.
     Scroll drives the pulses, so the reader is stimulating the word.
  4. The baseline rises to the word's mid-height and becomes a **section-cut line**, with A ◁ / ▷ A
     markers at each end, as on an engineering drawing.
  5. The word separates along the cut: the top half lifts, the bottom half drops. Through the gap,
     Project 01 opens: "Section A–A", its title, and the electrode image widening from a slit.
- **End**: Project 01 header composition; the cut line is now that project's waveform axis.
- **Purpose**: causality (stimulus → contraction), transition (one word physically opens the next
  chapter), and narrative (the body is literally the subject).
- **How**: SplitText (words + chars); one scrubbed master timeline; contraction computed per frame
  from scroll progress (sum of decaying impulses), not tweened; two clipped copies of the word for
  the cut.

### 02 Project 01 body: quiet
Static reading section. The waveform draws once on entry. Nothing else moves.

### 03 Black field + Project 02: ★ SIGNATURE 2, "Parabolic"
- **Start**: the thread sits as a 1 px rule at the end of Project 01.
- **Scroll** (pinned ~420 vh):
  1. The rule **thickens** symmetrically until it is the viewport: the page enters the cabin.
     There's no crossfade; the line *becomes* the dark.
  2. The title settles in at 1 G. Labels resolve.
  3. A real flight profile draws across the field: level → pull-up (1.8 G) → **Mars parabola (0.38)** →
     pull-out → **Lunar parabola (0.16)** → pull-out → **Zero-g parabola (0.00)** → pull-out → level.
     An orange marker rides it; the large readout and the header gauge track the actual g.
  4. **The headline's letters obey the current g.** At 1.8 G they sit heavy and squash. At 0.38 they
     lift slightly and settle slowly. At 0.16 they float longer. At 0.00 they drift and rotate free
     of their baseline. At pull-out they fall back and *land* with a small squash. This is a real
     spring-damper simulation where scroll sets gravity and physics does the rest, so no two
     visits look the same.
  5. **Landing**: the ivory ground rises from below with the horizon hairline as its edge. The
     exit mechanism differs from the entry (horizon, not line-thickening).
- **Purpose**: physicality (the reader feels each gravity level), narrative (the actual
  experiment sequence flown on reduced-gravity flights).
- **How**: pinned scrub timeline for structure; a separate rAF physics loop (only while pinned)
  reads `g` from the scroll position; path sampled once and looked up by x.

### 04 Project 03 orbit: moderate
- **Scroll** (pinned 160 vh): the horizon line bends into an orbit (MorphSVG). The ISS node travels
  and empties to an outline (retirement); three commercial nodes appear in turn; connectors assemble
  into a systems map linking them to the three questions the work asks.
- **Purpose**: narrative (transition of infrastructure) and hierarchy.

### 05 Archive index: interaction, not scroll
- **Hover a row**: the large sticky numeral rolls to the row's number; the preview frame opens with a
  shutter on the right; a hairline leader draws from the title's end to the frame; the metadata row
  expands; the cursor reads VIEW.
- **Mobile**: tap expands the row inline with its image.

### 06 Trajectory: ★ SIGNATURE 3, "Flight plan"
- **Start**: a flight-plan document: three flight levels (Human / Machine / Market & policy), sparse
  waypoint idents with real coordinates, and an empty route string.
- **Scroll** (pinned ~400 vh, desktop): vertical scroll becomes horizontal travel across a wide
  chart. A pen at the centre of the viewport draws the route in order; each waypoint it reaches
  resolves (ident, coordinates, role) and is appended to the route string `UAZ DCT BOE DCT …`.
  Each leg carries a note on what carried forward ("fluids → the cardiovascular system").
- **Then** the camera pulls back until the whole plan fits the screen: the career is seen
  at once as one continuous route. Hold, then release.
- **Mobile**: the chart turns 90° and the pen draws downward as you scroll, without pinning.
- **Purpose**: narrative (cause and continuity between experiences) and hierarchy (detail → overview).
- **How**: pinned scrub; route length looked up from the pen's x; DrawSVG-style dash offset; a final
  scale tween computed from measured bounds.

### 07 Recognition: stillness
Typography only. One hairline draws under the heading. That's all.

### 08 Ending: composure
- **Scroll** (pinned 120 vh): metadata from every chapter (TA-01, Section A–A, g 0.00, CLD-B,
  CSPS…) sits scattered as on a working drawing, then gathers into four lines: **Nic Lee /
  Cambridge, MA / email / CV**. The H·S·E lines become one. The thread draws once more as the
  baseline under the name.
- **Purpose**: transition to rest.

---

## Micro-interactions
- **Text links**: hairline underline grows from the left on enter and retracts to the right on leave.
- **Email**: roman ↔ italic roll on hover; a Copy control confirms with a drawn tick.
- **CV**: hover reveals the format tag through a clip.
- **Nav**: active chapter carries an orange tick; hover tightens tracking.
- **Menu**: an ink sheet falls from the top edge; links rise from baselines in sequence. Closing is
  faster and retracts upward (asymmetric, like a shutter).
- **Return to top**: "Return to 1 G"; the scroll back is long and smooth and the gauge counts home.
- **Cursor** (fine pointers only): 6 px dot; becomes a VIEW ring over archive rows; becomes a
  crosshair over diagrams; disappears over giant type.
- **Scroll progress**: the rail's hairline fills; chapter ticks name themselves on hover.

## Accessibility & performance
- `prefers-reduced-motion`: no smooth-scroll, no pins, no physics; every composition renders in its
  final state.
- All motion uses transforms, clip-path and SVG stroke properties; nothing animates layout.
- The physics loop runs only while its section is pinned.
- Touch devices keep native scrolling (Lenis does not smooth touch).
