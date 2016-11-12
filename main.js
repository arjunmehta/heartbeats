var hearts = {};
var Heart = require('./lib/heart').initialize(hearts);

function createHeart(heartrate, name) {
    var heart = new Heart(heartrate, name);
    if (name) {
        killHeart(name);
        hearts[heart.id] = heart;
    }
    return heart;
}

function killHeart(name) {
    if (hearts[name]) {
        hearts[name].kill();
    }
}

function getHeart(name) {
    return hearts[name];
}

module.exports = {
    Heart: Heart, // will be deprecated
    all: hearts, // will be deprecated
    create: createHeart, // will be deprecated
    destroy: killHeart, // will be deprecated
    destroyHeart: killHeart, // will be deprecated

    heart: getHeart,
    hearts: hearts,
    createHeart: createHeart,
    killHeart: killHeart
};
