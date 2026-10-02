// Everything a presenter may want to adjust lives here: colours, timings and
// every word that appears on screen. The stage is 960 x 540 units (16:9) and
// scales to the window, so all positions below are in those units.

export type CaptionLine = {
  text: string
  /** Seconds after the scene starts. */
  at: number
}

/**
 * Scene lengths in seconds, in playing order. Each scene must be long enough
 * for its narration line (see `voice.lines`); `npm run voice` prints the clip
 * lengths.
 */
const durations = {
  gate: 6.5,
  boarding: 5,
  takeoff: 7,
  question: 9.5,
  vote: 8,
  course: 6,
  waypoints: 10,
  route: 7,
  arrival: 6,
  title: 8,
}

export type SceneName = keyof typeof durations

export const config = {
  colors: {
    bg: '#0C1B2E',
    panel: '#1B3655',
    dim: '#6F8AA8',
    text: '#F2F5F8',
    accent: '#FFC629',
  },

  fonts: {
    ui: '"B612", Verdana, sans-serif',
    mono: '"B612 Mono", Menlo, Consolas, monospace',
  },

  durations,

  captions: {
    gate: [{ text: 'This flight has no fixed destination.', at: 2 }],
    takeoff: [{ text: 'Where we land depends on you.', at: 1.5 }],
    question: [{ text: 'You will be asked a question.', at: 2 }],
    vote: [
      { text: 'The majority decides.', at: 3.5 },
      { text: 'The answer is locked in.', at: 4.8 },
    ],
    course: [{ text: 'Every answer changes our course.', at: 1.5 }],
    waypoints: [{ text: 'The clearer the vote, the sharper the turn.', at: 3.5 }],
    route: [{ text: 'Your answers add up to a destination.', at: 2.5 }],
  } satisfies Record<string, CaptionLine[]>,

  texts: {
    idle: 'PRESS ANY KEY TO START',
    board: {
      heading: 'DEPARTURES',
      columns: ['FLIGHT', 'FROM', 'TO'],
      flight: 'STF 1',
      from: 'TODAY',
      status: 'BOARDING',
    },
    origin: 'TODAY',
    waypoint: 'WAYPOINT 1',
    locked: 'LOCKED',
    title: 'Shaping the future',
    tagline: ['You are not passengers.', 'You set the course.'],
  },

  /**
   * The neutral sample question. The largest share wins and gets locked. The
   * card adapts to the number of answers; shares should add up to 100.
   */
  question: {
    text: 'Window, middle or aisle?',
    answers: [
      { label: 'Window', share: 54 },
      { label: 'Middle', share: 15 },
      { label: 'Aisle', share: 31 },
    ],
  },

  /**
   * The flight map. The aircraft flies start -> waypoints -> chosen
   * destination. Each waypoint is labelled with the turn made there, in
   * degrees, worked out from these positions. `labelDy` places the label above
   * (negative) or below (positive) the waypoint.
   */
  map: {
    start: { x: 40, y: 330 },
    waypoints: [
      { x: 200, y: 330, labelDy: 48 },
      { x: 369, y: 268, labelDy: -36 },
      { x: 545, y: 231, labelDy: -37 },
    ],
    destinations: [
      { x: 880, y: 72 },
      { x: 880, y: 182 },
      { x: 880, y: 292 },
      { x: 880, y: 402 },
    ],
    /** Index into `destinations`. */
    chosen: 3,
  },

  /**
   * The narration, which the viewer can switch on and off. After changing
   * `name` or any `text`, run `npm run voice` to regenerate the audio clips.
   * That needs your own Google Cloud project (see README); none is configured
   * here.
   */
  voice: {
    /** Google Cloud Text-to-Speech voice. */
    name: 'en-GB-Chirp3-HD-Sulafat',
    languageCode: 'en-GB',
    /** One clip per scene; `at` is seconds after the scene starts. */
    lines: {
      gate: { at: 0.8, text: 'Welcome. This flight is a little different. It has no fixed destination.' },
      boarding: { at: 0.5, text: 'Step on board. We leave from today.' },
      takeoff: { at: 0.5, text: 'Ahead of us lie several possible futures. Where we land depends on you.' },
      question: {
        at: 0.5,
        text: 'Along the way, you will be asked a few questions about how we use A.I. Here is a simple example: window, middle, or aisle?',
      },
      vote: { at: 0.8, text: 'Everyone votes. The majority decides, and that answer is locked in. There is no going back.' },
      course: { at: 0.8, text: 'Every locked answer changes our course.' },
      waypoints: { at: 1.8, text: 'A narrow vote turns us only slightly. A clear vote turns us sharply.' },
      route: { at: 1, text: 'Question by question, your answers add up to a destination.' },
      arrival: { at: 0.3, text: 'And when the door opens, we step out into the future this group has chosen.' },
      title: { at: 1.4, text: 'Shaping the future. You are not passengers. You set the course.' },
    } satisfies Record<SceneName, { at: number; text: string }>,
  },
}
