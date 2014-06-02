# node-heartbeats

A simple javascript library to very efficiently keep track of time differences between events.

This library uses a much more efficient method at testing system level event times as relativistic time differentials vs. universal time differentials. Think arbitrary time measures instead of milliseconds, seconds, hours etc.

Basically, instead of using `Date.now()` or new `Date().getTime()` which are relatively very slow operations that give you a "universal" **present time**, you use the present moment of the heartbeat to give your events a time relative to the heartbeat. This simple change results in extremely fast and efficient time difference calculations.

## Getting Started

```bash
npm install heartbeats
```

```javascript
var heartbeats = require('heartbeats');
var heart = heartbeats.createHeart(3000, "heartName");

// or if you want to manage it yourself

var heart = new heartbeats.Heart(3000);

```

## Basic Usage
The most common use case for heartbeats are to register whether an event has happened within a certain time period, and if its time exceeds a certain threshold, do something to an object associated with it.

```javascript
var veinA = {pulse: heart.Pulse()};
var veinB = {pulse: heart.Pulse()};

veinA.pulse.beat();
veinB.pulse.beat();

if(heart.difference(veinA.pulse) > 3000){
  delete veinA;
}

```

