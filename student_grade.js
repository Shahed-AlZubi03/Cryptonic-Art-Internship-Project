const express = require('express');
const app = express();
const PORT = 3200;

app.use(express.json());

let student_grades = [
  {
    id: 1,
    name: "Shahed",
    grades: [
      { id: 1, subject: "ROS", grade: "B" },
      { id: 2, subject: "Mobile", grade: "A" }
    ] 
  },
  {
    id: 2,
    name: "Jude",
    grades: [
      { id: 1, subject: "Math", grade: "A" },
      { id: 2, subject: "AI", grade: "B" }
    ]
  }
];

app.get('/students', (req, res) => {
  res.json({
    message: "Welcome to the Student Grades API",
    data: student_grades
  });
});

// grades for a specific student by ID
app.get('/students/:id/grades', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = student_grades.find(s => s.id === studentId);
  if (!student) return res.status(404).send('Student not found');
  res.json(student.grades);
});

// new grade for a specific student
app.post('/students/:id/grades', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = student_grades.find(s => s.id === studentId);
  
  if (!student) return res.status(404).send('Student not found');

  const { id, subject, grade } = req.body;

  if (!id || !subject || !grade) return res.status(400).send('All fields (id, subject, grade) are required.');

  const newGrade = { id, subject, grade };
  student.grades.push(newGrade);
  res.status(201).json(newGrade);
});

// Update specific grade by grade ID
app.patch('/students/:id/grades/:gradeId', (req, res) => {
  const studentId = parseInt(req.params.id);
  const gradeId = parseInt(req.params.gradeId);
  const student = student_grades.find(s => s.id === studentId);
  if (!student) return res.status(404).send('Student not found');

  const grade = student.grades.find(g => g.id === gradeId);
  if (!grade) return res.status(404).send('Grade not found');

  const { subject, grade: updatedGrade } = req.body;
  if (subject !== undefined) grade.subject = subject;
  if (updatedGrade !== undefined) grade.grade = updatedGrade;

  res.json(grade);
});

// Remove a grade by student ID and grade ID
app.delete('/students/:id/grades/:gradeId', (req, res) => {
  const studentId = parseInt(req.params.id);
  const gradeId = parseInt(req.params.gradeId);

  const student = student_grades.find(s => s.id === studentId);
  if (!student) return res.status(404).send('Student not found');

  const index = student.grades.findIndex(g => g.id === gradeId);
  if (index === -1) return res.status(404).send('Grade not found');

  student.grades.splice(index, 1);
  res.json({ message: 'Grade deleted successfully.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
