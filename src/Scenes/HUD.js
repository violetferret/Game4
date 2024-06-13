class HUD extends Phaser.Scene {
    constructor() {
        super("hudScene");
    }

    preload() {
        this.textConfig = {
            fontFamily: 'kenney-mini',
            fontSize: 50,
            color: "white",
        }  
    }

    create(levelScene) {
        this.text = this.add.text(20, 835, 'Score: 0', this.textConfig);
        this.levelScene = this.scene.get(levelScene);
        this.text.visible = true;
    }

    update() {
        this.text.setText("Score: " + this.levelScene.coinsAmount);
        this.text.visible = true;
    }
}