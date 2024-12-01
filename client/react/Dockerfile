FROM node:18-alpine

# Set the working directory
WORKDIR /client/react

# Remove existing node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json

# Copy only package.json (you can include package-lock.json if you want version lock)
COPY package.json .

# Set Node.js options to increase stack size and memory
#ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies, including specific versions of esbuild, vite, rollup, and @rollup/plugin-circular-dependency
#RUN npm install esbuild@latest vite@latest rollup@latest rollup-plugin-circular-dependencies

# Install the missing @rollup/pluginutils package
#RUN npm install --save-dev @rollup/pluginutils

# Install dependencies
RUN npm install

RUN npm audit fix

# Update all dependencies to the latest compatible versions
# RUN npm update

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build --verbose

# Expose the port the React app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]