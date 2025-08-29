import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Recipe from './models/Recipe.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipes';


async function start() {
try {
await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');


// API endpoints
app.get('/api/recipes', async (req, res) => {
const recipes = await Recipe.find().sort({ createdAt: -1 });
res.json(recipes);
});


app.post('/api/recipes', async (req, res) => {
const { title, description, ingredients, steps } = req.body;
if (!title) return res.status(400).json({ error: 'title is required' });
const recipe = new Recipe({ title, description, ingredients, steps });
await recipe.save();
res.status(201).json(recipe);
});


app.put('/api/recipes/:id', async (req, res) => {
const { id } = req.params;
const updates = req.body;
const recipe = await Recipe.findByIdAndUpdate(id, updates, { new: true });
if (!recipe) return res.status(404).json({ error: 'not found' });
res.json(recipe);
});


app.delete('/api/recipes/:id', async (req, res) => {
const { id } = req.params;
await Recipe.findByIdAndDelete(id);
res.status(204).end();
});


app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
} catch (err) {
console.error('Failed to start server:', err);
process.exit(1);
}
}


start();