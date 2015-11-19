FROM node
EXPORT 80
RUN npm install
CMD npm start
