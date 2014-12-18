!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.heartbeats=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function BeatEvent(heart, interval, once, fn){
  this.heart = heart;
  this.once = once || false;
  this.done = false;
  this.count = 0;
  this.interval = Math.round(interval, 10);
  this.fn = fn;
}

BeatEvent.prototype.execute = function(){

  this.count++;

  if(this.count === this.interval){
    this.fn(this.heart.heartbeat);
    this.count = 0;

    if(this.once === true){
      this.done = true;
    }
  }
};

exports = module.exports = BeatEvent;
},{}],2:[function(require,module,exports){
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

},{"./beatevent.js":1,"./pulse.js":3}],3:[function(require,module,exports){
function Pulse(homeheart, name){
  this.id = name || "pulse_"+idCount;
  this.heart = homeheart;
  this.heartbeat = homeheart.heartbeat;
}

Pulse.prototype.kill = Pulse.prototype.destroy = function(){
  this.heart.killPulse(this.id);
};

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
},{}],4:[function(require,module,exports){
var hearts = {};
var Heart = require("./lib/heart.js").initialize(hearts);

function create(heartrate, name){
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
  all: hearts, // will be deprecated
  hearts: hearts,
  create: create, // will be deprecated
  createHeart: create,
  destroy: killHeart, // will be deprecated
  destroyHeart: killHeart, // will be deprecated
  killHeart: killHeart,
  heart: heart,  
  Heart: Heart // will be deprecated
};
},{"./lib/heart.js":2}]},{},[4])(4)
});