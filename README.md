# Shaping the future

A 73-second intro animation for the future simulator. It explains the principle:
the audience votes, the majority answer is locked in, and every locked answer
changes where we end up. A narration can be switched on and off; the captions
carry the whole message, so it works with the sound off.

`PROMPT.md` is the brief and `storyboard.html` the approved storyboard.

## Presenting

```
npm install
npm run build
```

Open `dist/index.html` in a browser. It is a single file with the fonts and
the voice clips included, so it needs no server and no network, and can be
copied to another machine on its own.

The speaker symbol in the bottom-right corner shows whether the voice is on.
It is always visible on the start screen; while the animation plays it appears
when the mouse moves. The setting is remembered for the next time.

When presenting with voice in Google Meet, share a Chrome tab and turn on "Also
share tab audio"; sharing a window or the whole screen sends no sound.

| Input | Effect |
| --- | --- |
| Any key or click | Start, or replay once it has finished |
| `R` | Restart while playing |
| `Esc` | Back to the start screen |
| `F` | Toggle fullscreen |
| `M`, or click the speaker | Voice on or off, also while playing |

Other clicks are ignored while it plays, so focusing the window does not
restart it.

## Editing

All colours, scene lengths and on-screen texts are in `src/config.ts`.
`npm run dev` shows changes live. Add `?t=33` to the address to open the animation frozen at that second.

## Changing the narration

The spoken lines and the voice are under `voice` in `src/config.ts`. The audio clips in `src/voice/`
are generated from those lines with Google Cloud Text-to-Speech:

```
GCP_PROJECT=<project> npm run voice
```

This needs the `gcloud` CLI, logged in, and a project with billing and the
Text-to-Speech API enabled. It prints each clip's length; if a line no longer
fits its scene, lengthen that scene in `durations`. Then build again.
