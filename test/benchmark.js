var heartbeats = require('../main');
var Benchmark = require('benchmark');

var heart = {};
var pulse = {};
var action = false;

var cycleCount = 0;

var suite = new Benchmark.Suite('HeartBeats Performance Test');

suite.on('start', function() {
    action = false;
    cycleCount = 0;
});

suite.on('cycle', function(event) {
    console.log('\n', String(event.target));
});

suite.on('complete', function() {
    var fastest = this.filter('fastest');
    var slowest = this.filter('slowest');

    var fastestSpeed = fastest[0].stats.mean;
    var slowestSpeed = slowest[0].stats.mean;

    // console.log(fastest.pluck('name')[0], 'is the Fastest at ', fastestSpeed, 'per cycle');
    // console.log(slowest.pluck('name')[0], 'is the Slowest at ', slowestSpeed, 'per cycle');

    // console.log(fastest.pluck('name')[0], 'is', slowestSpeed / fastestSpeed, 'times faster than', slowest.pluck('name')[0]);

});

suite.on('error', function(e) {
    console.log('Benchmark ERROR:', e);
});

suite.add({
    name: 'Pulse with heartbeats',
    fn: function() {
        pulse.beat();
        // if (pulse.missedBeats >= 5) {
        //     action = true;
        // }
    },
    onStart: function() {
        heart = heartbeats.createHeart(1000, 'heartA');
        pulse = heart.createPulse('pulseA');
        cycleCount = 0;
        console.log('Starting:', this.name);
    },
    onCycle: function() {
        process.stdout.write('\r Cycle:' + cycleCount++);
    },
    onComplete: function() {
        pulse.kill();
        heart.kill();
        pulse = undefined;
        heart = undefined;
    }
});

suite.add({
    name: 'Pulse with Date',
    fn: function() {
        pulse.time = new Date().getTime();
        // if (pulse - heart >= 5000) {
        //     action = true;
        // }
    },
    onStart: function() {
        pulse = {
            time: new Date().getTime()
        };
        cycleCount = 0;
        console.log('Starting:', this.name);
    },
    onCycle: function() {
        process.stdout.write('\r Cycle:' + cycleCount++);
    },
    onComplete: function() {
        pulse = undefined;
        heart = undefined;
    }
});

suite.add({
    name: 'Time Differential with heartbeats',
    fn: function() {
        if (pulse.missedBeats >= 5) {
            action = true;
        }
    },
    onStart: function() {
        heart = heartbeats.createHeart(1000, 'heartA');
        pulse = heart.createPulse('pulseA');
        cycleCount = 0;
        console.log('Starting:', this.name);
    },
    onCycle: function() {
        process.stdout.write('\r Cycle:' + cycleCount++);
    },
    onComplete: function() {
        pulse.kill();
        heart.kill();
        pulse = undefined;
        heart = undefined;
    }
});

suite.add({
    name: 'Time Differential with Date',
    fn: function() {
        if (pulse.time - new Date().getTime() >= 5000) {
            action = true;
        }
    },
    onStart: function() {
        pulse = {
            time: new Date().getTime()
        };
        cycleCount = 0;
        console.log('Starting:', this.name);
    },
    onCycle: function() {
        process.stdout.write('\r Cycle:' + cycleCount++);
    },
    onComplete: function() {
        pulse = undefined;
        heart = undefined;
    }
});


suite.run({
    'async': false
});
