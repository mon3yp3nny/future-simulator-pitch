import { config, type SceneName } from './config'

export const STAGE = { w: 960, h: 540 }

const { durations } = config
const names = Object.keys(durations) as SceneName[]

export const starts = {} as Record<SceneName, number>
let acc = 0
for (const name of names) {
  starts[name] = acc
  acc += durations[name]
}
export const TOTAL = acc

/** Local time `u` and duration `d` of a scene at absolute time `t`. */
export function local(t: number, name: SceneName) {
  const u = t - starts[name]
  const d = durations[name]
  return { u, d, active: u >= 0 && u < d }
}

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p

/** Linear 0..1 as `u` goes from `a` to `b`. */
export const ramp = (u: number, a: number, b: number) => clamp01((u - a) / (b - a))

export const ease = (p: number) => p * p * (3 - 2 * p)
export const easeOut = (p: number) => 1 - (1 - p) ** 3

/** Opacity that fades in at `a` and out before `b`. */
export const span = (u: number, a: number, b: number, fade = 0.5) =>
  Math.min(ramp(u, a, a + fade), 1 - ramp(u, b - fade, b))

type Key = [time: number, value: number, easing?: (p: number) => number]

/** Interpolation through keyframes; each key may set the easing used to reach it. */
export function track(keys: Key[], t: number) {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, easing = ease] = keys[i]
    if (t <= t1) {
      const [t0, v0] = keys[i - 1]
      return lerp(v0, v1, easing(ramp(t, t0, t1)))
    }
  }
  return keys[keys.length - 1][1]
}
