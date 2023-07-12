const heartbeats = require('../main');

const heart = heartbeats.createHeart(1000);

heart.createEvent(1, { repeat: 3 }, () => {
  // console.log('testing unref... 1 repeat 3');
});

heart.createEvent(2, { repeat: 2 }, () => {
  // console.log('testing unref... 2 repeat 2');
});

heart.createEvent(3, { repeat: 1 }, () => {
  // console.log('testing unref... 3 repeat 1');
});

// should exit after 4 seconds
