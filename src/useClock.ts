import { useCallback, useEffect, useRef, useState } from 'react'
import { TOTAL } from './timeline'
import { startVoice, stopVoice, voiceElapsed, voiceRunning } from './voice'

export type Phase = 'idle' | 'playing' | 'ended' | 'still'

type Clock = { phase: Phase; t: number }

// `?t=33` opens the animation frozen at that second, for checking a frame.
function initial(): Clock {
  const raw = new URLSearchParams(window.location.search).get('t')
  const t = raw === null ? NaN : Number(raw)
  return Number.isFinite(t) ? { phase: 'still', t: Math.min(Math.max(t, 0), TOTAL) } : { phase: 'idle', t: 0 }
}

export function useClock() {
  const [clock, setClock] = useState<Clock>(initial)
  const last = useRef(0)

  useEffect(() => {
    if (clock.phase !== 'playing') return
    let raf = 0
    last.current = performance.now()
    const tick = (now: number) => {
      // Capped so a backgrounded tab resumes where it stopped instead of jumping.
      const dt = Math.min((now - last.current) / 1000, 0.25)
      last.current = now
      setClock((c) => {
        if (c.phase !== 'playing') return c
        // The audio clock is the source of time, so speech and picture stay
        // together; the frame clock covers the moments it is not ticking.
        const t = voiceRunning() ? voiceElapsed() : c.t + dt
        return t >= TOTAL ? { phase: 'ended', t: TOTAL } : { phase: 'playing', t }
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [clock.phase])

  const start = useCallback(() => {
    startVoice()
    setClock({ phase: 'playing', t: 0 })
  }, [])
  const reset = useCallback(() => {
    stopVoice()
    setClock({ phase: 'idle', t: 0 })
  }, [])

  return { ...clock, start, reset }
}
