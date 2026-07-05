const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJuaXNoYSIsImlhdCI6MTc4MzA3NDQyNCwiZXhwIjoxNzgzMTYwODI0fQ.wrgcacXiqWMzmHpWGuvr09lcSeAZaW9kT7bvZ7DQaFI';
const url = 'http://localhost:8080/attendance?page=0&size=10';
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const text = await res.text();
const idx = text.indexOf('{"timestamp"');
console.log('idx', idx, 'len', text.length);
if (idx !== -1) {
  const prefix = text.slice(0, idx);
  console.log('prefix end', prefix.slice(-120));
  try { JSON.parse(prefix); console.log('prefix parse ok'); } catch (e) { console.error('prefix parse failed', e.message); }
  const prefixTrim = prefix.trim();
  console.log('trim end', prefixTrim.slice(-120));
  try { JSON.parse(prefixTrim); console.log('trim parse ok'); } catch (e) { console.error('trim parse failed', e.message); }
}
