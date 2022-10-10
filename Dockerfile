FROM node:alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ENV PORT=3000
CMD ["npm", "start"]