import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
function skipValue(str, pos) {
    while (pos < str.length && /\s/.test(str[pos])) pos++;
    if (pos >= str.length) return pos;
    const startChar = str[pos];
    if (startChar === '{' || startChar === '[') {
        const matching = { '{': '}', '[': ']' };
        const stack = [startChar];
        let inString = false;
        let escaped = false;
        pos++;
        while (pos < str.length && stack.length) {
            const char = str[pos];
            if (escaped) { escaped = false; pos++; continue; }
            if (char === '\\') { escaped = true; pos++; continue; }
            if (char === '"') { inString = !inString; pos++; continue; }
            if (inString) { pos++; continue; }
            if (char === '{' || char === '[') { stack.push(char); }
            else if (char === '}' || char === ']') {
                const top = stack[stack.length - 1];
                if (matching[top] === char) { stack.pop(); }
                else {
                    if (!stack.length) { break; }
                }
            }
            pos++;
        }
        return pos;
    }
    if (startChar === '"') {
        pos++;
        while (pos < str.length) {
            const char = str[pos];
            if (char === '\\') { pos += 2; continue; }
            if (char === '"') { pos++; break; }
            pos++;
        }
        return pos;
    }
    while (pos < str.length && !/[\s,\]\}]/.test(str[pos])) pos++;
    return pos;
}
function sanitizeDocuments(raw) {
    let result = '';
    let i = 0;
    let inString = false;
    let escaped = false;
    let lastNonSpace = '';
    while (i < raw.length) {
        const char = raw[i];
        if (escaped) { result += char; escaped = false; i++; continue; }
        if (char === '\\') { result += char; escaped = true; i++; continue; }
        if (char === '"') {
            result += char;
            inString = !inString;
            i++;
            continue;
        }
        if (!inString && char === '"' && (lastNonSpace === '{' || lastNonSpace === ',')) {
            const keyStart = i + 1;
            let j = keyStart;
            let keyEscaped = false;
            while (j < raw.length) {
                const c = raw[j];
                if (keyEscaped) { keyEscaped = false; j++; continue; }
                if (c === '\\') { keyEscaped = true; j++; continue; }
                if (c === '"') break;
                j++;
            }
            const key = raw.slice(keyStart, j);
            if (j >= raw.length) { result += char; i++; continue; }
            const afterKey = j + 1;
            let k = afterKey;
            while (k < raw.length && /\s/.test(raw[k])) k++;
            if (raw[k] === ':' && key === 'documents') {
                result += raw.slice(i, k + 1);
                result += '[]';
                i = skipValue(raw, k + 1);
                lastNonSpace = '';
                continue;
            }
        }
        if (!/\s/.test(char)) lastNonSpace = char;
        result += char;
        i++;
    }
    return result;
}
const cleaned = sanitizeDocuments(raw);
console.log('cleaned len', cleaned.length);
try {
    const parsed = JSON.parse(cleaned);
    console.log('parsed ok');
    console.log('top keys', Object.keys(parsed));
    if (parsed.data) console.log('data len', parsed.data.length, 'sample keys', Object.keys(parsed.data[0] || {}));
    if (parsed.content) console.log('content len', parsed.content.length);
} catch (e) {
    console.error('parse failed', e.message);
}
