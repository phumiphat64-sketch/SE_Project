# ใช้ Node image
FROM node:20-alpine

# ตั้ง working directory
WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# build
RUN npm run build

# expose port
EXPOSE 3000

# run app
CMD ["npm", "start"]