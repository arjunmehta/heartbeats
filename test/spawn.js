var heartbeats = require('../main');
var heart = heartbeats.createHeart(1000);

setTimeout(function() {}, 2000);

// should exit after 2 seconds
