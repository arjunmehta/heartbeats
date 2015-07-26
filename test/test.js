var heartbeats = require('../main');
var spawn = require('child_process').spawn;

exports.unrefHeart = function(test) {

    test.expect(1);

    var unref_test = spawn('node', ['./test/spawn.js'], {
        stdio: 'inherit'
    });

    unref_test.on('exit', function(code) {
        test.equal(code, 0);
        test.done();
    });
};

exports.newHeart = function(test) {
    test.expect(2);
    var heart = heartbeats.createHeart(1000, 'globalBeat');
    test.equal((heartbeats.heart('globalBeat') !== undefined), true);
    test.equal((heartbeats.heart('globalBeat') === heart), true);
    test.done();
};

exports.heartAge = function(test) {
    test.expect(1);

    var heart = heartbeats.heart('globalBeat');
    var iA = setTimeout(function() {
        test.equal(heart.age, 3);
        test.done();
    }, 3500);
};

exports.testPulses = function(test) {

    var heart = heartbeats.createHeart(1000, 'globalBeat');

    test.expect(1);

    var obj = {
        pulseA: heart.createPulse(),
        pulseB: heart.createPulse(),
    };

    var iA = setInterval(function() {
        obj.pulseA.beat();
    }, 500);

    var iB = setInterval(function() {
        obj.pulseB.beat();
    }, 5000);

    var iC = setInterval(function() {
        for (var pulse in obj) {
            if (obj[pulse].missedBeats > 3) {
                console.log(pulse, 'lag is over 3000ms:', obj[pulse].lag, 'missedBeats:', obj[pulse].missedBeats);
                test.equal(true, true);
                clearInterval(iA);
                clearInterval(iB);
                clearInterval(iC);
                test.done();
            } else {
                console.log(pulse, 'lag is', obj[pulse].lag, 'missedBeats:', obj[pulse].missedBeats);
            }
        }
    }, 500);
};

exports.addEvent = function(test) {
    test.expect(3);

    var presentInit = heartbeats.heart('globalBeat').heartbeat;

    heartbeats.heart('globalBeat').createEvent(3, function(heartbeat) {
        console.log('onBeat 3', heartbeat - presentInit);
        test.equal(true, true);
    });

    heartbeats.heart('globalBeat').createEvent(7, function(heartbeat) {
        console.log('onBeat 7', heartbeat - presentInit);
        test.equal(true, true);
        test.done();
    });

    setTimeout(function() {}, 7500);
};

exports.removeEvents = function(test) {
    test.expect(1);

    heartbeats.heart('globalBeat').killAllEvents();

    test.equal(heartbeats.heart('globalBeat').events.length, 0);
    test.done();
};

exports.addSingleEvent = function(test) {
    test.expect(4);

    var presentInit = heartbeats.heart('globalBeat').heartbeat;

    heartbeats.heart('globalBeat').createEvent(1, {
        repeat: 1
    }, function(heartbeat) {
        console.log('onceOnBeat 1', heartbeat - presentInit);
        test.equal(true, true);
    });

    heartbeats.heart('globalBeat').createEvent(2, {
        repeat: 1,
        name: 'TwoBeat'
    }, function(heartbeat) {
        console.log('onceOnBeat 2', heartbeat - presentInit);
        test.equal(true, true);
    });

    heartbeats.heart('globalBeat').createEvent(2, {
        repeat: 1
    }, function(heartbeat) {
        console.log('onceOnBeat 2', heartbeat - presentInit);
        test.equal(true, true);
    });

    heartbeats.heart('globalBeat').createEvent(3, {
        repeat: 1
    }, function(heartbeat) {
        console.log('onceOnBeat 3', heartbeat - presentInit);
        test.equal(true, true);
        test.done();
    });

    setTimeout(function() {}, 3500);
};

exports.removeEvents = function(test) {
    test.expect(1);

    heartbeats.heart('globalBeat').killAllEvents();

    test.equal(heartbeats.heart('globalBeat').events.length, 0);
    test.done();
};

exports.removeHeart = function(test) {
    test.expect(1);

    heartbeats.killHeart('globalBeat');
    test.equal((heartbeats.heart('globalBeat') === undefined), true);
    test.done();
};

exports.tearDown = function(done) {
    done();
};
