class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreenScene");
    }

    preload() {
        // load tilemaps
        this.load.image("background_tilemap_tiles", "assets/tilemaps/background_tilemap_packed.png");
        this.load.image("base_tilemap_tiles", "assets/tilemaps/base_tilemap_packed.png");
        this.load.image("farm_tilemap_tiles", "assets/tilemaps/farm_tilemap_packed.png");
        this.load.image("food_tilemap_tiles", "assets/tilemaps/food_tilemap_packed.png");

        // load levels
        this.load.tilemapTiledJSON("start-end", "assets/start.tmj");

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
    }

    create() {

        // create new tilemap game object
        this.background_map = this.make.tilemap({ key: "start-end-background" });
        this.map = this.make.tilemap({ key: "start-end-1" });

        // load tilesets
        this.background_tileset = this.background_map.addTilesetImage("background_tilemap", "background_tilemap_tiles");
        this.base_tileset = this.map.addTilesetImage("base_tilemap_packed", "base_tilemap_tiles");
        this.farm_tileset = this.map.addTilesetImage("farm_tilemap_packed", "farm_tilemap_tiles");
        this.food_tileset = this.map.addTilesetImage("food_tilemap", "food_tilemap_tiles");

        this.backgroundLayer = this.background_map.createLayer("Background", this.background_tileset, 0, 0);
        this.level12Layer = this.map.createLayer("Level1-2", this.base_tileset, 0, 0);
        this.level1Layer = this.map.createLayer("Level1", this.base_tileset, 0, 0);
        this.level13Layer = this.map.createLayer("Level1-3", [this.base_tileset, this.farm_tileset], 0, 0);
        this.level2Layer = this.map.createLayer("Level2", this.food_tileset, 0, 0);
        this.level3Layer = this.map.createLayer("Level3", this.base_tileset, 0, 0);
        this.level31Layer = this.map.createLayer("Level3-1", this.base_tileset, 0, 0);

        

        // start game
        this.scene.start("loadScene");
    }

    update() {
    }
}