FROM mhart/alpine-node

ADD . /app
RUN cd /app && npm install


CMD npm start
EXPOSE 3000

