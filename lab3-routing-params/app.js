const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


let students = [
  { id: 1, name: 'Иванов Иван', group: 'ИС-21' },
  { id: 2, name: 'Петров Пётр', group: 'ИС-21' },
  { id: 3, name: 'Сидорова Анна', group: 'ПИ-22' },
  { id: 4, name: 'Кузнецов Олег', group: 'ПИ-22' },
  { id: 5, name: 'Смирнова Мария', group: 'ИС-23' }
];

// Оценки студентов (вложенный ресурс)
const grades = [
  { id: 1, studentId: 1, subject: 'Математика', grade: 5 },
  { id: 2, studentId: 1, subject: 'Физика', grade: 4 },
  { id: 3, studentId: 2, subject: 'Математика', grade: 3 },
  { id: 4, studentId: 3, subject: 'Программирование', grade: 5 },
  { id: 5, studentId: 4, subject: 'Базы данных', grade: 4 }
];


// 1. GET /students — все студенты
app.get('/students', (req, res) => {
  res.json({ count: students.length, students });
});

// 2. GET /students/:id — один студент
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // 400 — нечисловой id
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  const student = students.find(s => s.id === id);

  // 404 — не найден
  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' });
  }

  res.json(student);
});

// 3. GET /students/:id/grades — вложенный ресурс (оценки студента)
app.get('/students/:id/grades', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' });
  }

  const studentGrades = grades.filter(g => g.studentId === id);

  res.json({
    student: student.name,
    group: student.group,
    count: studentGrades.length,
    grades: studentGrades
  });
});

// 4. GET /groups/:group/students — студенты группы
app.get('/groups/:group/students', (req, res) => {
  const group = req.params.group;

  const filtered = students.filter(
    s => s.group.toLowerCase() === group.toLowerCase()
  );

  res.json({
    group,
    count: filtered.length,
    students: filtered
  });
});

// 404 
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});