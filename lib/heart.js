var Pulse = require('./pulse');
var BeatEvent = require('./beatevent');

var idCount = 0,
    hearts;

function initialize(global_hearts) {
    hearts = global_hearts;
    return Heart;
}


// Heart

function Heart(heartrate, name) {
    this.heartbeat = 0;

    this.events = [];
    this.eventList = {};
    this.eventsExist = false;

    this.id = name || 'heart_' + (Math.random()).toString(36) + idCount++;
    this.heartrate = heartrate || 2500;

    this.pulses = {};

    this.interval = setInterval(createInterval(this), heartrate);
    if (this.interval.unref) {
        this.interval.unref();
    }
}

Object.defineProperty(Heart.prototype, 'age', {
    enumerable: true,
    get: function() {
        return this.heartbeat;
    }
});

Object.defineProperty(Heart.prototype, 'name', {
    enumerable: true,
    get: function() {
        return this.id;
    }
});

Heart.prototype.setHeartrate = function(heartrate) {
    if (heartrate) {
        this.heartrate = heartrate;
        clearInterval(this.interval);
        this.interval = setInterval(createInterval(this), heartrate);
        if (this.interval.unref) {
            this.interval.unref();
        }
    }

    return this;
};

Heart.prototype.kill = Heart.prototype.destroy = function() {
    clearInterval(this.interval);
    if (hearts[this.id] !== undefined) {
        hearts[this.id] = undefined;
    }
};


// Pulses

Heart.prototype.newPulse = Heart.prototype.createPulse = function(name) {
    var pulse = new Pulse(this, name);

    if (name) {
        this.killPulse(name);
        this.pulses[pulse.id] = pulse;
    }

    return pulse;
};

Heart.prototype.killPulse = function(name) {
    if (this.pulses[name] !== undefined) {
        this.pulses[name] = undefined;
    }
};

Heart.prototype.pulse = function(name) {
    return this.pulses[name];
};


// Events

Heart.prototype.createEvent = function(modulo, options, fn) {
    if (typeof options === 'function') {
        fn = options;
        options = {};
    }

    var name = options.name;
    var repeat = options.repeat;
    var event = new BeatEvent(this, modulo, name, repeat, fn);

    prepHeartForEvents(this);

    if (name !== undefined) {
        this.killEvent(name);
        this.eventList[name] = event;
    }

    this.events.push(event);
    event.index = this.events.length - 1;

    return event;
};

Heart.prototype.event = function(name) {
    return this.eventList[name];
};

Heart.prototype.killEvent = function(name, beatevent) {
    if (this.eventList[name] !== undefined) {
        this.events[this.eventList[name].index] = undefined;
        this.eventList[name] = undefined;
    } else if (beatevent !== undefined) {
        this.events[beatevent.index] = undefined;
    }
};

Heart.prototype.killAllEvents = function() {
    this.eventsExist = false;
    this.events = [];
    this.eventList = {};
    clearInterval(this.interval);
    this.interval = setInterval(createInterval(this), this.heartrate);
    if (this.interval.unref) {
        this.interval.unref();
    }
};

function prepHeartForEvents(heart) {
    if (heart.eventsExist === false) {
        heart.eventsExist = true;
        clearInterval(heart.interval);
        heart.interval = setInterval(createInterval(heart), heart.heartrate);
        if (heart.interval.unref) {
            heart.interval.unref();
        }
    }
}

function createInterval(heart) {
    var events = heart.events;
    var executor;

    if (heart.eventsExist === false) {
        executor = function() {
            heart.heartbeat++;
        };
    } else {
        executor = function() {

            heart.heartbeat++;

            for (var i = 0; i < events.length; i++) {
                if (events[i] !== undefined) {
                    events[i].execute();
                    if (events[i].done === true) {
                        events[i].kill();
                    }
                }
            }
        };
    }

    return executor;
}


module.exports = {
    initialize: initialize
};
