const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'response_attendance.txt');
const text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
if (!text) {
  console.error('response_attendance.txt not found');
  process.exit(1);
}
const parseFirstJson = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const opening = trimmed[0];
  const closing = opening === '[' ? ']' : opening === '{' ? '}' : null;
  if (!closing) {
      return JSON.parse(trimmed);
  }
  const matching = { '{': '}', '[': ']' };
  const stack = [];
  let inString = false;
  let escaped = false;
  for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if (escaped) {
          escaped = false;
          continue;
      }
      if (char === '\\') {
          escaped = true;
          continue;
      }
      if (char === '"') {
          inString = !inString;
          continue;
      }
      if (inString) {
          continue;
      }
      if (char === '{' || char === '[') {
          stack.push(char);
          continue;
      }
      if (char === '}' || char === ']') {
          if (!stack.length) {
              continue;
          }
          const last = stack[stack.length - 1];
          if (matching[last] === char) {
              stack.pop();
              if (!stack.length) {
                  const candidate = trimmed.slice(0, i + 1);
                  try {
                      return JSON.parse(candidate);
                  } catch (err) {
                      console.error('candidate parse failed at', i, err.message);
                      continue;
                  }
              }
          }
      }
  }
  return JSON.parse(trimmed);
};
try {
  const parsed = parseFirstJson(text);
  console.log('parsed success, keys', Object.keys(parsed).slice(0,10));
} catch (err) {
  console.error('parseFirstJson error', err.message);
}
const trimmed = text.trim();
let stack = [];
let inString=false;
let escaped=false;
for (let i=0;i<trimmed.length;i++) {
  const c = trimmed[i];
  if (escaped) { escaped=false; continue; }
  if (c==='\\') { escaped=true; continue; }
  if (c==='"') { inString=!inString; continue; }
  if (inString) continue;
  if (c==='{'||c==='[') stack.push(c);
  else if (c==='}'||c===']') {
      if (!stack.length) continue;
      const last = stack[stack.length-1];
      if ((last==='{'&&c==='}')||(last==='['&&c===']')) {
          stack.pop();
          if (!stack.length) {
              console.log('top-level close at', i);
              console.log('tail after', JSON.stringify(trimmed.slice(i+1, i+80)));
              break;
          }
      }
  }
}
