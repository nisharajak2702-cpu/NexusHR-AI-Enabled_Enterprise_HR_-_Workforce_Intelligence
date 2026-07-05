import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
function removeField(raw, fieldName) {
  let result = '';
  let i = 0;
  let inString = false;
  let escaped = false;
  const fieldPattern = `"${fieldName}"`;
  while (i < raw.length) {
    const char = raw[i];
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
      inString = !inString;
      result += char;
      i++;
      continue;
    }
    if (!inString && raw.startsWith(fieldPattern, i)) {
      let j = i + fieldPattern.length;
      while (j < raw.length && /\s/.test(raw[j])) j++;
      if (raw[j] === ':') {
        result += fieldPattern + ':';
        j++;
        while (j < raw.length && /\s/.test(raw[j])) j++;
        let start = j;
        let end = j;
        if (raw[end] === '{' || raw[end] === '[') {
          const stack = [raw[end]];
          end++;
          let localInString = false;
          let localEscaped = false;
          while (end < raw.length && stack.length) {
            const c = raw[end];
            if (localEscaped) {
              localEscaped = false;
              end++;
              continue;
            }
            if (c === '\\') {
              localEscaped = true;
              end++;
              continue;
            }
            if (c === '"') {
              localInString = !localInString;
              end++;
              continue;
            }
            if (localInString) {
              end++;
              continue;
            }
            if (c === '{' || c === '[') {
              stack.push(c);
            } else if (c === '}' || c === ']') {
              const last = stack[stack.length - 1];
              if ((last === '{' && c === '}') || (last === '[' && c === ']')) {
                stack.pop();
              }
            }
            end++;
          }
          result += '[]';
          i = end;
          continue;
        }
        if (raw[end] === '"') {
          end++;
          while (end < raw.length) {
            if (raw[end] === '\\') end += 2;
            else if (raw[end] === '"') { end++; break; }
            else end++;
          }
          result += 'null';
          i = end;
          continue;
        }
        while (end < raw.length && !/[,\]}]/.test(raw[end])) end++;
        result += 'null';
        i = end;
        continue;
      }
    }
    result += char;
    i++;
  }
  return result;
}
const cleaned = removeField(raw, 'documents');
console.log('cleaned len', cleaned.length);
try {
  const parsed = JSON.parse(cleaned);
  console.log('parsed ok', typeof parsed, Object.keys(parsed).slice(0,10));
  console.log('content len', parsed.content?.length, 'data len', parsed.data?.length);
} catch (e) {
  console.error('parse failed', e.message);
}
