const Benchmark = require('benchmark');
const heartbeats = require('../main');

let heart = {};
let pulse = {};
let action = false;

let cycleCount = 0;

const suite = new Benchmark.Suite('HeartBeats Performance Test');

suite.on('start', () => {
  action = false;
  cycleCount = 0;
});

suite.on('cycle', (event) => {
  console.log('\n', String(event.target));
});

suite.on('complete', function () {
  const fastest = this.filter('fastest');
  const slowest = this.filter('slowest');

  const fastestSpeed = fastest[0].stats.mean;
  const slowestSpeed = slowest[0].stats.mean;

  // console.log(fastest.pluck('name')[0], 'is the Fastest at ', fastestSpeed, 'per cycle');
  // console.log(slowest.pluck('name')[0], 'is the Slowest at ', slowestSpeed, 'per cycle');
  // console.log(fastest.pluck('name')[0], 'is', slowestSpeed / fastestSpeed, 'times faster than', slowest.pluck('name')[0]);
});

suite.on('error', (e) => {
  console.log('Benchmark ERROR:', e);
});

suite.add({
  name: 'Pulse with heartbeats',
  fn() {
    pulse.beat();
    // if (pulse.missedBeats >= 5) {
    //     action = true;
    // }
  },
  onStart() {
    heart = heartbeats.createHeart(1000, 'heartA');
    pulse = heart.createPulse('pulseA');
    cycleCount = 0;
    console.log('Starting:', this.name);
  },
  onCycle() {
    process.stdout.write(`\r Cycle:${cycleCount++}`);
  },
  onComplete() {
    pulse.kill();
    heart.kill();
    pulse = undefined;
    heart = undefined;
  },
});

suite.add({
  name: 'Pulse with Date',
  fn() {
    pulse.time = new Date().getTime();
    // if (pulse - heart >= 5000) {
    //     action = true;
    // }
  },
  onStart() {
    pulse = {
      time: new Date().getTime(),
    };
    cycleCount = 0;
    console.log('Starting:', this.name);
  },
  onCycle() {
    process.stdout.write(`\r Cycle:${cycleCount++}`);
  },
  onComplete() {
    pulse = undefined;
    heart = undefined;
  },
});

suite.add({
  name: 'Time Differential with heartbeats',
  fn() {
    if (pulse.missedBeats >= 5) {
      action = true;
    }
  },
  onStart() {
    heart = heartbeats.createHeart(1000, 'heartA');
    pulse = heart.createPulse('pulseA');
    cycleCount = 0;
    console.log('Starting:', this.name);
  },
  onCycle() {
    process.stdout.write(`\r Cycle:${cycleCount++}`);
  },
  onComplete() {
    pulse.kill();
    heart.kill();
    pulse = undefined;
    heart = undefined;
  },
});

suite.add({
  name: 'Time Differential with Date',
  fn() {
    if (pulse.time - new Date().getTime() >= 5000) {
      action = true;
    }
  },
  onStart() {
    pulse = {
      time: new Date().getTime(),
    };
    cycleCount = 0;
    console.log('Starting:', this.name);
  },
  onCycle() {
    process.stdout.write(`\r Cycle:${cycleCount++}`);
  },
  onComplete() {
    pulse = undefined;
    heart = undefined;
  },
});

suite.run({
  async: false,
});
