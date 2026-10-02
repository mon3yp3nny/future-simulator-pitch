import { config } from '../config'

const { colors } = config

type Props = {
  muted: boolean
  visible: boolean
  onToggle: () => void
}

/** Speaker in the bottom-right corner; `data-control` keeps a click on it from starting playback. */
export function SoundToggle({ muted, visible, onToggle }: Props) {
  const stroke = { fill: 'none', stroke: colors.dim, strokeWidth: 3.5, strokeLinecap: 'round' as const }
  return (
    <g
      data-control
      role="button"
      aria-label={muted ? 'Turn voice on' : 'Turn voice off'}
      transform="translate(892 472)"
      opacity={visible ? 1 : 0}
      style={{ cursor: 'pointer', pointerEvents: visible ? 'auto' : 'none', transition: 'opacity 0.3s' }}
      onPointerDown={onToggle}
    >
      <rect width={48} height={48} fill="transparent" />
      <polygon points="8,19 16,19 25,11 25,37 16,29 8,29" fill={colors.dim} />
      {muted ? (
        <path d="M31,18 L41,30 M41,18 L31,30" {...stroke} />
      ) : (
        <>
          <path d="M30,18 a8,8 0 0 1 0,12" {...stroke} />
          <path d="M34,13 a14,14 0 0 1 0,22" {...stroke} />
        </>
      )}
    </g>
  )
}
