FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT_START=3001
ENV PORT_MAX=3001
ENV DATA_DIR=/app/data

# Create data directory
RUN mkdir -p /app/data

# Run the application
CMD ["node", "dist/app.js"]
