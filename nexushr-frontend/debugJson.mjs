import fs from 'fs';
import path from 'path';
const filePath = path.resolve('response_attendance.txt');
const text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
if (!text) {
  console.error('response_attendance.txt not found');
  process.exit(1);
}
const trimmed = text.trim();
console.log('length', trimmed.length);
const idx = trimmed.indexOf('"documents"');
console.log('first documents idx', idx);
console.log(trimmed.slice(Math.max(0, idx-200), Math.min(trimmed.length, idx+800)));
let stack = [];
let inString = false;
let escaped = false;
for (let i = 0; i < trimmed.length; i++) {
  const c = trimmed[i];
  if (escaped) { escaped = false; continue; }
  if (c === '\\') { escaped = true; continue; }
  if (c === '"') { inString = !inString; continue; }
  if (inString) continue;
  if (c === '{' || c === '[') stack.push(c);
  else if (c === '}' || c === ']') {
    if (!stack.length) continue;
    const last = stack[stack.length-1];
    if ((last === '{' && c === '}') || (last === '[' && c === ']')) {
      stack.pop();
      if (!stack.length) {
        console.log('top-level close at', i);
        console.log('tail after', JSON.stringify(trimmed.slice(i+1, i+80)));
        break;
      }
    }
  }
}
