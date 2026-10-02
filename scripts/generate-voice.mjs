// Generates one narration clip per scene with Google Cloud Text-to-Speech and
// writes them to src/voice/<scene>.mp3. Run with `npm run voice`, or name the
// scenes to redo only those: `npm run voice -- question vote`.
//
// Needs the gcloud CLI, logged in, and a project with billing and the
// Text-to-Speech API enabled. The project is taken from GCP_PROJECT or, if
// unset, from the active gcloud configuration.

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { config } from '../src/config.ts'

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()

const project = process.env.GCP_PROJECT || run('gcloud', ['config', 'get-value', 'project'])
const token = run('gcloud', ['auth', 'print-access-token'])
const outDir = new URL('../src/voice/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const { name, languageCode, lines } = config.voice
const only = process.argv.slice(2)

for (const [scene, line] of Object.entries(lines)) {
  if (only.length > 0 && !only.includes(scene)) continue
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': project,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text: line.text },
      voice: { languageCode, name },
      audioConfig: { audioEncoding: 'MP3' },
    }),
  })
  if (!res.ok) throw new Error(`${scene}: ${res.status} ${await res.text()}`)

  const file = new URL(`${scene}.mp3`, outDir)
  writeFileSync(file, Buffer.from((await res.json()).audioContent, 'base64'))

  let seconds = '?'
  try {
    seconds = Number(
      run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fileURLToPath(file)]),
    ).toFixed(1)
  } catch {
    // ffprobe is optional; it only reports the clip length.
  }
  console.log(`${scene.padEnd(10)} ${seconds} s  (starts ${line.at} s into the scene)`)
}
