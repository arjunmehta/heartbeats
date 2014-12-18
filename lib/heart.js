var Pulse = require("./pulse.js");
var BeatEvent = require("./beatevent.js");

var idCount = 0;
var heartbeats = {};


function initialize(global_heartbeats){
  heartbeats = global_heartbeats;
  return Heart;
}


function Heart(heartrate, name){

  this.heartbeat = 0;

  this.events = [];
  this.eventsExist = false;

  this.id = name || "heart_"+idCount;
  this.heartrate = heartrate || 2500;

  this.pulses = {};

  this.interval = setInterval(createInterval(this), heartrate);

  idCount++;
}

Heart.prototype.kill = Heart.prototype.destroy = function(){

  clearInterval(this.interval);

  if(heartbeats[this.id] !== undefined){
    heartbeats[this.id] = undefined;
  }
};

//Will be deprecated soon
Heart.prototype.newPulse = function(){
  return new Pulse(this);
};

Heart.prototype.createPulse = function(name){
  this.pulses[name] = new Pulse(this, name);
  return this.pulses[name];
};

Heart.prototype.killPulse = function(name){
  if(this.pulses[name] !== undefined){
    this.pulses[name] = undefined;
  }
};


Heart.prototype.setHeartrate = function(heartrate){

  if(heartrate){
    this.heartrate = heartrate;
    clearInterval(this.interval);
    this.interval = setInterval(createInterval(this), heartrate);
  }

  return this.heartrate;
};


Heart.prototype.setInterval = function(fn, modulo){
  this.onBeat(modulo, fn);
};

Heart.prototype.onBeat = function(modulo, fn){
  this.prepEvents();
  this.events.push(new BeatEvent(this, modulo, false, fn));
};


Heart.prototype.setTimeout = function(fn, modulo){
  this.onceOnBeat(modulo, fn);
};

Heart.prototype.onceOnBeat = function(modulo, fn){
  this.prepEvents();
  this.events.push(new BeatEvent(this, modulo, true, fn));
};


Heart.prototype.prepEvents = function(){

  if(this.eventsExist === false){
    this.eventsExist = true;
    clearInterval(this.interval);
    this.interval = setInterval(createInterval(this), this.heartrate);
  }  
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
      heart.heartbeat++;
    };
  }
  else{

    return function(){
      heart.heartbeat++;      
      for(var i = 0; i < events.length; i++){
        events[i].execute();
        if(events[i].done === true){
          events.splice(i, 1);
          i--;
        }
      }
    };
  }
}


exports = module.exports = {
  initialize: initialize
};
