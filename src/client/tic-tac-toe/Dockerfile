# ==== CONFIGURE =====
# Use a Node base image
FROM node:17-alpine
# Set the working directory to /app inside the container
WORKDIR /code

# Copy app files
COPY package.json package-lock.json ./

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install -g @angular/cli@15.0.5
RUN npm ci

# copy directory
COPY . .

EXPOSE 4200

# Start the app
CMD npm start
