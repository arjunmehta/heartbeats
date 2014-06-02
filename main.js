
var heartbeats = {};

function create(name, interval){
  heartbeats[name] = new HeartBeat(name, interval);
  return heartbeats[name];
}

function heartbeat(name){
  return heartbeats[name];
}



function HeartBeat(name, interval, realTime){

  var present = this.present = 0;

  this.name = name;
  this.interval = interval; 

  this.interval = setInterval(function(){
    present++;
  }, interval);

  if(realTime){
    this.timebridge = Date.now();
    this.realmoment = 0;
  }

}

HeartBeat.prototype.stop = function(){
  clearInterval(this.interval);
};

HeartBeat.prototype.start = function(){
  
  var present = this.present;

  this.interval = setInterval(function(){
    present++;
  }, interval);
};

HeartBeat.prototype.reset = function(){
  this.present = 0;
};

HeartBeat.prototype.destroy = function(){

  clearInterval(this.interval);

  if(heartbeats[this.name]){
    heartbeats[this.name] = undefined;
  }
};

HeartBeat.prototype.time = function(){
  return this.timebridge + ((this.present-this.realmoment)*this.interval);
};

HeartBeat.prototype.syncRealTime = function(){
  this.timebridge = Date.now();
  this.realmoment = this.present;

  return this.timebridge;
};

HeartBeat.prototype.over = function(value, threshold){
  if(this.present - value < (threshold/this.interval)){
    return true;
  }
  return false;
};

HeartBeat.prototype.compareTime = function(time, threshold){

};


module.exports = exports = {
  heartbeats: heartbeats,
  create: create,
  heartbeat: heartbeat,
  pulse: heartbeat,
  HeartBeat: HeartBeat
};