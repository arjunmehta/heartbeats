var idCount = 0;

function Pulse(homeheart, name) {
    this.id = name || 'pulse_' + (Math.random()).toString(36) + idCount++;
    this.heart = homeheart;
    this.heartbeat = homeheart.heartbeat;
}

Object.defineProperty(Pulse.prototype, 'missedBeats', {
    enumerable: true,
    get: function() {
        return this.heart.heartbeat - this.heartbeat;
    }
});

Object.defineProperty(Pulse.prototype, 'lag', {
    enumerable: true,
    get: function() {
        return this.missedBeats * this.heart.heartrate;
    }
});

Pulse.prototype.beat = function() {
    this.heartbeat = this.heart.heartbeat;
    return this;
};

Pulse.prototype.over = function(threshold) {
    if (this.heart.heartbeat - this.heartbeat > threshold) {
        return true;
    }
    return false;
};

Pulse.prototype.kill = Pulse.prototype.destroy = function() {
    this.heart.killPulse(this.id);
};

module.exports = Pulse;
