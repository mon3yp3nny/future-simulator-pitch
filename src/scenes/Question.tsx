import { Aircraft } from '../components/Aircraft'
import { Caption } from '../components/Caption'
import { config } from '../config'
import { ease, lerp, local, ramp, span, track } from '../timeline'

const { colors, fonts, texts, question } = config

const STRIP_Y = 80
const WAYPOINT_X = 560
const BAR = { x: 210, w: 460 }
// The card lays itself out for however many answers the question has.
const count = question.answers.length
const BOX = { gap: 20, w: (540 - (count - 1) * 20) / count }
const ROW_PITCH = Math.min(100, 216 / count)
const ROW = { first: 139 + ROW_PITCH * 0.52, barH: ROW_PITCH * 0.36, font: count > 2 ? 24 : 28 }
const winner = question.answers.reduce((best, a, i, all) => (a.share > all[best].share ? i : best), 0)

/** The question and vote scenes share one card, so they are drawn together. */
export function Question({ t }: { t: number }) {
  const q = local(t, 'question')
  const v = local(t, 'vote')
  if (!q.active && !v.active) return null

  const u = q.u
  const aircraftX = track(
    [
      [0, 300],
      [q.d, 400],
      [q.d + 0.3 * v.d, 498],
    ],
    u,
  )
  const card = ease(ramp(u, 0.6, 1.4))
  const toBars = ramp(v.u, 0, 0.8)
  const grow = ease(ramp(v.u, 0.9, 0.42 * v.d))
  const lockAt = 0.56 * v.d
  const locked = ramp(v.u, lockAt, lockAt + 0.4)

  const diamond = `${WAYPOINT_X},${STRIP_Y - 14} ${WAYPOINT_X + 14},${STRIP_Y} ${WAYPOINT_X},${STRIP_Y + 14} ${WAYPOINT_X - 14},${STRIP_Y}`

  return (
    <g opacity={span(u, 0, q.d + v.d)}>
      <line
        x1={180}
        y1={STRIP_Y}
        x2={aircraftX - 10}
        y2={STRIP_Y}
        stroke={colors.accent}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {aircraftX + 46 < WAYPOINT_X - 20 && (
        <line
          x1={aircraftX + 46}
          y1={STRIP_Y}
          x2={WAYPOINT_X - 20}
          y2={STRIP_Y}
          stroke={colors.dim}
          strokeWidth={3}
          strokeDasharray="10 12"
        />
      )}
      <polygon points={diamond} fill="none" stroke={colors.dim} strokeWidth={4} />
      <polygon points={diamond} fill={colors.accent} opacity={locked} />
      <Aircraft x={aircraftX} y={STRIP_Y} scale={1.3} fill={colors.text} />
      <text x={590} y={86} fontSize={18} fill={colors.dim} fontFamily={fonts.mono}>
        {texts.waypoint}
      </text>

      <g opacity={card} transform={`translate(0 ${(1 - card) * 20})`}>
        <rect x={180} y={140} width={600} height={235} rx={8} fill={colors.panel} />

        <g opacity={1 - toBars}>
          <text x={480} y={214} fontSize={question.text.length > 18 ? 36 : 44} fontWeight={700} textAnchor="middle" fill={colors.text} fontFamily={fonts.ui}>
            {question.text}
          </text>
          {question.answers.map((a, i) => (
            <g key={a.label}>
              <rect x={210 + i * (BOX.w + BOX.gap)} y={258} width={BOX.w} height={80} rx={6} fill="none" stroke={colors.dim} strokeWidth={4} />
              <text x={210 + i * (BOX.w + BOX.gap) + BOX.w / 2} y={309} fontSize={30} textAnchor="middle" fill={colors.text} fontFamily={fonts.ui}>
                {a.label}
              </text>
            </g>
          ))}
        </g>

        <g opacity={toBars}>
          {question.answers.map((a, i) => {
            const y = ROW.first + i * ROW_PITCH
            const won = i === winner
            const width = (BAR.w * a.share * grow) / 100
            return (
              <g key={a.label} opacity={won ? 1 : lerp(1, 0.5, locked)}>
                <text x={BAR.x} y={y} fontSize={ROW.font} fontWeight={700} fill={colors.text} fontFamily={fonts.ui}>
                  {a.label}
                </text>
                <rect x={BAR.x} y={y + 12} width={BAR.w} height={ROW.barH} fill={colors.bg} />
                <rect x={BAR.x} y={y + 12} width={width} height={ROW.barH} fill={colors.text} />
                {won && <rect x={BAR.x} y={y + 12} width={width} height={ROW.barH} fill={colors.accent} opacity={locked} />}
                <text x={690} y={y + 12 + ROW.barH * 0.8} fontSize={ROW.font} fontWeight={700} fill={colors.text} fontFamily={fonts.mono}>
                  {Math.round(a.share * grow)} %
                </text>
                {won && (
                  <g opacity={locked}>
                    <g transform={`translate(${BAR.x + BAR.w - 100} ${y - 28})`}>
                      <rect x={0} y={10} width={24} height={18} rx={3} fill={colors.accent} />
                      <path d="M5,10 V7 a7,7 0 0 1 14,0 V10" fill="none" stroke={colors.accent} strokeWidth={4} />
                    </g>
                    <text
                      x={BAR.x + BAR.w}
                      y={y - 2}
                      fontSize={18}
                      fontWeight={700}
                      textAnchor="end"
                      fill={colors.accent}
                      fontFamily={fonts.mono}
                    >
                      {texts.locked}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {q.active && <Caption lines={config.captions.question} u={q.u} d={q.d} y={470} />}
      {v.active && <Caption lines={config.captions.vote} u={v.u} d={v.d} y={482} />}
    </g>
  )
}
