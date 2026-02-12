const express = require('express');

const app = express();

const EventEmitter = require('events');
const event = new EventEmitter();

event.on('greet', () => {
  console.log("Hello");
});

event.emit('greet');




app.listen(3000, () => {
  console.log('server started');
})