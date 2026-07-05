import fetch from 'node-fetch';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        if (inString) continue;
        if (char === '{' || char === '[') {
            stack.push(char);
            continue;
        }
        if (char === '}' || char === ']') {
            if (!stack.length) continue;
            const last = stack[stack.length - 1];
            if (matching[last] === char) {
                stack.pop();
                if (!stack.length) {
                    const candidate = trimmed.slice(0, i + 1);
                    try { return JSON.parse(candidate); } catch (e) { console.error('candidate parse failed at', i, e.message); continue; }
                }
            }
        }
    }
    return JSON.parse(trimmed);
};

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJuaXNoYSIsImlhdCI6MTc4MzA3NDQyNCwiZXhwIjoxNzgzMTYwODI0fQ.wrgcacXiqWMzmHpWGuvr09lcSeAZaW9kT7bvZ7DQaFI';
const endpoints = ['http://localhost:8080/attendance?page=0&size=10', 'http://localhost:8080/leave?page=0&size=10'];
for (const url of endpoints) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const text = await res.text();
    console.log('URL', url, 'status', res.status, 'len', text.length);
    console.log('start', text.slice(0, 200));
    console.log('end', text.slice(-200));
    try {
        const parsed = parseFirstJson(text);
        console.log('parsed type', typeof parsed, 'keys', Array.isArray(parsed) ? 'array' : Object.keys(parsed).slice(0,10), 'content len', parsed?.content?.length, 'data len', parsed?.data?.length);
    } catch (error) {
        console.error('parse failed', error.message);
    }
}
