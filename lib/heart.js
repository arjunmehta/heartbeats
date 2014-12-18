var Pulse = require("./pulse.js");
var BeatEvent = require("./beatevent.js");

var idCount = 0;
var hearts = {};


function initialize(global_hearts){
  hearts = global_hearts;
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

  if(hearts[this.id] !== undefined){
    hearts[this.id] = undefined;
  }
};

Heart.prototype.newPulse = Heart.prototype.createPulse = function(name){
  var pulse = new Pulse(this, name);
  this.pulses[pulse.id] = pulse;
  return pulse;
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
