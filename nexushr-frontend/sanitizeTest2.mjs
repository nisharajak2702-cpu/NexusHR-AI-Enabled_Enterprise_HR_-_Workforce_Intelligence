import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
const sanitize = (text) => {
  return text
    .replace(/"documents"\s*:\s*\]/g, '"documents":[]')
    .replace(/"documents"\s*:\s*\},/g, '"documents":[],')
    .replace(/"documents"\s*:\s*\}/g, '"documents":[]}');
};
for (const label of ['raw', 'sanitized']) {
  const text = label === 'raw' ? raw : sanitize(raw);
  console.log('---', label, 'len', text.length);
  try {
    const parsed = JSON.parse(text);
    console.log('JSON parse ok', label, typeof parsed, Array.isArray(parsed) ? parsed.length : Object.keys(parsed).slice(0,20));
    console.log('content len', parsed.content?.length, 'data len', parsed.data?.length);
    break;
  } catch (e) {
    console.error('parse failed', label, e.message);
    const end = text.slice(-120);
    console.log('tail', end);
  }
}
