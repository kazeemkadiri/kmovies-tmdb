FROM nikolaik/python-nodejs:latest
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY dist /app
COPY .env /app
EXPOSE 8080
CMD ["npm", "run" ,"start"]
