
var heartbeats = {};
var Heart = require("./lib/heart.js").initialize(heartbeats);

// create a new heartbeat and add it to the internal list.

function create(heartrate, name){
  heartbeats[name] = new Heart(heartrate, name);
  return heartbeats[name];
}


// destroys a heartbeat and removes it from the internal heartbeat list

function destroy(name){

  if(heartbeats[name]){
    clearInterval(heartbeats[name].interval);
    heartbeats[name] = undefined;
  }
}


// a convenience method that returns a heart(beat) from the internal list of heartbeats.

function heart(name){
  return heartbeats[name];
}


// export all our functions and aliases

module.exports = exports = {
  all: heartbeats,
  create: create,
  createHeart: create,
  destroy: destroy,
  destroyHeart: destroy,
  heart: heart,  
  Heart: Heart
};