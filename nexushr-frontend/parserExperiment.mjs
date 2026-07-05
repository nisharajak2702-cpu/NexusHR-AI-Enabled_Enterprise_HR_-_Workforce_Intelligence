import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
const sanitizeDocuments = (text) => {
  let result = '';
  let i = 0;
  let inString = false;
  let escaped = false;
  while (i < text.length) {
    const char = text[i];
    if (escaped) {
      result += char;
      escaped = false;
      i++;
      continue;
    }
    if (char === '\\') {
      result += char;
      escaped = true;
      i++;
      continue;
    }
    if (char === '"') {
      result += char;
      inString = !inString;
      i++;
      continue;
    }
    if (!inString && text.startsWith('"documents"', i)) {
      result += '"documents"';
      i += '"documents"'.length;
      while (i < text.length && /\s/.test(text[i])) { result += text[i]; i++; }
      if (i < text.length && text[i] === ':') {
        result += ':';
        i++;
        while (i < text.length && /\s/.test(text[i])) { result += text[i]; i++; }
        if (i >= text.length) break;
        const next = text[i];
        if (next === '{' || next === '[') {
          const matching = { '{': '}', '[': ']' };
          const stack = [next];
          result += '[]';
          i++;
          let inStr = false;
          let esc = false;
          while (i < text.length && stack.length) {
            const c = text[i];
            if (esc) { esc = false; i++; continue; }
            if (c === '\\') { esc = true; i++; continue; }
            if (c === '"') { inStr = !inStr; i++; continue; }
            if (inStr) { i++; continue; }
            if (c === '{' || c === '[') { stack.push(c); }
            else if (c === '}' || c === ']') {
              const top = stack[stack.length-1];
              if ((top === '{' && c === '}') || (top === '[' && c === ']')) stack.pop();
            }
            i++;
          }
          continue;
        }
        if (next === ']' || next === '}') {
          result += '[]';
          i++;
          continue;
        }
        result += '[]';
        while (i < text.length && /[^,\]}]/.test(text[i])) i++;
        continue;
      }
      continue;
    }
    result += char;
    i++;
  }
  return result;
};
const clean = sanitizeDocuments(raw);
console.log('clean len', clean.length);
try {
  const parsed = JSON.parse(clean);
  console.log('parsed ok', Object.keys(parsed).slice(0,10), parsed.data?.length, parsed.content?.length);
} catch (e) {
  console.error('parse failed', e.message);
}
const topLevel = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const open = trimmed[0];
  const close = open === '[' ? ']' : open === '{' ? '}' : null;
  if (!close) return JSON.parse(trimmed);
  let stack = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{' || c === '[') stack.push(c);
    else if (c === '}' || c === ']') {
      const last = stack[stack.length-1];
      const matching = { '{': '}', '[': ']' };
      if (matching[last] === c) {
        stack.pop();
        if (!stack.length) {
          return trimmed.slice(0, i+1);
        }
      }
    }
  }
  return trimmed;
};
try {
  const prefix = topLevel(clean);
  console.log('prefix len', prefix.length, 'suffix start', clean.slice(prefix.length, prefix.length+80));
  JSON.parse(prefix);
  console.log('prefix parse ok');
} catch (e) {
  console.error('prefix parse failed', e.message);
}
