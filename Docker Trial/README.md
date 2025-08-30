# Beautiful Recipes

A full-stack recipe management application to share and discover amazing recipes.  
The backend is built with Node.js, Express, and MongoDB, while the frontend is a React application.  
The entire app is containerized using Docker and orchestrated with Docker Compose.


## Technology Stack

- Backend: Node.js, Express, Mongoose, MongoDB
- Frontend: React, Axios, Vite
- Database: MongoDB (official Docker image)
- Containerization: Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your machine
- Optional: Node.js and npm/yarn if you want to run backend or frontend separately

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Create a `.env` file in the root directory with the following environment variables:

   ```
   MONGODB_URI=mongodb://mongodb:27017/recipes
   MONGO_INITDB_ROOT_USERNAME=your_mongo_root_username
   MONGO_INITDB_ROOT_PASSWORD=your_mongo_root_password
   ```

3. Start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Access the frontend at [http://localhost](http://localhost)  
   The backend API will be available at [http://localhost:5000/api/recipes](http://localhost:5000/api/recipes)

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Add a new recipe  
  Request body: `{ title, description, ingredients, steps }`
- `PUT /api/recipes/:id` - Update a recipe by ID  
  Request body: fields to update
- `DELETE /api/recipes/:id` - Delete a recipe by ID

## Frontend Usage

- Add a new recipe using the form
- Edit a recipe by clicking the edit icon ✏️
- Delete a recipe by clicking the trash icon 🗑️
- Ingredients are entered as comma-separated values
- Steps are entered one per line

## Project Structure

- `backend/` - Node.js backend source code and Dockerfile
- `frontend/` - React frontend source code and Dockerfile
- `docker-compose.yml` - Docker Compose configuration to run backend, frontend, and MongoDB


