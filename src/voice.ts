import { config, type SceneName } from './config'
import { starts } from './timeline'

// The narration. Every clip is scheduled on one AudioContext when playback
// starts, and that context's clock also drives the visuals, so picture and
// speech cannot drift apart. Muting only turns the volume down; the clips keep
// running, so the voice can be switched back on in the middle of a sentence.

const urls = import.meta.glob<string>('./voice/*.mp3', { eager: true, query: '?url', import: 'default' })

type Clip = { at: number; buffer: AudioBuffer }

let ctx: AudioContext | undefined
let gain: GainNode | undefined
let muted = false
let clips: Clip[] = []
let playing: AudioBufferSourceNode[] = []
let startedAt = 0

export async function loadVoice() {
  try {
    const context = new AudioContext()
    gain = context.createGain()
    gain.gain.value = muted ? 0 : 1
    gain.connect(context.destination)
    ctx = context

    const lines = Object.entries(config.voice.lines) as [SceneName, { at: number }][]
    const loaded = await Promise.all(
      lines.map(async ([scene, line]) => {
        const url = urls[`./voice/${scene}.mp3`]
        if (!url) return null
        const data = await (await fetch(url)).arrayBuffer()
        return { at: starts[scene] + line.at, buffer: await context.decodeAudioData(data) }
      }),
    )
    clips = loaded.filter((clip): clip is Clip => clip !== null)
  } catch {
    // No sound available; the animation still plays, on the frame clock.
  }
}

/** Call from a key press or click, so the browser allows sound. */
export function startVoice() {
  if (!ctx || !gain) return
  stopVoice()
  void ctx.resume()
  startedAt = ctx.currentTime
  playing = clips.map((clip) => {
    const source = ctx!.createBufferSource()
    source.buffer = clip.buffer
    source.connect(gain!)
    source.start(startedAt + clip.at)
    return source
  })
}

export function stopVoice() {
  for (const source of playing) source.stop()
  playing = []
}

export function setVoiceMuted(value: boolean) {
  muted = value
  // A short ramp instead of a jump, so toggling does not click.
  if (ctx && gain) gain.gain.setTargetAtTime(value ? 0 : 1, ctx.currentTime, 0.03)
}

/** False until the audio clock is ticking; the frame clock is used meanwhile. */
export const voiceRunning = () => ctx?.state === 'running'

/** Seconds since `startVoice`, on the audio clock. */
export const voiceElapsed = () => (ctx ? ctx.currentTime - startedAt : 0)
