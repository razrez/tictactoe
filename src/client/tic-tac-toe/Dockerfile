# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:17-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY package.json .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN npm ci
RUN npm install

# copy directory
COPY . .

# ==== RUN =======
# Set the env to "production"
# ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
# EXPOSE 4200
EXPOSE 80
# Start the app
CMD ["npm", "start"]
