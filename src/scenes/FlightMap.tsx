import { Aircraft } from '../components/Aircraft'
import { Caption } from '../components/Caption'
import { config } from '../config'
import { ease, easeOut, lerp, local, ramp, span, starts, track } from '../timeline'

const { colors, fonts, texts, map } = config

type Point = { x: number; y: number }

const route: Point[] = [map.start, ...map.waypoints, map.destinations[map.chosen]]
// Distance flown along the route when each of its points is reached.
const reached = route.reduce<number[]>(
  (acc, p, i) => (i === 0 ? [0] : [...acc, acc[i - 1] + Math.hypot(p.x - route[i - 1].x, p.y - route[i - 1].y)]),
  [],
)
const LENGTH = reached[reached.length - 1]
// Course of each leg in degrees, and the size of the turn made at each waypoint.
const legCourse = route.slice(1).map((p, i) => (Math.atan2(p.y - route[i].y, p.x - route[i].x) * 180) / Math.PI)
const turns = map.waypoints.map((_, i) => Math.round(Math.abs(legCourse[i + 1] - legCourse[i])))
// The aircraft stops this far short of the destination.
const STOP_SHORT = 95
const PULL_BACK = { scale: 0.88, x: 480, y: 250 }

function positionAt(s: number): Point {
  const dist = Math.min(Math.max(s, 0), LENGTH)
  for (let i = 1; i < route.length; i++) {
    if (dist <= reached[i]) {
      const p = (dist - reached[i - 1]) / (reached[i] - reached[i - 1])
      return { x: lerp(route[i - 1].x, route[i].x, p), y: lerp(route[i - 1].y, route[i].y, p) }
    }
  }
  return route[route.length - 1]
}

const diamond = (p: Point, r = 14) => `${p.x},${p.y - r} ${p.x + r},${p.y} ${p.x},${p.y + r} ${p.x - r},${p.y}`

/** The map is shown twice: at take-off, and from the first course change to the full route. */
export function FlightMap({ t }: { t: number }) {
  const takeoff = local(t, 'takeoff')
  const course = local(t, 'course')
  const waypoints = local(t, 'waypoints')
  const full = local(t, 'route')
  const flightEnd = starts.route + full.d
  const inFlight = t >= starts.course && t < flightEnd
  if (!takeoff.active && !inFlight) return null

  const s = takeoff.active
    ? lerp(20, 110, easeOut(ramp(takeoff.u, 0, takeoff.d)))
    : track(
        [
          [starts.course, reached[1]],
          // Leaves the first waypoint at speed, so the new heading shows early.
          [starts.waypoints + 0.3 * waypoints.d, reached[2], (p) => 1 - (1 - p) ** 2],
          [starts.waypoints + 0.65 * waypoints.d, reached[3]],
          [flightEnd, LENGTH - STOP_SHORT],
        ],
        t,
      )
  const pos = positionAt(s)
  // Sampled a little behind and ahead, so the aircraft banks through corners.
  const behind = positionAt(s - 14)
  const ahead = positionAt(s + 14)
  const span2 = Math.hypot(ahead.x - behind.x, ahead.y - behind.y) || 1
  const dir = { x: (ahead.x - behind.x) / span2, y: (ahead.y - behind.y) / span2 }
  const heading = (Math.atan2(dir.y, dir.x) * 180) / Math.PI

  const trail = [...route.filter((_, i) => reached[i] < s), pos].map((p) => `${p.x},${p.y}`).join(' ')

  const pull = inFlight ? lerp(1, PULL_BACK.scale, ease(ramp(full.u, 0, 0.3 * full.d))) : 1
  const highlight = inFlight ? ease(ramp(full.u, 0.3 * full.d, 0.45 * full.d)) : 0

  const ghost = inFlight ? span(course.u, 0, 0.75 * course.d) : 0
  const first = route[1]
  const firstLeg = { x: (first.x - route[0].x) / reached[1], y: (first.y - route[0].y) / reached[1] }

  const projection = inFlight ? ramp(course.u, 0.6, 1.6) * (1 - ramp(full.u, -0.5, 0.3)) : 0
  const projectionEnd = dir.x > 0.2 ? (850 - pos.x) / dir.x : 0

  return (
    <g opacity={takeoff.active ? span(takeoff.u, 0, takeoff.d) : span(t, starts.course, flightEnd)}>
      <g transform={`translate(${PULL_BACK.x} ${PULL_BACK.y}) scale(${pull}) translate(${-PULL_BACK.x} ${-PULL_BACK.y})`}>
        {map.destinations.map((dest, i) => {
          const shown = takeoff.active ? ramp(takeoff.u, 0.8 + i * 0.35, 1.4 + i * 0.35) : 1
          const lit = i === map.chosen ? highlight : 0
          const dx = dest.x - (pos.x + 60)
          const dy = dest.y - pos.y
          const len = Math.hypot(dx, dy)
          return (
            <g key={i} opacity={shown}>
              {takeoff.active && (
                <line
                  x1={pos.x + 60}
                  y1={pos.y}
                  x2={pos.x + 60 + (dx * (len - 30)) / len}
                  y2={pos.y + (dy * (len - 30)) / len}
                  stroke={colors.dim}
                  strokeWidth={3}
                  strokeDasharray="10 12"
                />
              )}
              <circle cx={dest.x} cy={dest.y} r={20} fill="none" stroke={colors.dim} strokeWidth={4} opacity={1 - lit} />
              {lit > 0 && (
                <g opacity={lit}>
                  <circle cx={dest.x} cy={dest.y} r={lerp(20, 24, lit)} fill="none" stroke={colors.accent} strokeWidth={6} />
                  <circle cx={dest.x} cy={dest.y} r={9 * lit} fill={colors.accent} />
                </g>
              )}
            </g>
          )
        })}

        {ghost > 0 && (
          <line
            x1={first.x + firstLeg.x * 16}
            y1={first.y + firstLeg.y * 16}
            x2={first.x + firstLeg.x * 270}
            y2={first.y + firstLeg.y * 270}
            stroke={colors.dim}
            strokeWidth={3}
            strokeDasharray="10 12"
            opacity={ghost}
          />
        )}
        {projection > 0 && projectionEnd > 80 && (
          <line
            x1={pos.x + dir.x * 46}
            y1={pos.y + dir.y * 46}
            x2={pos.x + dir.x * projectionEnd}
            y2={pos.y + dir.y * projectionEnd}
            stroke={colors.dim}
            strokeWidth={3}
            strokeDasharray="10 12"
            opacity={projection}
          />
        )}

        <polyline
          points={trail}
          fill="none"
          stroke={colors.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {map.waypoints.map((w, i) => {
          const at = reached[i + 1]
          const near = inFlight ? ramp(s, at - 90, at - 40) : 0
          const passed = ramp(s, at - 4, at + 8)
          return (
            <g key={i} opacity={near}>
              <polygon points={diamond(w)} fill={colors.bg} stroke={colors.dim} strokeWidth={4} opacity={1 - passed} />
              <polygon points={diamond(w)} fill={colors.text} opacity={passed} />
              {inFlight && (
                <text
                  x={w.x}
                  y={w.y + w.labelDy}
                  fontSize={20}
                  fontWeight={700}
                  textAnchor="middle"
                  fill={colors.text}
                  fontFamily={fonts.mono}
                  opacity={passed}
                >
                  {turns[i]}°
                </text>
              )}
            </g>
          )
        })}

        <Aircraft x={pos.x} y={pos.y} heading={heading} scale={1.3} fill={colors.text} />

        {takeoff.active && (
          <text x={map.start.x} y={map.start.y + 44} fontSize={18} fill={colors.dim} fontFamily={fonts.mono}>
            {texts.origin}
          </text>
        )}
      </g>

      {takeoff.active && <Caption lines={config.captions.takeoff} u={takeoff.u} d={takeoff.d} y={505} />}
      {course.active && <Caption lines={config.captions.course} u={course.u} d={course.d} y={505} />}
      {waypoints.active && <Caption lines={config.captions.waypoints} u={waypoints.u} d={waypoints.d} y={505} />}
      {full.active && <Caption lines={config.captions.route} u={full.u} d={full.d} y={505} />}
    </g>
  )
}
