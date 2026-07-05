import api from "./src/api/axios.js";
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJuaXNoYSIsImlhdCI6MTc4MzA3NDQyNCwiZXhwIjoxNzgzMTYwODI0fQ.wrgcacXiqWMzmHpWGuvr09lcSeAZaW9kT7bvZ7DQaFI';
global.localStorage = { getItem: () => token };
const endpoints = [
  '/employees?page=0&size=10',
  '/attendance?page=0&size=10',
  '/leave?page=0&size=10',
  '/payroll?page=0&size=10',
  '/performance?page=0&size=10',
  '/documents?page=0&size=10'
];
for (const url of endpoints) {
  try {
    const response = await api.get(url, { headers: { Authorization: `Bearer ${token}` }, responseType: 'text' });
    console.log('---', url);
    console.log('status:', response.status);
    console.log('dataType:', typeof response.data);
    console.log('data keys:', Array.isArray(response.data) ? 'ARRAY' : Object.keys(response.data || {}).slice(0,20));
    if (typeof response.data === 'string') {
      console.log('firstChars:', response.data.slice(0,120));
      console.log('lastChars:', response.data.slice(-120));
    } else {
      console.log('contentLen:', response.data?.content?.length ?? response.data?.data?.length ?? response.data?.length);
      console.log('sample:', JSON.stringify(Array.isArray(response.data) ? response.data[0] : response.data?.content?.[0] ?? response.data?.data?.[0], null, 2));
    }
  } catch (error) {
    console.error('---', url, 'ERROR', error.toString());
    if (error.response) {
      console.error('respType:', typeof error.response.data);
      if (typeof error.response.data === 'string') {
        console.error('respSample:', error.response.data.slice(0,200));
      } else {
        console.error('respKeys:', Object.keys(error.response.data || {}).slice(0,20));
      }
    }
  }
}
