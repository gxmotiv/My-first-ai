import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline, 'Expected one inline application script');
new Script(inline[1], { filename: 'index.inline.js' });

const worker = readFileSync(new URL('../cloudflare/worker.js', import.meta.url), 'utf8');
// Convert the export declaration to a normal const solely for syntax parsing.
const parseableWorker = worker.replace(/^export default\s+/m, 'const WorkerEntry = ');
new Script(parseableWorker, { filename: 'cloudflare/worker.js' });

for (const marker of [
  'id="memoryDialog"',
  "const MEMORY_KEY='my_first_ai_v1_memory'",
  'function buildPromptForAI(q)',
  'function readAIAnswer(response)',
  "+'/api/chat'",
  'body:JSON.stringify({messages:[',
  'function setupVoiceInput()',
  'function speakText(text)',
  'id="voiceInput"',
  'id="memoryToggle"',
  'Research Planner is not live web search'
]) {
  assert.ok(html.includes(marker), 'Missing expected frontend marker: ' + marker);
}

for (const marker of [
  'const ALLOWED_ORIGINS = new Set([',
  '"https://gxmotiv.github.io"',
  'if (request.method === "OPTIONS")',
  'url.pathname !== "/api/chat"',
  'const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8"'
]) {
  assert.ok(worker.includes(marker), 'Missing expected Worker marker: ' + marker);
}

assert.doesNotMatch(html + worker, /(?:cfat_|cfut_)[A-Za-z0-9_-]{20,}/i, 'Do not commit Cloudflare API tokens');
console.log('PASS: frontend and Worker JavaScript parse; endpoint wiring, CORS, memory, voice, and honest research labels are present.');
