class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreenScene");
    }

    preload() {

    }

    create() {
        this.scene.start("loadScene");
    }

    update() {
    }
}