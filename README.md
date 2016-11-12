# Heartbeats

[![Build Status](https://travis-ci.org/arjunmehta/heartbeats.svg?branch=master)](https://travis-ci.org/arjunmehta/heartbeats)

![heartbeats title image](https://raw.githubusercontent.com/arjunmehta/heartbeats/image/heartbeats.png)

A simple module to very efficiently manage time-based objects and events.

Use this library for comparing large numbers of _relativistic_ time lapses efficiently and for synchronizing the execution of events based on these time lapses. In effect:

- **Execute functions on specific Heartbeat intervals**
- **Compare the time properties of multiple objects (Pulses) to a global time measure (Heart) operating on a specific time resolution (Heartrate)**

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

The running essence of the `Heart` is its own internal heartbeat count. How many times has it beat? We call this the Heart's age.

```javascript
var age = heart.age;
```

### Heart Events
Hearts manage Events, and execute blocks on specific heart beats, either continually (like `setInterval`) or just once (like `setTimeout`).

This is much more efficient and much more reliable than using multiple `setInterval` methods, as they usually get unsynchronized, and introduce memory issues.

```javascript
// Alternative to setInterval
heart.createEvent(5, function(heartbeat, last){
  console.log('...Every 5 Beats forever');
});

heart.createEvent(1, function(heartbeat, last){
  console.log('...Every Single Beat forever');
});

heart.createEvent(1, {repeat: 3}, function(heartbeat, last){
  console.log('...Every Single Beat for 3 beats only');
  if(last === true){
    console.log('...the last time.')
  }
});

// Alternative to setTimeout
heart.createEvent(2, {repeat: 1}, function(heartbeat, last){
  console.log('...Once after 2 Beats');
});
```

### Heart Pulses
A `Pulse` is an object used to measure how synchronized part of your system is to a central `Heart`. This is super useful as it allows you to very efficiently measure if things are lagging, or working as they should with respect to that `heartbeat`.

```javascript
var pulseA = heart.createPulse();
var pulseB = heart.createPulse();
```

Now, instead of storing an event's time as `Date().now()` or `Date().getTime()` and comparing those values to some other time, you `pulse.beat()` to synchronize the Pulse's time with its Heart.

```javascript
pulseA.beat();
pulseB.beat();
```

So, if we want to know how far off an object is from the Heart, we can use the Pulse's `missedBeats` property. For example:

```javascript
console.log( pulseA.missedBeats ); // 0
console.log( pulseB.missedBeats ); // 0


setInterval(function(){
  pulseB.beat(); // Only synchronizing pulseB with the Heart.
  console.log( pulseA.missedBeats ); // 2, 4, 6, 8
  console.log( pulseB.missedBeats ); // 0
}, 2000);
```

### Kill That Heart
Like any ongoing interval, you should kill the Heart once you no longer need it, otherwise it's likely your program will not exit until it has been properly killed.

```javascript
heart.kill();
```


## About Efficiency

Why is this library faster than more conventional methods? Basically, instead of using `Date().now()` or `new Date().getTime()` which are relatively very slow operations that give you very precise, universal values for the **present time**, we use the present moment of a heartbeat to give your events a time relative to that particular heart. This simple change results in extremely fast and efficient time difference calculations because it operates at a very low resolution compared to methods using the Date object, and compares basic integers vs comparing dates. View the source to see details.

### Test Performance
If you're curious, I've included a performance test using `benchmark.js` which compares a more traditional way of testing times.

```bash
# switch to the heartbeats module directory
cd node_modules/heartbeats

# install dev dependencies for the heartbeats module
npm install

# run benchmark test
npm run benchmark
```

Have a look at the `benchmark.js` file in the tests directory to see how the benchmark is done.


## API

The API is fairly straightforward, though it's good to be aware of nuances in its use.

### The Heart
#### heartbeats.createHeart(heartrate, name);
Creates and returns a new `Heart` object.

If you provide a name, the heart is registered in the module's list of hearts (see **heartbeats.heart()**). This is useful if you want to access heartbeats from different modules.

```javascript
// a new heart that beats every 2 seconds named 'heartA'
var heart = heartbeats.createHeart(2000, 'heartA');
```

If you don't provide a name, the heart will be returned but will not be added to the `heartbeats.hearts` object.

```javascript
var heart = heartbeats.createHeart(2000);
console.log(heart.name); // heart_kajg8i27tjhv
```

#### heartbeats.hearts
An object with all hearts that have been instantiated with a name.

#### heartbeats.heart(name)
Returns a `Heart` object with a name from the managed list of hearts.

```javascript
// gets a heart named 'heartA'
var heart = heartbeats.heart('heartA');
```

#### heartbeats.killHeart(name)
Removes the `Heart` from the internal managed list and clears the heartbeat interval. This only works if the heart was created with a `name`.

```javascript
// destroys the 'heartA' heart(beat)
heartbeats.killHeart('heartA');
```

#### heart.kill()
Clears the heartbeat interval and removes the Heart from the internal managed list if it exists there.

```javascript
heartbeats.heart('heartA').kill();
```


#### heart.setHeartrate(heartrate)
Updates the heartrate period of the `Heart` and returns the `Heart` object for chaining.
```javascript
heartbeats.heart('heartA').setHeartrate(3000);
```

#### heart.age
Gets the current number of beats that the heart has incremented in its lifetime.

```javascript
heartbeats.heart('heartA').age;
```


### The Pulse

#### heart.createPulse(name);
Returns a new Pulse object associated with the heart.

If you provide a name, the Pulse is added to the Heart's internal managed list of Pulses (ie. `heart.pulses`). This is useful if 

```javascript
// creates a new pulse from the 'heartA' heart(beat)
var pulse = heartbeats.heart('heartA').createPulse('A');
```

If you don't provide a name, the pulse will be returned without being added to the Heart's managed list of Pulses.

```javascript
var pulseA = heartbeats.heart('heartA').createPulse();
```

#### heart.pulses
An object with all pulses belonging to the heart, that have been instantiated with a name.

#### heart.pulse(name);
Returns the Pulse object from the heart's managed list of pulses.
```javascript
var pulseA = heartbeats.heart('heartA').pulse('A');
```

#### heart.killPulse(name);
Kills the Pulse and removes it from the heart's managed list of Pulses.
```javascript
var pulse = heartbeats.heart('heartA').pulse('A');
```

#### pulse.kill()
Kills the pulse and removes it from its heart's managed list (if it exists there).

```javascript
// clears the pulse from memory
pulse.kill();
```


#### pulse.beat()
This synchronizes the pulse with its Heart. **This is the secret sauce**. Instead of using `Date().now()` or `Date().getTime()` to register an event time we match the time of the pulse with the heart.

Returns the `Pulse` object to chain if needed.

```javascript
// synchronizes the pulse to its heart
pulse.beat();
```

#### pulse.missedBeats
The number of heartbeats that have passed since the pulse was last synchronized with `pulse.beat()`.

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

`heartbeats` makes it easy for you to synchronize event execution without the need for multiple `setInterval` or `setTimeout` initializers. It ensures that actions are synchronized with respect to the heart's beat and uses the heartbeat as the measure for action, and won't get unsynchronized as is what happens when multiple `setInterval` or `setTimeout` methods are used.

#### heart.createEvent(beatInterval, options, function)
This method is slightly different from the other creation methods (ie. `createHeart` and `createPulse`). Giving the object a name is done by passing a value to the options object.

This method will add a reoccuring event to the heart. Every `nth` beat specified by `beatInterval` will execute the supplied function. This method counts from the time you add the event. It's kind of like `setInterval`.



##### Options
`name`: Give the Event a custom name, so you can reference it, kill it, or modify it using `heart.event(name)`
`repeat`: default is `0` (infinite). Repeat the event a specified number of times (use `0` for infinite). If set to a finite number, the event will be killed and cleared from memory once executed the last time.

##### Callback Function
The callback function is called with `heartbeat` and `last` as arguments.

The following example creates a new event called `checkA`, on an existing heart named `heartA` that executes every 5th beat, repeats forever. The `last` argument passed to the callback will always be `false`.

```javascript
var event = heartbeats.heart('heartA').createEvent(5, {name: 'checkA', repeat: 0}, function(heartbeat, last){
  console.log('does this every 5 beats');
});
```

The following example creates an anonymous event on the heart named `heartA` that excutes every 4th beats but stops once it has been executed 3 times.

```javascript
heartbeats.heart('heartA').createEvent(4, {repeat: 3}, function(heartbeat, last){
  console.log('does this every 4 beats');
  if(last === true){
    console.log('this is the last execution of this method')
  }
});
```

#### heart.event(name)
Returns the `Event` with the specified name from the heart.
```javascript
var event = heartbeats.heart('heartA').event('checkA');
```

#### heart.killEvent(name)
This will instantly kill the event specified by the name.
```javascript
heartbeats.heart('heartA').killEvent('checkA');
```

#### heart.killAllEvents()
This will clear all beat events from the heart.
```javascript
heartbeats.heart('heartA').killAllEvents();
```

#### event.kill()
This will instantly kill the event specified by the name.
```javascript
heartbeats.heart('heartA').event('checkA').kill();
```

## License

The MIT License (MIT)<br/>
Copyright (c) 2014 Arjun Mehta
