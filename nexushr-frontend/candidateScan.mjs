import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
const trimmed = raw.trim();
const matching = { '{': '}', '[': ']' };
let stack = [];
let inString = false;
let escaped = false;
const candidatePositions = [];
for (let i = 0; i < trimmed.length; i++) {
  const char = trimmed[i];
  if (escaped) { escaped = false; continue; }
  if (char === '\\') { escaped = true; continue; }
  if (char === '"') { inString = !inString; continue; }
  if (inString) continue;
  if (char === '{' || char === '[') { stack.push(char); continue; }
  if (char === '}' || char === ']') {
    if (!stack.length) continue;
    const last = stack[stack.length - 1];
    if (matching[last] === char) {
      stack.pop();
      if (!stack.length) {
        candidatePositions.push(i);
      }
    }
  }
}
console.log('candidate count', candidatePositions.length, 'last 5', candidatePositions.slice(-5));
for (let j = 0; j < 10; j++) {
  const pos = candidatePositions[candidatePositions.length - 1 - j];
  const candidate = trimmed.slice(0, pos + 1);
  let ok = false;
  let err = '';
  try { JSON.parse(candidate); ok = true; } catch (e) { err = e.message; }
  console.log('pos', pos, 'ok', ok, 'err', ok ? '' : err, 'tail', candidate.slice(-80));
}
