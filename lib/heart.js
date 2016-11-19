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

    this.id = name || 'heart_' + (Math.random()).toString(36) + idCount++;
    this.heartrate = heartrate || 2500;

    this.pulses = {};

    this.interval = setInterval(createInterval(this), heartrate);

    unreference(this);
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

        if (this.events.length === 0) {
            unreference(this);
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
    var countTo = options.countTo || options.repeat; // repeat to be deprecated
    var event = new BeatEvent(this, modulo, name, countTo, fn);

    if (name !== undefined) {
        this.killEvent(name);
        this.eventList[name] = event;
    }

    this.events.push(event);

    if (this.interval.ref) {
        this.interval.ref();
    }

    return event;
};

Heart.prototype.event = function(name) {
    return this.eventList[name];
};

Heart.prototype.killEvent = function(name, beatevent) {
    var idx;

    if (this.eventList[name] !== undefined) {
        idx = this.events.indexOf(this.eventList[name]);
        this.eventList[name] = undefined;
    } else if (beatevent !== undefined) {
        if(beatevent.id){
            this.eventList[beatevent.id] = undefined;
        }
        idx = this.events.indexOf(beatevent);
    }

    if (idx > -1) {
        this.events.splice(idx, 1);
    }

    if (this.events.length === 0) {
        unreference(this);
    }
};

Heart.prototype.killAllEvents = function() {
    this.events = [];
    this.eventList = {};

    unreference(this);
};

function createInterval(heart) {
    return function() {
        var events = heart.events;

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

function unreference(heart) {
    if (heart.interval.unref) {
        heart.interval.unref();
    }
}


module.exports = {
    initialize: initialize
};
