// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        },
        matter: {
            gravity: { y: 1 },

            debug: true,

            enableSleep: true
        }
    },
    width: 1440,
    height: 900,
    scene: [StartScreen, Load, LevelOne, LevelTwo, LevelThree, HUD, EndScreen]
}

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };

const game = new Phaser.Game(config);