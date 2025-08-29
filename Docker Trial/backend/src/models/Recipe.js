import mongoose from 'mongoose';


const RecipeSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String },
ingredients: [String],
steps: [String],
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Recipe', RecipeSchema);