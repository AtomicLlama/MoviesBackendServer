FROM node:4-onbuild
EXPOSE 8080
RUN npm install
CMD npm start
