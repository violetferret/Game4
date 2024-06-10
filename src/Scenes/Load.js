class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // load character atlas
        this.load.atlas("platformer_characters", "assets/tilemaps/character_tilemap_packed.png", "assets/tilemaps/character_tilemap.json");

        // load tilemaps
        this.load.image("background_tilemap_tiles", "assets/tilemaps/background_tilemap_packed.png");
        this.load.image("base_tilemap_tiles", "assets/tilemaps/base_tilemap_packed.png");
        this.load.image("farm_tilemap_tiles", "assets/tilemaps/farm_tilemap_packed.png");
        this.load.image("food_tilemap_tiles", "assets/tilemaps/food_tilemap_packed.png");

        // load levels
        // this.load.tilemapTiledJSON("start", "assets/start.tmj");
        this.load.tilemapTiledJSON("level-1", "assets/level-1.tmj");
        this.load.tilemapTiledJSON("level-1-background", "assets/level-1-background.tmj");

        this.load.tilemapTiledJSON("level-2", "assets/level-2.tmj");
        this.load.tilemapTiledJSON("level-2-background", "assets/level-2-background.tmj");

        this.load.tilemapTiledJSON("level-3", "assets/level-3.tmj");
        this.load.tilemapTiledJSON("level-3-background", "assets/level-3-background.tmj");

        // this.load.tilemapTiledJSON("end", "assets/end.tmj");

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

        // TODO: load particle multiatlas
        
        // TODO: load audio
        
    }

    create() {
        // create walking animations for player character sprite
        // TODO: fix for all types of characters to choose, use parameter?
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0007.png" }
            ],
        });

        // start scene
        this.scene.start("levelOneScene");
    }

    update() {
    }
}