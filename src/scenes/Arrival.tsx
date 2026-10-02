import { config } from '../config'
import { ease, local, ramp, STAGE } from '../timeline'

const { colors } = config

const DOOR = { x: 380, y: 80, w: 200, h: 390, rx: 28 }
const SLIDE = 230

export function Arrival({ t }: { t: number }) {
  const { u, d, active } = local(t, 'arrival')
  if (!active) return null

  // The door slides aside, the way an aircraft plug door does.
  const open = ease(ramp(u, 0.16 * d, 0.6 * d))
  const flood = ramp(u, 0.6 * d, 0.92 * d)

  return (
    <g opacity={ramp(u, 0, 0.5)}>
      <rect width={STAGE.w} height={STAGE.h} fill={colors.panel} />
      <polygon points="380,470 580,470 760,540 200,540" fill={colors.accent} opacity={open} />
      <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={DOOR.rx} fill={colors.text} />
      <g transform={`translate(${-SLIDE * open} 0)`}>
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={DOOR.rx} fill={colors.dim} />
        <rect x={DOOR.x + 70} y={DOOR.y + 60} width={60} height={84} rx={22} fill={colors.panel} />
      </g>
      <rect width={STAGE.w} height={STAGE.h} fill={colors.text} opacity={flood} />
    </g>
  )
}
