var hearts = {};
var Heart = require("./lib/heart.js").initialize(hearts);

function createHeart(heartrate, name){
  var heart = new Heart(heartrate, name);
  hearts[heart.id] = heart;
  return heart;
}

function killHeart(name){
  if(hearts[name]){
    clearInterval(hearts[name].interval);
    hearts[name] = undefined;
  }
}

function heart(name){
  return hearts[name];
}

module.exports = exports = {
  Heart: Heart, // will be deprecated
  all: hearts, // will be deprecated
  create: createHeart, // will be deprecated
  destroy: killHeart, // will be deprecated
  destroyHeart: killHeart, // will be deprecated

  heart: heart,
  hearts: hearts,
  createHeart: createHeart,
  killHeart: killHeart    
};