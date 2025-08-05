
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Actual middleware to modify the request and response objects.

// Example in-memory item list
let items = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'A fast and smooth mouse with USB-C',
    price: 19.99,
    inStock: true
  },
  {
    id: 2,
    name: "Bluetooth Keyboard",
    description: " wireless Keyboard with touchpad",
    price: 34.99,
    inStock: false
  }
];
// app.method(Path:string,handler:function)
/*  127.0.0.1:3000
app.get('/items', (sanad, sanad1) => {});

const sanad = {
    name:'sanad',
    age: 20,
    calcYOB:()=>{
        return 2023 - sanad.age;
    }
}
console.log(sanad.calcYOB()); // 2003
*/

app.get('/',(req, res) => {
  res.send('Welcome to the Item Management API');
});
// all items
app.get('/items', (req, res) => {
  res.json(items);
});

// POST - Add a new item with full details
app.post('/items', (req, res) => {
  const { name, description, price, inStock } = req.body;
  let newItem = {
  id: items.length + 1,
  name,
  description,
  price,
  inStock
};
  items.push(newItem);
  res.status(201).json(newItem);
});

// PATCH - Partially update any field of the item
app.patch('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(404).send('Item not found!');
  

  const {name, description, price, inStock} = req.body;
  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (price !== undefined) item.price = price;
  if (inStock !== undefined) item.inStock = inStock;
  res.json(item);

});

// PUT - Replace the whole item
app.put('/items/:id', (req, res) => {

  const itemId = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === itemId);
  if (index === -1) {
    return res.status(404).send('Item not found');}

  const { id, name, description, price, inStock } = req.body;

  if ( id === undefined || name === undefined || description === undefined || price === undefined || inStock === undefined) 
    return res.status(400).send(' all fields required to be included!!!');

  else{ items[index] = { id, name, description, price, inStock };
  res.json(items[index]);}


 });

// DELETE - Remove item by ID
app.delete('/items/:id', (req, res) => {
const itemId = parseInt(req.params.id);
const index = items.findIndex(i => i.id === itemId);

if (index === -1) return res.status(404).send('Item not found');
  
const deleted = items.splice(index, 1);
  res.json(deleted);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
