FROM nikolaik/python-nodejs:latest
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . /app
EXPOSE 8080
CMD ["npm", "run" ,"start"]
