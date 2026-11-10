const express = require('express');
const app = express();
const port = 3000;

// 1. Текстовый эндпоинт
app.get('/', (req, res) => {
  res.send('API Gateway');
});

// 2. JSON-эндпоинт 1 (сущность — студенты)
app.get('/api/students', (req, res) => {
  res.json([
    { id: 1, name: 'Евлоев Шовхал', group: 'IBIT-31', year: 2 },
    { id: 2, name: 'Дзауров Муса', group: 'IBIT-32', year: 2 },
    { id: 3, name: 'Джандаров Исмелхан', group: 'IBIT-31', year: 2 },
    { id: 4, name: 'Гетогазов Ахмедхан', group: 'IBIT-33', year: 1 }
  ]);
});

// 3. JSON-эндпоинт 2 (справочник — группы)
app.get('/api/groups', (req, res) => {
  res.json([
    { id: 1, name: 'IBIT-31', course: 2, studentsCount: 25 },
    { id: 2, name: 'IBIT-32', course: 2, studentsCount: 23 },
    { id: 3, name: 'IBIT-33', course: 1, studentsCount: 27 },
    { id: 4, name: 'IBIT-34', course: 1, studentsCount: 24 }
  ]);
});

// 4. Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});