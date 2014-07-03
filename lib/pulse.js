// a Pulse is an object that has a time relative to its home heart.
// It is brought to the "present" manually by calling it to beat/pulse.

function Pulse(homeheart){
  this.heart = homeheart;
  this.present = homeheart.present;
}


// registering a beat to the pulse

Pulse.prototype.beat = Pulse.prototype.pulse = function(){
  this.present = this.heart.present;
  return this.present;
};


// compares and returns how far off the pulse is from the main heartbeat

Pulse.prototype.lag = Pulse.prototype.difference = Pulse.prototype.feel = Pulse.prototype.test = Pulse.prototype.compare = function(){
  return this.missedBeats()*this.heart.heartrate;
};


// compares and returns how far off the pulse is from the main heartbeat

Pulse.prototype.missedBeats = function(){
  return this.heart.present - this.present;
};


// compares and returns how far off the pulse is from the main heartbeat

Pulse.prototype.over = function(threshold){
  if(this.heart.present - this.present > threshold){
    return true;
  }
  return false;
};


exports = module.exports = Pulse;