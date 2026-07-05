import fs from 'fs';
import path from 'path';
const filePath = path.resolve('response_attendance.txt');
const text = fs.readFileSync(filePath, 'utf-8');
const trimmed = text.trim();
const matching = { '{': '}', '[': ']' };
let stack = [];
let inString = false;
let escaped = false;
for (let i = 0; i < trimmed.length; i++) {
  const c = trimmed[i];
  if (escaped) { escaped = false; continue; }
  if (c === '\\') { escaped = true; continue; }
  if (c === '"') { inString = !inString; continue; }
  if (inString) continue;
  if (c === '{' || c === '[') { stack.push(c); continue; }
  if (c === '}' || c === ']') {
    if (!stack.length) continue;
    const last = stack[stack.length - 1];
    if (matching[last] === c) {
      stack.pop();
      if (!stack.length) {
        const candidate = trimmed.slice(0, i + 1);
        console.log('candidate at', i, 'len', candidate.length);
        console.log('candidate tail', JSON.stringify(candidate.slice(-80)));
        console.log('suffix start', JSON.stringify(trimmed.slice(i+1, i+80)));
        try {
          JSON.parse(candidate);
          console.log('parsed okay');
        } catch (err) {
          console.log('parse failed', err.message);
        }
      }
    }
  }
}
