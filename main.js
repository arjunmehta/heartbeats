var hearts = {};
var Heart = require("./lib/heart.js").initialize(hearts);

function create(heartrate, name){
  hearts[name] = new Heart(heartrate, name);
  return hearts[name];
}

function destroy(name){
  if(hearts[name]){
    clearInterval(hearts[name].interval);
    hearts[name] = undefined;
  }
}

function heart(name){
  return hearts[name];
}

module.exports = exports = {
  all: hearts,
  create: create,
  createHeart: create,
  destroy: destroy, // will be deprecated
  destroyHeart: destroy, // will be deprecated
  killHeart: destroy,
  heart: heart,  
  Heart: Heart
};