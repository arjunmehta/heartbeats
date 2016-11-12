var idCount = 0;

function BeatEvent(heart, interval, name, repeat, fn) {
    this.id = name || 'event_' + (Math.random()).toString(36) + idCount++;
    this.heart = heart;

    this.repeat = repeat || 0;
    this.executionCount = 0;

    this.done = false;
    this.count = 0;
    this.schedule = Math.round(interval, 10);
    this.fn = fn;

    this.index = null; // will be given a numerical index for position in events array
}

BeatEvent.prototype.execute = function() {
    this.count++;

    if (this.count === this.schedule) {
        this.executionCount++;
        if (this.repeat !== 0 && this.executionCount >= this.repeat) {
            this.done = true;
            this.fn(this.heart.heartbeat, true);
        } else {
            this.fn(this.heart.heartbeat, false);
        }
        this.count = 0;
    }
};

BeatEvent.prototype.kill = function() {
    this.heart.killEvent(this.id, this);
};

module.exports = BeatEvent;
