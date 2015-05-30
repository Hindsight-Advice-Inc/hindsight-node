FROM mhart/alpine-node

ADD . /app
RUN cd /app && npm install


CMD cd /app && npm start
EXPOSE 3000

