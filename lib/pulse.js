function Pulse(homeheart){
  this.heart = homeheart;
  this.heartbeat = homeheart.heartbeat;
}


Pulse.prototype.beat = Pulse.prototype.pulse = function(){
  this.heartbeat = this.heart.heartbeat;
  return this.heartbeat;
};


Pulse.prototype.lag = Pulse.prototype.difference = Pulse.prototype.feel = Pulse.prototype.test = Pulse.prototype.compare = function(){
  return this.missedBeats()*this.heart.heartrate;
};


Pulse.prototype.missedBeats = function(){
  return this.heart.heartbeat - this.heartbeat;
};


Pulse.prototype.over = function(threshold){
  if(this.heart.heartbeat - this.heartbeat > threshold){
    return true;
  }
  return false;
};


exports = module.exports = Pulse;