# Use an official Node.js image as a base
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the source code
COPY . .

# Expose the port
EXPOSE 3000

# Run the command to start the application
CMD ["bun", "run", "start"]