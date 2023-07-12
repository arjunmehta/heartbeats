let idCount = 0;

function BeatEvent(heart, interval, name, countTo, fn) {
  this.id = name || `event_${(Math.random()).toString(36)}${idCount += 1}`;
  this.heart = heart;

  this.countTo = countTo || 0;
  this.executionCount = 0;

  this.done = false;
  this.count = 0;
  this.schedule = Math.round(interval, 10);
  this.fn = fn;
}

BeatEvent.prototype.execute = function () {
  this.count += 1;

  if (this.count === this.schedule) {
    this.executionCount += 1;
    if (this.countTo !== 0 && this.executionCount >= this.countTo) {
      this.done = true;
      this.fn(this.executionCount, true);
    } else {
      this.fn(this.executionCount, false);
    }
    this.count = 0;
  }
};

BeatEvent.prototype.kill = function () {
  this.heart.killEvent(this.id, this);
};

module.exports = BeatEvent;
