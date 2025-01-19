# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --force
# Copy the rest of the application files
COPY . .

# Build the app for production
RUN npm run build

# Expose the port that the app will run on
EXPOSE 6000

# Command to start the app
CMD ["npm", "start"]