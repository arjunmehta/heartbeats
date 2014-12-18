# node-heartbeats

[![Build Status](https://travis-ci.org/arjunmehta/node-heartbeats.svg?branch=master)](https://travis-ci.org/arjunmehta/node-heartbeats)

![heartbeats title image](https://raw.githubusercontent.com/arjunmehta/node-heartbeats/image/heartbeats.png)

A simple node.js module to very efficiently manage time-based objects and events.

Use this library for comparing large numbers of _relativistic_ time lapses efficiently and for synchronizing the execution of events based on these time lapses. In effect:

- **Compare the time properties of multiple objects (Pulses) to a global time measure (Heart) operating on a specific time resolution (Heartrate)**
- **Execute functions on specific Heartbeat intervals**

This library uses a much more efficient (lower resolution) method of testing system level event times as relativistic time differentials (vs. universal time differentials). Think larger chunked time measures (interval counts) instead of actual milliseconds. It's also great at managing the execution of events that require precise in-system synchronization. 

## Basic Usage

### Install
```bash
npm install heartbeats
```

### Add to your project
```javascript
var heartbeats = require('heartbeats');
```

### Create a New Heart
A `Heart` is the main object you use to measure time. It has a core heartrate, and beats at a specified time interval (in milliseconds).

```javascript
// a heart that beats every 1 second.
var heart = heartbeats.createHeart(1000);
```

The essence of the `Heart` is its own internal heartbeat count. How many times has it beat? We can call this the Heart's age.

```javascript
var age = heart.age;
```

### Creating and Using Pulse Instances
A `Pulse` is time-based object used to represent a part of your system that you want to measure time events with. Pulses belong to a Heart.

```javascript
var pulseA = heart.createPulse();
var pulseB = heart.createPulse();
```

Instead of storing an event's time as `Date.now()` or `Date.getTime()` and comparing those values to some other time, you `pulse.beat()` to synchronize the Pulse's time with its Heart.

```javascript
pulseA.beat();
pulseB.beat();
```

### Do Stuff with Pulses
Now if we want to how much an object is lagging, we can use the Pulse's `missedBeats` property.

```javascript
console.log( pulseA.missedBeats ); // 0
console.log( pulseB.missedBeats ); // 0

setInterval(function(){
  pulseB.beat();
  console.log( pulseA.missedBeats ); // 2, 4, 6, 8
  console.log( pulseB.missedBeats ); // 0
}, 2000);
```

### Heart Events
In addition to having Pulses, Hearts can also manage events, and execute blocks on specific heart beats, either continually (like `setInterval`) or just once (like `setTimeout`).

This is much more efficient and much more reliable than using multiple `setInterval` methods, as they usually get unsynchronized, and introduce memory issues.

```javascript
// Alternative to setInterval
heart.onBeat(5, function(){
  console.log("...Every 5 Beats");
});
heart.onBeat(2, function(){
  console.log("...Every Two Beats");
});

// Alternative to setTimeout
heart.onceOnBeat(1, function(){
  console.log("...Every Single Beat");
});
```


## About Efficiency

Why is this library faster than more conventional methods? Basically, instead of using `Date.now()` or `new Date().getTime()` which are relatively very slow operations that give you very precise, universal values for the **present time**, we use the present moment of a heartbeat to give your events a time relative to that particular heart. This simple change results in extremely fast and efficient time difference calculations because it operates at a very low resolution compared to methods using the Date object, and compares basic integers vs comparing dates. View the source to see details.


## API

The API is fairly straightforward, though it's good to be aware of nuances in its use.

### The Heart
#### heartbeats.createHeart(heartrate, name);
Creates and returns a new `Heart` object.

If you provide a `name` the heart is registered in the module's list of hearts (see **heartbeats.heart()**). This is useful if you want to access heartbeats from different modules.

```javascript
// a new heart that beats every 2 seconds named "heartA"
var heart = heartbeats.createHeart(2000, "heartA");
```

If you don't provide a name, the heart will be given a unique id as its name.

```javascript
var heart = heartbeats.createHeart(2000);
console.log(heart.name); // heart_1
```

#### heartbeats.heart(name)
Returns a `Heart` object from the managed list of hearts.

```javascript
// gets a heart named "heartA"
var heart = heartbeats.heart("heartA");
```

#### heartbeats.killHeart(name)
Removes the `Heart` from the internal managed list and clears the heartbeat interval. This only works if the heart was created with a `name`.

```javascript
// destroys the "heartA" heart(beat)
heartbeats.killHeart("heartA");
```

#### heart.setHeartrate(heartrate)
Updates the heartrate period of the `Heart` and returns the `Heart` object.
```javascript
heartbeats.heart("heartA").setHeartrate(3000);
```

#### heart.kill()
Clears the heartbeat interval and removes the Heart from the internal managed list if it exists there.
```javascript
heartbeats.heart("heartA").kill();
```


### The Pulse

#### heart.createPulse(name);
Returns a new Pulse object associated with the heart.

```javascript
// creates a new pulse from the "heartA" heart(beat)
heartbeats.heart("heartA").createPulse("A");
```

Also returns the `Pulse` object if you want to deal with it locally.

```javascript
var pulse = heartbeats.heart("heartA").createPulse("A");
```

#### heart.pulse(name);
Returns a new Pulse object from the heart's managed list of pulses.
```javascript
var pulse = heartbeats.heart("heartA").pulse("A");
```

#### pulse.beat()
This synchronizes the pulse with its main heart. **This is the secret sauce**. Instead of using Date.now()
```javascript
// synchronizes the pulse to its heart
pulse.beat();
```

#### pulse.missedBeats
The number of heartbeats that have passed since it was last synchronized with `pulse.beat()`.
```javascript
// gets the number of beats the pulse is off from its heart
var beatoffset = pulse.missedBeats;
```

#### pulse.lag;
Returns an approximate number of milliseconds the pulse is lagging behind the main heartbeat. Basically this is `pulse.missedBeats*heart.heartrate`.
```javascript
// gets an approximate number of milliseconds the pulse is delayed from the heart
var delay = pulse.lag;
```


### Beat Events

HeartBeats makes it easy for you to synchronize event execution without the need for multiple `setInterval` or `setTimeout` initializers. It ensures that actions are synchronized with respect to the heart's beat and uses the heartbeat as the measure for action, and won't get unsynchronized as is what happens when multiple `setInterval` or `setTimeout` methods are used.

#### heart.onBeat(beatInterval, function)
This method will add a reoccuring event to the heart. Every `nth` beat specified by `beatInterval` will execute the supplied function. This method counts from the time you add the `onBeat` event.

```javascript
heartbeats.heart("heartA").onBeat(5, function(){
  console.log("does this every 5 beats");
});
```

#### heart.onceOnBeat(beatInterval, function)
This method will add a single event to the heart. After `beatInterval` the supplied function will execute. This method counts from the time you add the `onceOnBeat` event.

```javascript
heartbeats.heart("heartA").onceOnBeat(2, function(){
  console.log("does once after 2 beats");
});
```

#### heart.clearEvents()

This will clear all beat events from the heart.

```javascript
heartbeats.heart("heartA").clearEvents();
```


## For the Browser

Heartbeats works for the browser too! To compile the script for the browser just run:
```bash
npm install
```

Browserify will generate a `heartbeats.js` file for you. Copy this file to your project and include the script in your html.

```html
<script src="heartbeats.js"/>
```

Then use heartbeats in accordance with the API.

```javascript
var heart = heartbeats.createHeart(2000, "heartA");
```


## License

The MIT License (MIT)

Copyright (c) 2014 Arjun Mehta

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal n the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
