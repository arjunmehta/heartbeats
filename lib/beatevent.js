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