class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOneScene");
    }

    preload() {
        // load animation plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {

    }
}