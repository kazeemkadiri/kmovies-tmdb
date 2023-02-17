# Development
FROM node:18-alpine
RUN apk add --no-cache g++ make py3-pip
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
EXPOSE 3000
CMD ["npm", "start"]
