
var heartbeats = {};
var idCount = 0;

function create(interval, name){
  heartbeats[name] = new Heart(interval, name);
  return heartbeats[name];
}

function heartbeat(name){
  return heartbeats[name];
}


// the main Heart constructor

function Heart(interval, name){

  var present = this.present = 0;

  this.id = name || "beat_"+idCount;
  this.interval = interval; 

  this.interval = setInterval(function(){
    present++;
  }, interval);

  idCount++;
}

Heart.prototype.stop = function(){
  clearInterval(this.interval);
};

Heart.prototype.start = function(){
  
  var present = this.present;

  this.interval = setInterval(function(){
    present++;
  }, interval);
};

Heart.prototype.reset = function(){
  this.present = 0;
};

Heart.prototype.destroy = function(){

  clearInterval(this.interval);

  if(heartbeats[this.id]){
    // heartbeats[this.id] = undefined;
    delete heartbeats[this.id];
  }
};

Heart.prototype.over = function(pulse, threshold){
  if(this.present - pulse.pulse > (threshold/this.interval)){
    return true;
  }
  return false;
};

Heart.prototype.compare = function(pulse){
  return (this.present - pulse.pulse) * this.interval;
};

Heart.prototype.difference = Heart.prototype.compare;

Heart.prototype.Pulse = function(){
  return new Pulse(this);
};


function Pulse(homeheart){  
  this.heart = homeheart; 
  this.pulse = homeheart.present;
}

Pulse.prototype.beat = function(){
  this.pulse = this.heart.present;
};




// Heart.prototype.time = function(){
//   return this.timebridge + ((this.present-this.realmoment)*this.interval);
// };

// Heart.prototype.syncRealTime = function(){
//   this.timebridge = Date.now();
//   this.realmoment = this.present;
//
//   return this.timebridge;
// };

// Heart.prototype.overTime = function(time, threshold){
//   if(this.time() - time > threshold){
//     return true;
//   }
//   return false;
// };


module.exports = exports = {
  all: heartbeats,
  create: create,
  createHeart: create,
  heartbeat: heartbeat,
  heart: heartbeat,
  Heart: Heart
};