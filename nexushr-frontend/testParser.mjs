import fs from 'fs';
import path from 'path';
const text = fs.readFileSync(path.resolve('response_attendance.txt'), 'utf-8');
const skipWhitespace = (text, index) => {
    while (index < text.length && /\s/.test(text[index])) {
        index += 1;
    }
    return index;
};
const skipString = (text, index) => {
    index += 1;
    let escaped = false;
    while (index < text.length) {
        const char = text[index];
        if (escaped) {
            escaped = false;
            index += 1;
            continue;
        }
        if (char === "\\") {
            escaped = true;
            index += 1;
            continue;
        }
        if (char === '"') {
            return index + 1;
        }
        index += 1;
    }
    return index;
};
const skipJsonValue = (text, index) => {
    index = skipWhitespace(text, index);
    if (index >= text.length) {
        return index;
    }
    const opening = text[index];
    if (opening === '{' || opening === '[') {
        const stack = [opening];
        index += 1;
        let inString = false;
        let escaped = false;
        while (index < text.length && stack.length) {
            const char = text[index];
            if (escaped) {
                escaped = false;
                index += 1;
                continue;
            }
            if (char === "\\") {
                escaped = true;
                index += 1;
                continue;
            }
            if (char === '"') {
                inString = !inString;
                index += 1;
                continue;
            }
            if (inString) {
                index += 1;
                continue;
            }
            if (char === '{' || char === '[') {
                stack.push(char);
            } else if (char === '}' || char === ']') {
                const last = stack[stack.length - 1];
                if ((last === '{' && char === '}') || (last === '[' && char === ']')) {
                    stack.pop();
                }
            }
            index += 1;
        }
        return index;
    }
    if (opening === '"') {
        return skipString(text, index);
    }
    while (index < text.length && !/[\s,\]\}]/.test(text[index])) {
        index += 1;
    }
    return index;
};
const replaceDocumentsValue = (text) => {
    const key = '"documents"';
    let result = '';
    let i = 0;
    while (i < text.length) {
        if (text[i] !== '"') {
            result += text[i];
            i += 1;
            continue;
        }
        const stringStart = i;
        i += 1;
        let escaped = false;
        while (i < text.length) {
            const char = text[i];
            if (escaped) {
                escaped = false;
                i += 1;
                continue;
            }
            if (char === "\\") {
                escaped = true;
                i += 1;
                continue;
            }
            if (char === '"') {
                i += 1;
                break;
            }
            i += 1;
        }
        const stringToken = text.slice(stringStart, i);
        const nextIndex = skipWhitespace(text, i);
        if (stringToken === key && nextIndex < text.length && text[nextIndex] === ':') {
            result += stringToken;
            result += text.slice(i, nextIndex + 1);
            const valueStart = skipWhitespace(text, nextIndex + 1);
            const valueEnd = skipJsonValue(text, valueStart);
            result += '[]';
            i = valueEnd;
            continue;
        }
        result += stringToken;
    }
    return result;
};
const parseFirstJson = (text) => {
    const cleanedText = replaceDocumentsValue(text);
    const trimmed = cleanedText.trim();
    const opening = trimmed[0];
    const matching = { '{': '}', '[': ']' };
    const stack = [];
    let inString = false;
    let escaped = false;
    for (let i = 0; i < trimmed.length; i++) {
        const char = trimmed[i];
        if (escaped) { escaped = false; continue; }
        if (char === "\\") { escaped = true; continue; }
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
                    try { return JSON.parse(candidate); } catch (err) { continue; }
                }
            }
        }
    }
    return JSON.parse(trimmed);
};
const parsed = parseFirstJson(text);
console.log('parsed keys:', Object.keys(parsed).slice(0,10));
console.log('content length', Array.isArray(parsed.content) ? parsed.content.length : 'not array');
