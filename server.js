const express = require('express');
const helmet = require('helmet');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(
  express.json(),
  helmet(), 
  logger
  );

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);


//custom middleware


function logger(req, res, next) {
const currentTime = new Date();
const clockTime = "At: " + currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

console.log(`A ${req.method} request to '${req.url}'`);
console.log(`${clockTime}`)
next();
};

module.exports = server;
