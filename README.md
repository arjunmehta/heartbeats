# node-heartbeats

[![Build Status](https://travis-ci.org/arjunmehta/node-heartbeats.svg?branch=master)](https://travis-ci.org/arjunmehta/node-heartbeats)


![heartbeats title image](https://raw.githubusercontent.com/arjunmehta/node-heartbeats/image/heartbeats.png)

A simple node.js module to very efficiently manage time-based events and objects.

Use this library for comparing large numbers of _relativistic_ time lapses efficiently and for synchronizing the execution of events based on these time lapses. In effect:

- **Compare the time properties of multiple "Pulse" objects to a single consistent "Heartbeat" (eg. missed beats, lag, age etc.)**
- **Execute functions on specific Heartbeat intervals (eg. do Y every X beats, do Y in X beats)**

This library uses a much more efficient (yet lower resolution) method of testing system level event times as relativistic time differentials (vs. universal time differentials). Think larger chunked time measures (interval counts) instead of actual milliseconds. It's also great at managing the execution of events that require precise in-system synchronization. 

## Basic Usage Example

### Install
```bash
npm install heartbeats
```

### Create a New Heart
```javascript
var heartbeats = require('heartbeats');
var heart = new heartbeats.Heart(1000);
```

### Create Pulse Instances
```javascript
var pulseA = heart.newPulse();
var pulseB = heart.newPulse();
```

### Do Stuff with Pulses
```javascript
console.log( pulseA.missedBeats() ); // 0
console.log( pulseB.missedBeats() ); // 0

setInterval(function(){
  pulseB.beat();
  console.log( pulseA.missedBeats() ); // 2, 4, 6, 8
  console.log( pulseB.missedBeats() ); // 0
}, 2000);
```

### Do Something Every X HeartBeats
```javascript
heart.onBeat(5, function(){
  console.log("...Every 5 Beats");
});
heart.onBeat(2, function(){
  console.log("...Every Two Beats");
});
heart.onBeat(1, function(){
  console.log("...Every Single Beat");
});
```


## About Efficiency

Why is this library faster than more conventional methods? Basically, instead of using `Date.now()` or `new Date().getTime()` which are relatively very slow operations that give you very precise, universal values for the **present time**, you use the present moment of a heartbeat to give your events a time relative to that heartbeat. This simple change results in extremely fast and efficient time difference calculations because it operates at a very low resolution compared to methods using the Date object, and compares basic integers vs comparing dates. View the source to see details.


## API

The API is fairly straightforward, though it's good to be aware of nuances in its use.

### The Heart
To create a new heartbeat you, obviously, need to create a new heart. A heart has a core heartrate, and beats at a specified interval. Hearts can also spawn new "Pulses" which are used to catch a "beat" from the Heart.

#### Constructor: new heartbeats.Heart(heartrate)
Creates a new "Heart" that beats at a certain heartrate in milliseconds.
```javascript
// a new heart that beats approximately every 2 seconds
var heart = new heartbeats.Heart(2000);
```

#### Managed: heartbeats.createHeart(heartrate, name);
You can have multiple Hearts which are kept in a list in the heartbeats module. This is great if you want to access heartbeats from different modules.
```javascript
// a new heart that beats every 2 seconds named "global"
heartbeats.createHeart(2000, "global");
```

#### Managed: heartbeats.heart(name)
Returns a Heart from the managed list of hearts.
```javascript
// gets a heart named "global"
var heart = heartbeats.heart("global");
```

#### Managed: heartbeats.destroyHeart(name)
Removes the Heart from the internal managed list and clears the heartbeat interval.
```javascript
// destroys the "global" heart(beat)
heartbeats.destroyHeart("global");
```

#### heart.setHeartrate(heartrate)
Updates the heartrate period of the heart and returns the value. If no argument is passed it will return the current heartrate.

#### heart.destroy()
Clears the heartbeat interval and removes the Heart from the internal managed list if it exists.


### The Pulse

#### heart.newPulse();
Returns a new Pulse object associated with the heart.
```javascript
// creates a new pulse from the "global" heart(beat)
var pulse = heartbeats.heart("global").newPulse();
```


#### pulse.beat()
Synchronizes the pulse with its main heart.
```javascript
// synchronizes the pulse to its heart
pulse.beat();
```

#### pulse.missedBeats()
Returns the number of heartbeats that have passed since it was synchronized using pulse.beat().
```javascript
// gets the number of beats the pulse is off from its heart
var beatoffset = pulse.missedBeats();
```

#### pulse.lag();
Returns an approximate number of milliseconds the pulse is lagging behind the main heartbeat. Basically this is `pulse.missedBeats*heart.heartrate`.
```javascript
// gets an approximate number of milliseconds the pulse is delayed from the heart
var delay = pulse.lag();
```


### Beat Events

HeartBeats makes it easy for you to synchronize event execution without the need for multiple `setInterval` or `setTimeout` initializers. It ensures that actions are synchronized with respect to the heart's beat and uses the heartbeat as the measure for action, and won't get unsynchronized as is what happens when multiple `setInterval` or `setTimeout` methods are used.

#### heart.onBeat(beatInterval, function)
This method will add a reoccuring event to the heart. Every `nth` beat specified by `beatInterval` will execute the supplied function. This method counts from the time you add the `onBeat` event.

```javascript
heartbeats.heart("global").onBeat(5, function(){
  console.log("does this every 5 beats");
});
```

#### heart.onceOnBeat(beatInterval, function)
This method will add a single event to the heart. After `beatInterval` the supplied function will execute. This method counts from the time you add the `onceOnBeat` event.

```javascript
heartbeats.heart("global").onceOnBeat(2, function(){
  console.log("does once after 2 beats");
});
```

#### heart.clearEvents()

This will clear all beat events from the heart.

```javascript
heartbeats.heart("global").clearEvents();
```


## License

The MIT License (MIT)

Copyright (c) 2014 Arjun Mehta

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal n the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
