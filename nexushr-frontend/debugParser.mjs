const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJuaXNoYSIsImlhdCI6MTc4MzA3NDQyNCwiZXhwIjoxNzgzMTYwODI0fQ.wrgcacXiqWMzmHpWGuvr09lcSeAZaW9kT7bvZ7DQaFI';
const url = 'http://localhost:8080/attendance?page=0&size=10';
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
console.log('status', res.status, 'content-type', res.headers.get('content-type'));
const text = await res.text();
console.log('length', text.length);
const trimmed = text.trim();
const opening = trimmed[0];
const matching = { '{': '}', '[': ']' };
let stack=[];
let inString=false;
let escaped=false;
let lastEmptyIdx=-1;
for (let i=0; i<trimmed.length; i++) {
  const char = trimmed[i];
  if (escaped) { escaped = false; continue; }
  if (char === '\\') { escaped=true; continue; }
  if (char === '"') { inString = !inString; continue; }
  if (inString) continue;
  if (char === '{' || char === '[') { stack.push(char); continue; }
  if (char === '}' || char === ']') {
    if (!stack.length) continue;
    const last = stack[stack.length-1];
    if (matching[last] === char) {
      stack.pop();
      if (!stack.length) {
        lastEmptyIdx = i;
        break;
      }
    }
  }
}
console.log('lastEmptyIdx', lastEmptyIdx, 'stack length', stack.length);
if (lastEmptyIdx !== -1) {
  const candidate = trimmed.slice(0, lastEmptyIdx+1);
  console.log('candidate_length', candidate.length);
  console.log('candidate_end', candidate.slice(-200));
  try {
    const parsed = JSON.parse(candidate);
    console.log('parsed ok, keys', Array.isArray(parsed)?'array':Object.keys(parsed).slice(0,10));
  } catch (e) {
    console.error('parse error', e.message);
    const tail = candidate.slice(-400);
    console.log('tail', tail);
  }
}
