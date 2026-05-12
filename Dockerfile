# Use a specific, pinned version of Node.js as the base image
FROM node:20.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first
COPY package.json ./

# Install dependencies using npm
# If you have a package-lock.json, Silver prefers 'npm ci'
RUN npm install

# Copy the rest of your project files
COPY . .

# Silver requires --no-install-recommends for any apt-get commands
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# The command to start your development server
CMD ["npm", "run", "dev"]