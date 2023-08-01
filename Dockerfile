# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose a port (if your application needs it)
EXPOSE 3000

# Specify the command to run your application
CMD [ "npm","run","start:prod" ]