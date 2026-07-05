import { readFileSync } from 'fs';
const raw = readFileSync('response_attendance.txt', 'utf-8');
const repairs = [
  { name: 'd1', text: raw.replace(/"documents"\s*:\s*\]/g, '"documents":[]') },
  { name: 'd2', text: raw.replace(/"documents"\s*:\s*\]/g, '"documents":[]').replace(/"documents"\s*:\s*\}/g, '"documents":{}}') },
  { name: 'd3', text: raw.replace(/"documents"\s*:\s*\]/g, '"documents":[]').replace(/"documents"\s*:\s*\}/g, '"documents":[]}') },
  { name: 'd4', text: raw.replace(/"documents"\s*:\s*\]/g, '"documents":[]').replace(/"documents"\s*:\s*""/g, '"documents":[]') }
];
for (const { name, text } of repairs) {
  console.log('===', name, 'len', text.length);
  try {
    const parsed = JSON.parse(text);
    console.log('PARSED ok', name, Array.isArray(parsed) ? parsed.length : Object.keys(parsed).slice(0,20));
    break;
  } catch (e) {
    console.error('FAIL', name, e.message);
    const m = e.message.match(/at position (\d+)/);
    if (m) {
      const pos = Number(m[1]);
      console.log('error pos', pos, 'tail', text.slice(pos-60, pos+60));
    }
  }
}
