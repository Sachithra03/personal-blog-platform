# Use Node 18, which is an excellent choice for a modern backend
FROM node:18

# Create app directory
WORKDIR /app

# The critical fix: Copy the package.json files from the 'backend' folder
# into the Docker container's current working directory ('/app').
COPY backend/package*.json ./

# Install dependencies (This requires the package.json files to be present)
RUN npm install

# Copy everything else from the 'backend' folder to the current directory ('/app')
COPY backend/. .

# Expose port (ensure this matches the port your server.js is listening on)
EXPOSE 5000

# Start server
CMD ["npm", "start"]