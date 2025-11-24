# Use Node
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json files
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]