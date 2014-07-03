var heartbeats = {};
var idCount = 0;


// create a new heartbeat and add it to the internal list.

function create(heartrate, name){
  heartbeats[name] = new Heart(heartrate, name);
  return heartbeats[name];
}


// destroys a heartbeat and removes it from the internal heartbeat list

function destroy(name){

  if(heartbeats[name]){
    clearInterval(heartbeats[name].interval);
    delete heartbeats[name];
  }
}


// a convenience method that returns a heart(beat) from the internal list of heartbeats.

function heartbeat(name){
  return heartbeats[name];
}



//
// the main Heart constructor.
// creates a new heart with a time measure that is automatically incremented at
// a passed in interval. It's given a name or generic ID for reference.

function Heart(heartrate, name){

  var heart = this;

  heart.present = 0;

  heart.id = name || "beat_"+idCount;
  heart.heartrate = heartrate || 2500;

  heart.interval = setInterval(function(){
    heart.present++;
  }, heartrate);

  idCount++;
}


// destroys the heart(beat)

Heart.prototype.destroy = function(){

  clearInterval(this.interval);

  if(heartbeats[this.id]){
    // heartbeats[this.id] = undefined;
    delete heartbeats[this.id];
  }
};


// creates and returns a new pulse

Heart.prototype.newPulse = function(){
  return new Pulse(this);
};


// creates and returns a new pulse

Heart.prototype.setHeartrate = function(heartrate){

  if(heartrate){

    var heart = this;
    heart.heartrate = heartrate;

    clearInterval(heart.interval);

    heart.interval = setInterval(function(){
      heart.present++;
    }, heartrate);
  }

  return this.heartrate;
};



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



// export all our functions and aliases

module.exports = exports = {
  all: heartbeats,
  create: create,
  createHeart: create,
  destroy: destroy,
  destroyHeart: destroy,
  heartbeat: heartbeat,
  heart: heartbeat,
  Heart: Heart
};