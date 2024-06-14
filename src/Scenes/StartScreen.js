class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreenScene");
    }

    preload() {
        // create font config
        this.textConfig = {
            fontFamily: 'kenney-mini',
            fontSize: 50,
            color: "white",
        } 

        // load player avatar icons
        this.load.image("alien1", "assets/alien1.png");
        this.load.image("alien2", "assets/alien2.png");
        this.load.image("alien3", "assets/alien3.png");
        this.load.image("alien4", "assets/alien4.png");
        this.load.image("alien5", "assets/alien5.png");

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

        // create layers
        this.backgroundLayer = this.background_map.createLayer("Background", this.background_tileset, 0, 0);
        this.level12Layer = this.map.createLayer("Level1-2", this.base_tileset, 0, 0);
        this.level1Layer = this.map.createLayer("Level1", this.base_tileset, 0, 0);
        this.level13Layer = this.map.createLayer("Level1-3", [this.base_tileset, this.farm_tileset], 0, 0);
        this.level2Layer = this.map.createLayer("Level2", this.food_tileset, 0, 0);
        this.level3Layer = this.map.createLayer("Level3", this.base_tileset, 0, 0);
        this.level31Layer = this.map.createLayer("Level3-1", this.base_tileset, 0, 0);

        // title text
        this.add.text(625, 90, "(Pint-Sized)", this.textConfig).setFontSize(30);
        this.add.text(550, 120, "Pixel Puzzle!", this.textConfig);        

        // choose avatar & start scene
        this.avatar; 
        this.add.text(530, 170, "Choose your avatar:", this.textConfig).setFontSize(35);
        this.add.image(525, 250, "alien1").setScale(3).setInteractive().on('pointerdown', () => {this.avatar = "tile_0000.png", this.scene.start("loadScene")});
        this.add.image(620, 250, "alien2").setScale(3).setInteractive().on('pointerdown', () => {this.avatar = "tile_0002.png", this.scene.start("loadScene")});
        this.add.image(718, 250, "alien3").setScale(3).setInteractive().on('pointerdown', () => {this.avatar = "tile_0004.png", this.scene.start("loadScene")});
        this.add.image(815, 250, "alien4").setScale(3).setInteractive().on('pointerdown', () => {this.avatar = "tile_0006.png", this.scene.start("loadScene")});
        this.add.image(910, 250, "alien5").setScale(3).setInteractive().on('pointerdown', () => {this.avatar = "tile_0009.png", this.scene.start("loadScene")});

    }
}