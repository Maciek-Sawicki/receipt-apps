const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 

app.use(express.json()); 

let receiptItems = [];

app.get('/receiptItems', (req, res) => {
    res.json(receiptItems);
});

app.post('/receiptItems', (req, res) => {
    const newItem = req.body;
    newItem.id = Date.now();
    receiptItems.push(newItem);
    res.status(201).json(newItem);
});

app.put('/receiptItems/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body;
    const index = receiptItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        receiptItems[index] = { ...receiptItems[index], ...updatedItem };
        res.json(receiptItems[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

app.delete('/receiptItems/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    receiptItems = receiptItems.filter(item => item.id !== itemId);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
