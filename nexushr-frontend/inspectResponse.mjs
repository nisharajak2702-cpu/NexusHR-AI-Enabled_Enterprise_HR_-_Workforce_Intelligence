import { readFileSync } from 'fs';
const text = readFileSync('response_attendance.txt', 'utf-8');
let idx = -1;
for (let i = 0; i < 20; i++) {
  idx = text.indexOf('"documents"', idx + 1);
  if (idx === -1) break;
  console.log('occurrence', i, 'idx', idx, 'context:', JSON.stringify(text.slice(Math.max(0, idx-80), idx+120)));
}
const suffixIdx = text.indexOf('{"timestamp"');
console.log('timestamp idx', suffixIdx);
if (suffixIdx !== -1) {
  console.log('suffix start', JSON.stringify(text.slice(suffixIdx, suffixIdx+200)));
}
