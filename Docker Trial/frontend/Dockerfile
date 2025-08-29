# --- Build Stage ---
FROM node:18-alpine AS build
WORKDIR /app

# copy only package.json first
COPY package.json ./

# install deps
RUN npm install

# now copy rest of the code
COPY . .

# build React app
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
