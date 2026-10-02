type Props = {
  x: number
  y: number
  /** Heading in degrees; 0 points right. */
  heading?: number
  scale?: number
  fill: string
}

// Top view drawn to the proportions of an Airbus A350-900: 60 units long for
// its 66.8 m, with the long swept wing and the curved, swept-back wingtips
// that identify the type from above. Own drawing, no logo or livery.
const FUSELAGE =
  'M30,0 C30,-1.8 27,-3.2 22,-3.2 L-14,-3.2 C-22,-3 -27,-1.5 -30,0 C-27,1.5 -22,3 -14,3.2 L22,3.2 C27,3.2 30,1.8 30,0 Z'
const WING = 'M9,-3 L-6.5,-25 Q-9.5,-28.5 -16,-29.5 Q-13,-27.8 -11,-25.5 L-6,-10 L-4,-3 Z'
const TAILPLANE = 'M-19.5,-2 L-25.5,-8.5 L-28.5,-8.5 L-27,-1.5 Z'

export function Aircraft({ x, y, heading = 0, scale = 1, fill }: Props) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`} fill={fill}>
      <path d={FUSELAGE} />
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(1 ${side})`}>
          <path d={WING} />
          <path d={TAILPLANE} />
          <rect x={3} y={-11.2} width={7.5} height={3.4} rx={1.5} />
        </g>
      ))}
    </g>
  )
}
