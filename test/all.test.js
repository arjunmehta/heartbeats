const { spawn } = require('child_process');
const heartbeats = require('../main');

jest.setTimeout(20000);

describe('module functions', () => {
  test('module exists', () => {
    expect(typeof heartbeats).toBe('object');
    expect(typeof heartbeats).toBe('object');
    expect(typeof heartbeats.Heart).toBe('function');
    expect(typeof heartbeats.all).toBe('object');
    expect(typeof heartbeats.create).toBe('function');
    expect(typeof heartbeats.destroy).toBe('function');
    expect(typeof heartbeats.destroyHeart).toBe('function');
    expect(typeof heartbeats.heart).toBe('function');
    expect(typeof heartbeats.hearts).toBe('object');
    expect(typeof heartbeats.createHeart).toBe('function');
    expect(typeof heartbeats.killHeart).toBe('function');
  });
});

describe('heart basics', () => {
  test('unreference heart', (done) => {
    const unrefTest = spawn('node', ['./test/spawn.js'], { stdio: 'inherit' });

    unrefTest.on('exit', (code) => {
      expect(code).toBe(0);
      done();
    });
  });

  test('create heart', (done) => {
    const heart = heartbeats.createHeart(1000, 'globalBeat');

    expect(heartbeats.heart('globalBeat')).not.toBe(undefined);
    expect(heartbeats.heart('globalBeat')).toBe(heart);

    done();
  });

  test('default heart age', (done) => {
    const heart = heartbeats.heart('globalBeat');
    setTimeout(() => {
      expect(heart.age).toBe(3);
      done();
    }, 3500);
  });
});

test('pulses', (done) => {
  const heart = heartbeats.createHeart(1000, 'globalBeat');

  const pulses = {
    pulseA: heart.createPulse(),
    pulseB: heart.createPulse(),
  };

  const iA = setInterval(() => {
    pulses.pulseA.beat();
  }, 500);

  const iB = setInterval(() => {
    pulses.pulseB.beat();
  }, 5000);

  setTimeout(() => {
    clearInterval(iA);
    clearInterval(iB);

    expect(pulses.pulseA.missedBeats).toBe(0);
    expect(pulses.pulseB.missedBeats).toBe(3);
    expect(pulses.pulseA.lag).toBe(0);
    expect(pulses.pulseB.lag).toBe(3000);

    done();
  }, 3250);
});

describe('events', () => {
  test('add events', (done) => {
    let totalTriggers = 0;
    let accumHeartBeats = 0;

    heartbeats
      .heart('globalBeat')
      .createEvent(3, (heartbeat) => {
        totalTriggers += 1;
        accumHeartBeats += heartbeat;
      });

    heartbeats
      .heart('globalBeat')
      .createEvent(7, (heartbeat) => {
        totalTriggers += 1;
        accumHeartBeats += heartbeat;

        expect(totalTriggers).toBe(3);
        expect(accumHeartBeats).toBe(4);
        done();
      });
  });

  test('remove events', (done) => {
    heartbeats.heart('globalBeat').killAllEvents();
    expect(heartbeats.heart('globalBeat').events.length).toBe(0);
    done();
  });

  test('add single finite repeating event', (done) => {
    let beatCount = 0;
    let finalBeat = null;

    const event = heartbeats
      .heart('globalBeat')
      .createEvent(1, {
        repeat: 5,
      }, (heartbeat) => {
        beatCount += 1;
        finalBeat = heartbeat;
      });

    setTimeout(() => {
      heartbeats.heart('globalBeat').killAllEvents();
      expect(beatCount).toBe(5);
      expect(finalBeat).toBe(5);
      expect(event.done).toBe(true);
      done();
    }, 6000);
  });
});

test('remove heart', (done) => {
  heartbeats.killHeart('globalBeat');
  expect(heartbeats.heart('globalBeat')).toBe(undefined);
  done();
});
