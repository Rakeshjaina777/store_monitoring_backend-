# Step 1: Use Alpine-based Node image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Install only required dependencies early for better caching
COPY package*.json ./

# Optional: Install `python3` and `build-base` if you use native modules
# RUN apk add --no-cache python3 make g++ 

RUN npm ci

# Step 4: Copy app source code
COPY . .

# Step 5: Build the NestJS app
RUN npm run build

# Step 6: Run the app in production mode
CMD ["node", "dist/main"]
