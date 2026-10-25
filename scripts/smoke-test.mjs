import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, 'Expected one inline application script');
new Script(match[1], { filename: 'index.inline.js' });

for (const marker of [
  'id="memoryDialog"',
  "const MEMORY_KEY='my_first_ai_v1_memory'",
  'function buildPromptForAI(q)',
  'JSON.stringify({message:buildPromptForAI(q)})',
  'function setupVoiceInput()',
  'function speakText(text)',
  'id="voiceInput"',
  'id="memoryToggle"',
  'Research Planner is not live web search'
]) {
  assert.ok(html.includes(marker), 'Missing expected feature marker: ' + marker);
}

assert.doesNotMatch(html, /(?:cfat_|cfut_)[A-Za-z0-9_-]{20,}/i, 'Do not commit Cloudflare API tokens');
console.log('PASS: inline JavaScript parses; memory, context, voice controls, and truthful research labels are present.');
