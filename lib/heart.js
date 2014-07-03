
var Pulse = require("./pulse.js");
var BeatEvent = require("./beatevent.js");

var idCount = 0;
var heartbeats = {};


function initialize(global_heartbeats){
  heartbeats = global_heartbeats;
  return Heart;
}

// the main Heart constructor.
// creates a new heart with a time measure that is automatically incremented at
// a passed in interval. It's given a name or generic ID for reference.

function Heart(heartrate, name){

  var heart = this;

  this.present = 0;

  this.events = [];
  this.eventsExist = false;

  this.id = name || "beat_"+idCount;
  this.heartrate = heartrate || 2500;

  this.interval = setInterval(createInterval(this), heartrate);

  idCount++;
}


// destroys the heart(beat)

Heart.prototype.destroy = function(){

  clearInterval(this.interval);

  if(heartbeats[this.id] !== undefined){
    heartbeats[this.id] = undefined;
  }
};


// creates and returns a new pulse

Heart.prototype.newPulse = function(){
  return new Pulse(this);
};


// creates and returns a new pulse

Heart.prototype.setHeartrate = function(heartrate){

  if(heartrate){

    this.heartrate = heartrate;

    clearInterval(this.interval);
    this.interval = setInterval(createInterval(this), heartrate);
  }

  return this.heartrate;
};


Heart.prototype.onBeat = function(modulo, fn){

  if(this.eventsExist === false){
    this.eventsExist = true;
    clearInterval(this.interval);
    this.interval = setInterval(createInterval(this), this.heartrate);
  }

  this.addEvent(modulo, fn);
};


Heart.prototype.addEvent = function(modulo, fn){
  this.events.push(new BeatEvent(this, modulo, fn));
};


Heart.prototype.clearEvents = function(){
  this.eventsExist = false;
  this.events = [];
  clearInterval(this.interval);
  this.interval = setInterval(createInterval(this), this.heartrate);
};


function createInterval(heart){

  var events = heart.events;

  if(heart.eventsExist === false){

    return function(){
      heart.present++;
    };
  }
  else{

    return function(){
      heart.present++;
      
      for(var i = 0; i < events.length; i++){
        events[i].execute();
      }
    };
  }
}


exports = module.exports = {
  initialize: initialize
};
