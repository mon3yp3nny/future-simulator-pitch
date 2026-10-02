import { config, type CaptionLine } from '../config'
import { ease, ramp, span, STAGE } from '../timeline'

const LINE_GAP = 44

type Props = {
  lines: CaptionLine[]
  /** Local scene time and duration, in seconds. */
  u: number
  d: number
  /** Baseline of the last line. */
  y: number
}

export function Caption({ lines, u, d, y }: Props) {
  const first = y - (lines.length - 1) * LINE_GAP
  return (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={STAGE.w / 2}
          y={first + i * LINE_GAP + (1 - ease(ramp(u, line.at, line.at + 0.5))) * 8}
          opacity={span(u, line.at, d - 0.3)}
          textAnchor="middle"
          fontFamily={config.fonts.ui}
          fontSize={32}
          fontWeight={700}
          fill={config.colors.text}
        >
          {line.text}
        </text>
      ))}
    </>
  )
}
