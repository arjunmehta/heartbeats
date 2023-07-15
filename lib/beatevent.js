let idCount = 0;

class BeatEvent {
  constructor(heart, interval, name, countTo, beatCallback) {
    this.id = name || `event_${(Math.random()).toString(36)}${idCount += 1}`;
    this.heart = heart;

    this.countTo = countTo || 0;
    this.executionCount = 0;

    this.done = false;
    this.count = 0;
    this.schedule = Math.round(interval, 10);
    this.beatCallback = beatCallback;
  }

  execute() {
    this.count += 1;

    if (this.count === this.schedule) {
      this.executionCount += 1;
      if (this.countTo !== 0 && this.executionCount >= this.countTo) {
        this.done = true;
        this.beatCallback(this.executionCount, true, this);
      } else {
        this.beatCallback(this.executionCount, false, this);
      }
      this.count = 0;
    }
  }

  kill() {
    this.heart.killEvent(this.id, this);
  }
}

module.exports = BeatEvent;
