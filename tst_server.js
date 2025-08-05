const express = require('express');
const app = express();
const PORT= 4000;
courses= [
  { id: 1, title: 'JavaScript Basics', description: 'Learn the fundamentals of JavaScript' },
  { id: 2, title: 'Node.js for Beginners', description: ' Introduction to Node.js and its ecosystem' },]
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the Courses Management API');
});

app.get('/api/courses/:id', (req, res) => {
const course = courses.find(c => c.id === parseInt(req.params.id));
if (!course) return res.status(404).send('Course not found');
  res.json(course);
  console.log(course);
});

app.post('/api/courses', (req, res) => {
  const id = courses.length + 1;
  const {title, description} = req.body;
  const newCourse = { id, title, description };
  courses.push(newCourse);  
  res.status(201).json(newCourse);
  console.log(newCourse);
});

app.delete('/delete/:id',(req,res)=> {
  const index = parseInt(req.params.id);
  if (index < 0 || index >= courses.length) return res.status(404).send('Course not found');
  if (index === undefined) return res.status(400).send('Invalid course ID');
  courses.splice(index,1);
  res.status(204).send();
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
