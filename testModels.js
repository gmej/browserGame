let Player = require('./models/Player');

let player = new Player(Math.random());
console.log(`player crated`);
console.log(player);

player.pressingRight = true;
console.log('GOING TO UPDATE');
player.updatePlayer();
console.log(player);