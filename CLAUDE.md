# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A 73-second intro animation ("Shaping the future") with a narration the viewer can switch on and off, for a live future simulator: the audience votes on questions, the majority answer is locked in, and each locked answer changes the destination. It is presented full-screen in a browser, often through a Google Meet screen share, and must be understandable with no presenter and with the sound off.

`PROMPT.md` is the brief and `storyboard.html` the approved storyboard. Changes to scenes, wording or timing should stay consistent with both, or update them.

## Commands

```
npm run dev        # live preview
npm run build      # tsc --noEmit, then a single-file build to dist/index.html
npm run preview    # serve the build
npm run voice      # regenerate src/voice/*.mp3 from config.voice.lines (Google Cloud TTS)
```

`npm run voice` calls a paid external API through `gcloud` and needs `GCP_PROJECT` (or the active gcloud project) to have billing and Text-to-Speech enabled. Run it only when the narration text or voice changes, and confirm the project with the user first.

There are no tests and no linter; `npm run build` (type-check plus build) is the only gate.

To check a scene, open the app with `?t=<seconds>` (for example `?t=33`). It renders frozen at that second, which is how frames are compared against the storyboard.

## Architecture

The whole animation is a pure function of one number, the elapsed time `t` in seconds. Nothing is animated with CSS or an animation library.

- `src/useClock.ts` owns `t` and the phase (`idle`, `playing`, `ended`, `still`). It advances `t` per animation frame and stops at the total length.
- `src/timeline.ts` derives each scene's start time from `config.durations` (in key order) and provides the helpers every scene uses: `local(t, scene)` for scene-local time `u` and duration `d`, plus `ramp`, `span`, `ease` and `track` for turning time into opacity and position.
- `src/App.tsx` renders one SVG with a fixed `960 x 540` viewBox that scales to the window, handles keyboard and pointer input, and mounts every scene with the same `t`. Each scene returns `null` outside its own time range.
- `src/scenes/*` are the scenes. Each one computes everything from `t` on every render.

Scenes do not map one-to-one to the entries in `config.durations`:

- `Question.tsx` covers both `question` and `vote`, because they share one card.
- `FlightMap.tsx` covers `takeoff` and then `course`, `waypoints` and `route` as one continuous flight. The aircraft's position is a distance along the route polyline, driven by keyframes tied to those scenes' start times.
- `Title.tsx` stays rendered after the end, so the title card holds until restart.

### Voice

`src/voice.ts` decodes one clip per scene (`src/voice/*.mp3`, committed build inputs) and, on start, schedules all of them on a single `AudioContext`. While that context is running, `useClock.ts` takes `t` from its `currentTime` instead of accumulating frame time, so speech and picture cannot drift; the frame clock is only the fallback when no audio clock is ticking.

Muting (the `M` key or `SoundToggle`) only sets a gain node to zero. The clips keep running, which is what lets the voice come back mid-sentence and keeps one timeline for both cases. Scene lengths in `config.durations` are therefore sized for the narration.

Inside a scene, cue points are written relative to the scene (`0.3 * d`, or seconds after its start), so changing a duration in the config keeps the choreography intact.

## Constraints that shape the code

- **Config is the single place for content.** Colours, scene lengths, captions and all on-screen text live in `src/config.ts`. Do not hard-code text or colours in scenes.
- **Offline, single file.** `vite-plugin-singlefile` inlines JS, CSS, the bundled `@fontsource` fonts and the voice clips into `dist/index.html`, which is opened by double-click. Do not add anything loaded from the network at runtime.
- **Screen-share legibility.** The output is viewed at low frame rate and under heavy compression. Keep strokes at 3 units or more, avoid gradients, fine detail and fast motion, and keep text large with strong contrast. It must read at 1280x720.
- **Content rules from the brief.** One accent colour, an own-drawn aircraft silhouette with Airbus A350 proportions (`Aircraft.tsx`) and no logos or liveries, no imagery suggesting danger in flight, English text only.
- **Sound is optional.** The voice can be off at any time, so nothing may be explained by the voice alone.
- **Input.** Any key or click starts or replays; while playing only `R`, `Esc`, `F` and `M` react, so a stray click during a screen share does not restart it. Clickable controls carry `data-control`, which the global click handler skips.
