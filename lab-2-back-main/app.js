const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Логирование запросов в консоль
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============ ХРАНИЛИЩЕ ДАННЫХ ============
let students = [
  { id: 1, name: 'Магомед Арчаков', group: 'ПИЖ-б-о-25-2' },
  { id: 2, name: 'Мухаммад Гетогазов', group: 'ПИЖ-б-о-25-2' },
  { id: 3, name: 'Давлетмурзав Сайд-Эмин', group: 'ПИЖ-б-о-25-2' },
  { id: 4, name: 'Мержоев Ислам', group: 'ПИЖ-б-о-25-2' }
];

let nextId = 5;

// ============ CRUD-ОПЕРАЦИИ ============

// GET /students – получить всех (с поиском, сортировкой и пагинацией)
app.get('/students', (req, res) => {
  let result = [...students];

  // 1. Поиск по имени (search)
  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(searchLower));
  }

  // 2. Сортировка (sort=name&order=asc)
  if (req.query.sort) {
    const sortField = req.query.sort;
    const order = req.query.order === 'desc' ? -1 : 1;
    
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * order;
      if (a[sortField] > b[sortField]) return 1 * order;
      return 0;
    });
  }

  // 3. Пагинация (page=1&limit=10)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResult = result.slice(startIndex, endIndex);

  res.json({
    total: result.length,
    page: page,
    limit: limit,
    students: paginatedResult
  });
});

// GET /students/:id – получить одного
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' });
  }
  res.json(student);
});

// POST /students – создать
app.post('/students', (req, res) => {
  const { name, group } = req.body;

  // Валидация обязательных полей
  if (!name || !group) {
    return res.status(400).json({ error: 'Поля name и group обязательны' });
  }

  // Валидация типов (что name и group это строки)
  if (typeof name !== 'string' || typeof group !== 'string') {
    return res.status(400).json({ error: 'Поля name и group должны быть строками' });
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    group: group.trim()
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT /students/:id – обновить
app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Студент не найден' });
  }

  const { name, group } = req.body;

  if (name !== undefined && typeof name !== 'string') {
    return res.status(400).json({ error: 'Поле name должно быть строкой' });
  }
  if (group !== undefined && typeof group !== 'string') {
    return res.status(400).json({ error: 'Поле group должно быть строкой' });
  }

  students[index] = {
    id: id,
    name: name !== undefined ? name.trim() : students[index].name,
    group: group !== undefined ? group.trim() : students[index].group
  };

  res.json(students[index]);
});

// DELETE /students/:id – удалить (204 No Content)
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Студент не найден' });
  }

  students.splice(index, 1);
  res.status(204).send(); 
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});