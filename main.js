var heartbeats = {};
var Heart = require("./lib/heart.js").initialize(heartbeats);


function create(heartrate, name){
  heartbeats[name] = new Heart(heartrate, name);
  return heartbeats[name];
}


function destroy(name){

  if(heartbeats[name]){
    clearInterval(heartbeats[name].interval);
    heartbeats[name] = undefined;
  }
}


function heart(name){
  return heartbeats[name];
}


module.exports = exports = {
  all: heartbeats,
  create: create,
  createHeart: create,
  destroy: destroy,
  destroyHeart: destroy,
  heart: heart,  
  Heart: Heart
};