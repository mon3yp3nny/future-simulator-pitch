import { config } from '../config'
import { ease, ramp, STAGE, starts } from '../timeline'

const { colors, fonts, texts } = config

/** Stays on screen after the last second, until the animation is restarted. */
export function Title({ t }: { t: number }) {
  const u = t - starts.title
  if (u < 0) return null

  const draw = ease(ramp(u, 1, 2.6))
  const rise = (at: number) => ({ opacity: ramp(u, at, at + 0.7), dy: (1 - ease(ramp(u, at, at + 0.7))) * 8 })
  const title = rise(1.6)
  const tagline = [rise(3.2), rise(4.4)]

  return (
    <g>
      <polyline
        points="300,150 400,150 480,122 560,106 640,146"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        fill="none"
        stroke={colors.accent}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={draw > 0 ? 1 : 0}
      />
      <circle cx={660} cy={156} r={10 * ease(ramp(u, 2.5, 2.9))} fill={colors.accent} />
      <text
        x={480}
        y={270 + title.dy}
        opacity={title.opacity}
        fontSize={64}
        fontWeight={700}
        textAnchor="middle"
        fill={colors.text}
        fontFamily={fonts.ui}
      >
        {texts.title}
      </text>
      <text
        x={480}
        y={350 + tagline[0].dy}
        opacity={tagline[0].opacity}
        fontSize={30}
        textAnchor="middle"
        fill={colors.text}
        fontFamily={fonts.ui}
      >
        {texts.tagline[0]}
      </text>
      <text
        x={480}
        y={394 + tagline[1].dy}
        opacity={tagline[1].opacity}
        fontSize={30}
        fontWeight={700}
        textAnchor="middle"
        fill={colors.accent}
        fontFamily={fonts.ui}
      >
        {texts.tagline[1]}
      </text>
      {/* The light from the arrival scene settles into the dark background. */}
      <rect width={STAGE.w} height={STAGE.h} fill={colors.text} opacity={1 - ramp(u, 0, 1.2)} />
    </g>
  )
}
