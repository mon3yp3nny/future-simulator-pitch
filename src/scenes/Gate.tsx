import { Caption } from '../components/Caption'
import { config } from '../config'
import { local, span } from '../timeline'

const { colors, fonts, texts } = config

const TILE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?????'
const TILES = 6
const FLIPS_PER_SECOND = 3.2

// Deterministic, so a given moment always shows the same letters.
function tileChar(u: number, i: number) {
  const n = Math.floor(u * FLIPS_PER_SECOND + i * 0.37)
  return TILE_CHARS[(Math.imul(n * 31 + i * 17 + 1, 2654435761) >>> 0) % TILE_CHARS.length]
}

export function Gate({ t }: { t: number }) {
  const { u, d, active } = local(t, 'gate')
  if (!active) return null

  const mono = { fontFamily: fonts.mono, fontWeight: 700 }
  const blink = 0.45 + 0.55 * (0.5 + 0.5 * Math.cos(u * Math.PI * 2))

  return (
    <g opacity={span(u, 0, d)}>
      <rect x={120} y={60} width={720} height={290} rx={8} fill={colors.panel} />
      <text x={150} y={112} fontSize={26} fill={colors.accent} {...mono}>
        {texts.board.heading}
      </text>
      {texts.board.columns.map((label, i) => (
        <text key={label} x={[150, 330, 500][i]} y={162} fontSize={16} fill={colors.dim} fontFamily={fonts.mono}>
          {label}
        </text>
      ))}
      <text x={150} y={234} fontSize={40} fill={colors.text} {...mono}>
        {texts.board.flight}
      </text>
      <text x={330} y={234} fontSize={40} fill={colors.text} {...mono}>
        {texts.board.from}
      </text>
      {Array.from({ length: TILES }, (_, i) => (
        <g key={i}>
          <rect x={500 + i * 52} y={186} width={44} height={64} rx={4} fill={colors.bg} />
          <text x={522 + i * 52} y={232} fontSize={36} textAnchor="middle" fill={colors.accent} {...mono}>
            {tileChar(u, i)}
          </text>
          <line x1={500 + i * 52} y1={218} x2={544 + i * 52} y2={218} stroke={colors.bg} strokeWidth={3} />
        </g>
      ))}
      <circle cx={162} cy={302} r={10} fill={colors.accent} opacity={blink} />
      <text x={186} y={311} fontSize={26} fill={colors.accent} {...mono}>
        {texts.board.status}
      </text>
      <Caption lines={config.captions.gate} u={u} d={d} y={450} />
    </g>
  )
}
