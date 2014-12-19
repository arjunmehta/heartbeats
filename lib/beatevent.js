var idCount = 0;

function BeatEvent(heart, interval, name, repeat, fn){  
  this.id = name;
  this.heart = heart;

  this.repeat = repeat;
  this.executionCount = 0;

  this.done = false;
  this.count = 0;
  this.interval = Math.round(interval, 10);
  this.fn = fn;  
}

BeatEvent.prototype.execute = function(){

  this.count++;

  if(this.count === this.interval){
    this.executionCount++;
    this.fn(this.heart.heartbeat);
    this.count = 0;

    if(this.repeat !== 0 && this.executionCount >= this.repeat){
      this.done = true;
    }
  }
};

BeatEvent.prototype.kill = function() {
    this.heart.killEvent(this.id);
};

exports = module.exports = BeatEvent;