FROM node:on-build
EXPORT 8080
RUN npm install
CMD npm start
