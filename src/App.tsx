import { useCallback, useEffect, useRef, useState } from 'react'
import { Aircraft } from './components/Aircraft'
import { SoundToggle } from './components/SoundToggle'
import { config } from './config'
import { Arrival } from './scenes/Arrival'
import { Boarding } from './scenes/Boarding'
import { FlightMap } from './scenes/FlightMap'
import { Gate } from './scenes/Gate'
import { Question } from './scenes/Question'
import { Title } from './scenes/Title'
import { STAGE } from './timeline'
import { useClock } from './useClock'
import { setVoiceMuted } from './voice'

const { colors, fonts, texts } = config

const IGNORED_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'])
const MUTED_KEY = 'shaping-the-future:muted'
// How long the speaker and the cursor stay visible after the mouse last moved.
const CONTROLS_MS = 2500

function readMuted() {
  try {
    return localStorage.getItem(MUTED_KEY) === '1'
  } catch {
    return false
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen()
  else document.documentElement.requestFullscreen().catch(() => {})
}

export default function App() {
  const { phase, t, start, reset } = useClock()
  const [muted, setMuted] = useState(readMuted)
  const [controls, setControls] = useState(false)
  const hideTimer = useRef(0)

  // The choice is remembered, so the next session starts the way this one ended.
  useEffect(() => {
    setVoiceMuted(muted)
    try {
      localStorage.setItem(MUTED_KEY, muted ? '1' : '0')
    } catch {
      // Storage can be unavailable; the toggle still works for this session.
    }
  }, [muted])

  const showControls = useCallback(() => {
    setControls(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setControls(false), CONTROLS_MS)
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((m) => !m)
    showControls()
  }, [showControls])

  // Any key or click starts it. While playing, only R (restart), Esc (back to
  // the start screen), F (fullscreen) and M (voice) react, so a stray click
  // does nothing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || IGNORED_KEYS.has(e.key)) return
      const key = e.key.toLowerCase()
      if (key === 'f') toggleFullscreen()
      else if (key === 'm') toggleMuted()
      else if (key === 'escape') reset()
      else if (phase !== 'playing' || key === 'r') start()
    }
    const onPointer = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-control]')) return
      if (phase !== 'playing') start()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('pointermove', showControls)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('pointermove', showControls)
    }
  }, [phase, start, reset, toggleMuted, showControls])

  const controlsVisible = phase === 'idle' || controls

  return (
    <svg
      className="stage"
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      style={{ cursor: controlsVisible ? 'default' : 'none' }}
    >
      <rect width={STAGE.w} height={STAGE.h} fill={colors.bg} />
      {phase === 'idle' ? (
        <>
          <Aircraft x={480} y={236} scale={1.5} fill={colors.dim} />
          <text x={480} y={330} fontSize={20} textAnchor="middle" fill={colors.dim} fontFamily={fonts.mono}>
            {texts.idle}
          </text>
        </>
      ) : (
        <>
          <Gate t={t} />
          <Boarding t={t} />
          <FlightMap t={t} />
          <Question t={t} />
          <Arrival t={t} />
          <Title t={t} />
        </>
      )}
      <SoundToggle muted={muted} visible={controlsVisible} onToggle={toggleMuted} />
    </svg>
  )
}
