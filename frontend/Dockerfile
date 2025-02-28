# Use official Alpine Linux as the base image
FROM alpine:latest

# Set the working directory in the container
WORKDIR /frontend

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the Angular project files into the container
COPY . /frontend/

# Install project dependencies (fix: remove 'package.json' and just run 'npm install')
RUN npm install

# Build the Angular project
RUN npm run build:prod

# Serve the application
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--configuration=production"]

