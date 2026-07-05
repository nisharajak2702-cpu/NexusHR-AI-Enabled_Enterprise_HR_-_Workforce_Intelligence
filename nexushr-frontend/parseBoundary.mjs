const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJuaXNoYSIsImlhdCI6MTc4MzA3NDQyNCwiZXhwIjoxNzgzMTYwODI0fQ.wrgcacXiqWMzmHpWGuvr09lcSeAZaW9kT7bvZ7DQaFI';
const url = 'http://localhost:8080/attendance?page=0&size=10';
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const text = await res.text();
console.log('len', text.length);
const trimmed = text.trim();
for (let i = trimmed.length - 1; i >= 0; i--) {
  const candidate = trimmed.slice(0, i + 1);
  try {
    JSON.parse(candidate);
    console.log('parse succeeded at', i, 'candidate tail', candidate.slice(-200));
    break;
  } catch (e) {
    if (i % 2000 === 0) console.log('checked', i, 'failed');
    continue;
  }
}
