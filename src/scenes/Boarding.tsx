import { config } from '../config'
import { ease, local, ramp, STAGE } from '../timeline'

const { colors } = config

const DOOR = { x: 400, y: 120, w: 160, h: 330 }
const DOOR_CENTER = { x: DOOR.x + DOOR.w / 2, y: DOOR.y + DOOR.h / 2 }
// Large enough for the lit doorway to cover the whole stage.
const MAX_ZOOM = 6.6
const WINDOWS_X = [70, 170, 270, 646, 746, 846]

export function Boarding({ t }: { t: number }) {
  const { u, d, active } = local(t, 'boarding')
  if (!active) return null

  // Exponential, so the push forward feels steady instead of accelerating.
  const zoom = MAX_ZOOM ** ease(ramp(u, 0.08 * d, 0.8 * d))
  const dark = ramp(u, 0.8 * d, 0.98 * d)

  return (
    <g opacity={ramp(u, 0, 0.5)}>
      <g
        transform={`translate(${DOOR_CENTER.x} ${DOOR_CENTER.y}) scale(${zoom}) translate(${-DOOR_CENTER.x} ${-DOOR_CENTER.y})`}
      >
        <rect x={-STAGE.w} y={40} width={STAGE.w * 3} height={440} fill={colors.panel} />
        {WINDOWS_X.map((x) => (
          <rect key={x} x={x} y={170} width={44} height={60} rx={18} fill={colors.bg} />
        ))}
        <polygon points="400,450 560,450 780,540 180,540" fill={colors.dim} />
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={26} fill={colors.accent} />
      </g>
      <rect width={STAGE.w} height={STAGE.h} fill={colors.bg} opacity={dark} />
    </g>
  )
}
