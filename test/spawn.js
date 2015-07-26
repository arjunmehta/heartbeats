var heartbeats = require('../main');
var heart = heartbeats.createHeart(1000);

heart.createEvent(1, function() {
    console.log('testing unreferencing...');
});

setTimeout(function() {}, 2000);

// should exit after 2 seconds
