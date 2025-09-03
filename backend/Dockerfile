# Base image with Node.js installed
FROM node:22

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Copy all source code into container
COPY . .

# Expose port your app listens on
EXPOSE 4000

# Start the backend server
CMD ["node", "--inspect=0.0.0.0:9229", "server.js"]

