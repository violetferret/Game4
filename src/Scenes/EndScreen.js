class EndScreen extends Phaser.Scene {
    constructor() {
        super("endScreenScene");
    }

    preload() {
        // create font config
        this.textConfig = {
            fontFamily: 'kenney-mini',
            fontSize: 50,
            color: "white",
        } 

        // load tilemaps
        this.load.image("background_tilemap_tiles", "assets/tilemaps/background_tilemap_packed.png");
        this.load.image("base_tilemap_tiles", "assets/tilemaps/base_tilemap_packed.png");
        this.load.image("farm_tilemap_tiles", "assets/tilemaps/farm_tilemap_packed.png");
        this.load.image("food_tilemap_tiles", "assets/tilemaps/food_tilemap_packed.png");

        // load levels
        this.load.tilemapTiledJSON("start-end", "assets/start-end.tmj");
        this.load.tilemapTiledJSON("start-end-background", "assets/start-end-background.tmj");

        // load tilemaps as spritesheets
        this.load.spritesheet("background_tilemap_sheet", "assets/tilemaps/background_tilemap_packed.png", {
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.spritesheet("base_tilemap_sheet", "assets/tilemaps/base_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("farm_tilemap_sheet", "assets/tilemaps/farm_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("food_tilemap_sheet", "assets/tilemaps/food_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // load UI stuff
        this.load.image("up", "assets/up.png");
        this.load.image("down", "assets/down.png");
        this.load.image("left", "assets/left.png");
        this.load.image("right", "assets/right.png");
        this.load.image("button", "assets/button.png");
    }

    create() {

        // create new tilemap game object
        this.background_map = this.make.tilemap({ key: "start-end-background" });
        this.map = this.make.tilemap({ key: "start-end" });

        // load tilesets
        this.background_tileset = this.background_map.addTilesetImage("background_tilemap_packed", "background_tilemap_tiles");
        this.base_tileset = this.map.addTilesetImage("base_tilemap", "base_tilemap_tiles");
        this.farm_tileset = this.map.addTilesetImage("farm_tilemap", "farm_tilemap_tiles");
        this.food_tileset = this.map.addTilesetImage("food_tilemap", "food_tilemap_tiles");

        this.backgroundLayer = this.background_map.createLayer("Background", this.background_tileset, 0, 0);
        this.level12Layer = this.map.createLayer("Level1-2", this.base_tileset, 0, 0);
        this.level1Layer = this.map.createLayer("Level1", this.base_tileset, 0, 0);
        this.level13Layer = this.map.createLayer("Level1-3", [this.base_tileset, this.farm_tileset], 0, 0);
        this.level2Layer = this.map.createLayer("Level2", this.food_tileset, 0, 0);
        this.level3Layer = this.map.createLayer("Level3", this.base_tileset, 0, 0);
        this.level31Layer = this.map.createLayer("Level3-1", this.base_tileset, 0, 0);

        this.add.text(590, 90, "Congrats!", this.textConfig);
        this.add.text(610, 150, "Your score is: ", this.textConfig).setFontSize(30);
        this.add.text(700, 180, this.scene.get("levelThreeScene").coinsAmount, this.textConfig).setFontSize(30);
        
        this.add.image(715, 300, "button").setInteractive().on('pointerdown', () => {for (const scene of this.scene.manager.getScenes(false)) {
            scene.scene.stop();
        }; this.scene.start("startScreenScene")});
        this.add.text(630, 280, "Play again?", this.textConfig).setFontSize(30).setColor("black");
    }
}