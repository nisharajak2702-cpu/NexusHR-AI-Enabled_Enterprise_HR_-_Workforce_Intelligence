import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
const trimmed = raw.trim();
const oldParse = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const opening = trimmed[0];
  const closing = opening === '[' ? ']' : opening === '{' ? '}' : null;
  if (!closing) return JSON.parse(trimmed);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if (escaped) { escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (char === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (char === opening) { depth += 1; }
      else if (char === closing) {
          depth -= 1;
          if (depth === 0) {
              return JSON.parse(trimmed.slice(0, i + 1));
          }
      }
  }
  return JSON.parse(trimmed);
};
const newParse = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const opening = trimmed[0];
  const closing = opening === '[' ? ']' : opening === '{' ? '}' : null;
  if (!closing) return JSON.parse(trimmed);
  const matching = { '{': '}', '[': ']' };
  const stack = [];
  let inString = false;
  let escaped = false;
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
          const candidate = trimmed.slice(0, i + 1);
          try { return JSON.parse(candidate); } catch (e) { continue; }
        }
      }
    }
  }
  return JSON.parse(trimmed);
};

console.log('old parse attempt');
try { const parsed = oldParse(raw); console.log('old OK', Array.isArray(parsed)?parsed.length:Object.keys(parsed).length); } catch (e) { console.error('old FAIL', e.message); }
console.log('new parse attempt');
try { const parsed = newParse(raw); console.log('new OK', Array.isArray(parsed)?parsed.length:Object.keys(parsed).length); } catch (e) { console.error('new FAIL', e.message); }
