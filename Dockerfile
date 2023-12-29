# Use the official Node.js image with version 16 as the base image
FROM node:16

# Set the working directory inside the container to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies using npm
RUN npm install

# Install TypeScript globally using npm
RUN npm install -g typescript

# Copy the entire application code to the working directory
COPY . .

# Run the build script defined in package.json
RUN npm run build

# Expose the specified port to the outside world
EXPOSE 3005

# Specify the command to run when the container starts
CMD [ "node", "dist/index.js" ]
