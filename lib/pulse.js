let idCount = 0;

class Pulse {
  constructor(homeheart, name) {
    this.id = name || `pulse_${(Math.random()).toString(36)}${idCount += 1}`;
    this.heart = homeheart;
    this.heartbeat = homeheart.heartbeat;
  }

  get missedBeats() {
    return this.heart.heartbeat - this.heartbeat;
  }

  get lag() {
    return this.missedBeats * this.heart.heartrate;
  }

  beat() {
    this.heartbeat = this.heart.heartbeat;
    return this;
  }

  over(threshold) {
    if (this.heart.heartbeat - this.heartbeat > threshold) {
      return true;
    }

    return false;
  }

  kill() {
    this.heart.killPulse(this.id);
  }
}

module.exports = Pulse;
