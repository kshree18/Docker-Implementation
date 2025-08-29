import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', steps: '' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { 
    fetchRecipes() 
  }, [])

  async function fetchRecipes() {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API}/api/recipes`)
      setRecipes(res.data)
    } catch (err) {
      console.error('Error fetching recipes:', err)
      setError('Failed to load recipes. Please check if the backend is running.')
    } finally { 
      setLoading(false) 
    }
  }

  async function addRecipe(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    
    setLoading(true)
    setError(null)
    
    const payload = {
      ...form,
      ingredients: form.ingredients.split(',').map(i => i.trim()),
      steps: form.steps.split('\n').map(s => s.trim())
    }
    
    try {
      const res = await axios.post(`${API}/api/recipes`, payload)
      setRecipes(prev => [res.data, ...prev])
      setForm({ title: '', description: '', ingredients: '', steps: '' })
    } catch (err) {
      console.error('Error adding recipe:', err)
      setError('Failed to add recipe. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  async function deleteRecipe(id) {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    
    try {
      await axios.delete(`${API}/api/recipes/${id}`)
      setRecipes(prev => prev.filter(recipe => recipe._id !== id))
    } catch (err) {
      console.error('Error deleting recipe:', err)
      setError('Failed to delete recipe.')
    }
  }

  async function updateRecipe(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    
    setLoading(true)
    setError(null)
    
    const payload = {
      ...form,
      ingredients: form.ingredients.split(',').map(i => i.trim()),
      steps: form.steps.split('\n').map(s => s.trim())
    }
    
    try {
      const res = await axios.put(`${API}/api/recipes/${editingId}`, payload)
      setRecipes(prev => prev.map(recipe => 
        recipe._id === editingId ? res.data : recipe
      ))
      setForm({ title: '', description: '', ingredients: '', steps: '' })
      setEditingId(null)
    } catch (err) {
      console.error('Error updating recipe:', err)
      setError('Failed to update recipe.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(recipe) {
    setEditingId(recipe._id)
    setForm({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join(', '),
      steps: recipe.steps.join('\n')
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ title: '', description: '', ingredients: '', steps: '' })
  }

  return (
    <div className="app-root">
      <header className="hero">
        <h1 className="title">🍳 Beautiful Recipes</h1>
        <p className="subtitle">Share and discover amazing recipes</p>
      </header>

      <main className="container">
        <div className="form-card">
          <h2 className="form-title">{editingId ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <form className="add-form" onSubmit={editingId ? updateRecipe : addRecipe}>
            <input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              placeholder="Recipe title" 
              className="input-field"
            />
            <textarea 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              placeholder="Short description" 
              className="input-field textarea"
            />
            <input 
              value={form.ingredients} 
              onChange={e => setForm({ ...form, ingredients: e.target.value })} 
              placeholder="Ingredients (comma separated)" 
              className="input-field"
            />
            <textarea 
              value={form.steps} 
              onChange={e => setForm({ ...form, steps: e.target.value })} 
              placeholder="Steps (one per line)" 
              className="input-field textarea"
            />
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : (editingId ? 'Update Recipe' : 'Add Recipe')}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="recipes-section">
          <h2 className="section-title">All Recipes ({recipes.length})</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading delicious recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="empty-state">
              <p>🍽️ No recipes yet. Add your first recipe above!</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <div key={recipe._id} className="recipe-card">
                  <div className="recipe-header">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <div className="recipe-actions">
                      <button 
                        className="btn-icon edit-btn" 
                        onClick={() => startEdit(recipe)}
                        title="Edit recipe"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon delete-btn" 
                        onClick={() => deleteRecipe(recipe._id)}
                        title="Delete recipe"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="recipe-description">{recipe.description}</p>
                  
                  <div className="recipe-section">
                    <h4>Ingredients:</h4>
                    <ul className="ingredients-list">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="ingredient-item">
                          <span className="ingredient-bullet">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="recipe-section">
                    <h4>Steps:</h4>
                    <ol className="steps-list">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx} className="step-item">
                          <span className="step-number">{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="recipe-meta">
                    <span className="recipe-date">
                      Added {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="footer">
          <p>Powered by Docker • MongoDB • Node • React</p>
        </footer>
      </main>
    </div>
  )
}
