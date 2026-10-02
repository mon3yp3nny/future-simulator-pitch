I want to build a short motion graphic that introduces a live "future simulator"
to an audience. It only explains the principle; it is not the simulator itself.
Working title: "Shaping the future".

CONTEXT
In the session, I ask the audience a series of questions about how we use AI and
LLMs. For each question the majority answer is locked in. Each locked answer
shifts a score along 2 axes, weighted by how clear the majority was. After the
last question, the final position determines which of 4 possible futures we
land in. The intro plays once before the first question, either on a projector
or shared in a Google Meet session. It must be understandable on its own, with
no presenter talking over it.

WHAT THE VIEWER MUST UNDERSTAND AFTERWARDS
1. You will be asked a few questions and you vote.
2. The majority answer gets locked in; there is no going back.
3. Every locked answer shifts where we are heading.
4. At the end, we see the future this group has chosen.

METAPHOR: A FLIGHT INTO THE FUTURE
We board an aircraft today and step out in a future scenario. The destination
is not fixed at departure; the people on board set the course.
- Boarding / gate = today
- Each question = a waypoint where the course is decided
- Locked majority answer = a heading change; a clearer majority means a
  sharper turn
- The flight path drawn behind the aircraft = the decisions made so far
- Possible destinations = the possible futures
- The door opening on arrival = the reveal of the chosen future
The viewers are the crew, not passengers.

STORYBOARD (about 60–75 seconds, 16:9)
1. Gate: a departure board. Origin "TODAY", destination still flipping and
   unresolved. Text: "This flight has no fixed destination."
2. Boarding: we move through the aircraft door; it closes behind us.
3. Take-off into a top-down map view: the aircraft as a simple silhouette,
   several faint, unnamed destinations ahead.
4. First waypoint: a question appears with three answers. Use a neutral sample
   question, not one of the real ones, so the audience is not primed.
   Text: "You will be asked a question."
5. Vote bars fill, one answer wins, the answer locks with a clear "lock" moment.
   Text: "The majority decides. The answer is locked in."
6. The aircraft turns and the flight path extends. Show a narrow win causing a
   slight turn and a clear win causing a sharp one. Label each turn on the map
   in degrees, as in navigation, not with the vote percentage.
   Text: "Every answer changes our course."
7. Two more waypoints, faster, so the pattern is obvious without more text.
8. Pull back: the full route across the map, one destination now ahead.
   Text: "Your answers add up to a destination."
9. Arrival: the door opens onto bright light. We do not see what is outside.
10. Title card: "Shaping the future" and "You are not passengers. You set the
    course."

VISUAL DIRECTION
Dark background, one accent colour, clean geometric shapes. Calm and precise,
in the style of flight-deck displays and airport wayfinding. The aircraft is a
top-view silhouette with the proportions of an Airbus A350; no logos or
liveries. No sci-fi cliché (robots, glowing brains, matrix rain). No turbulence,
warnings, emergencies or anything that suggests danger in flight.

All text in English, large, a few words per screen, on screen long enough to
read twice. Audio is optional: a narration with one spoken line per scene can
be switched on and off with a key or a speaker symbol. The captions carry the
whole message, so nothing may depend on sound.

It will often be seen through screen sharing, at low frame rate and with heavy
compression. So: no thin lines, no fine detail, no subtle gradients, no fast
motion or quick cuts, strong contrast, and it must stay legible at 1280x720.

TECHNICAL
Build it as a browser-based animation (React + TypeScript + Vite) that scales
to any window size at 16:9. It starts on a key press or click, so I can begin
it after sharing my screen, and can be restarted the same way. Keep timings,
texts and colours in one config file so I can adjust them without touching the
animation code. It must run offline.

PROCESS
Before building anything, show me the storyboard as a sequence of static frames
with timings and the exact on-screen text, and wait for my approval.
