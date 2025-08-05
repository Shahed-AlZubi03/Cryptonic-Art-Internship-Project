const express = require('express');
const app= express();
const PORT = 3100;

app.use(express.json());

to_do_list=[{
  "id": 1,
  "text": "Finish homework",
  "completed": false
}
]

app.get('/',(req,res)=>{
    res.send('Welcome to the To-Do List API', res.json(to_do_list));
});

app.post('/to_do_list', (req, res) => {
    // const completedTasks = to_do_list.filter(task => task.completed);

    const {id, text, completed}= req.body;
     if (! id || !text || completed === undefined)  return res.status(400).json({error: 'Invalid data'});
    const newTask = { id, text, completed };
    to_do_list.push(newTask)
    res.status(201).json(newTask);
});


// put - whole replacement
 app.put('/to_do_list/:id', (req, res) => {
    const Id =parseInt(req.params.id);
    const index= to_do_list.findIndex(i => i.id === Id);
    if (index === -1) return res.status(404).json({ error: 'ID NOT FOUND' });
    const { id, text, completed } = req.body;
    if (id === undefined || text === undefined || completed === undefined) return res.status(400).json({ error: 'Invalid data' });
    const updatedTask = { id, text, completed };
    to_do_list[index] = updatedTask;   
    res.status(200).json(updatedTask);

 });

// patch - partial update
app.patch('/to_do_list/:id', (req, res) => {
    const Id =parseInt(req.params.id);
    const index= to_do_list.findIndex(i => i.id === Id);
    if (!index) return res.status(404).send('Item not found');
 
    const { text, completed } = req.body;
    if (text !== undefined) to_do_list[index].text = text;
    if (completed !== undefined)  to_do_list[index].completed = completed;
    res.status(200).json(to_do_list);
    

});
// delete - remove by id
app.delete('/to_do_list/:id', (req, res) => {
    const Id =parseInt(req.params.id);
    const index= to_do_list.findIndex(i => i.id === Id);
    if (index === -1) return res.status(404).json({ error: 'ID NOT FOUND' });
    to_do_list.splice(index, 1);
    res.status(204).send(); // No content to return
    res.status.json(to_do_list)
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
