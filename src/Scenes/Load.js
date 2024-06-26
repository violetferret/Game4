class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // load character atlas
        this.load.atlas("platformer_characters", "assets/tilemaps/character_tilemap_packed.png", "assets/tilemaps/character_tilemap.json");

        // load atlas for blocks
        this.load.atlas("tilemap", "assets/tilemaps/tilemap.png", "assets/tilemaps/tilemap.json");

        // load tilemaps
        this.load.image("background_tilemap_tiles", "assets/tilemaps/background_tilemap_packed.png");
        this.load.image("base_tilemap_tiles", "assets/tilemaps/base_tilemap_packed.png");
        this.load.image("farm_tilemap_tiles", "assets/tilemaps/farm_tilemap_packed.png");
        this.load.image("food_tilemap_tiles", "assets/tilemaps/food_tilemap_packed.png");

        // load levels
        this.load.tilemapTiledJSON("level-1", "assets/level-1.tmj");
        this.load.tilemapTiledJSON("level-1-background", "assets/level-1-background.tmj");

        this.load.tilemapTiledJSON("level-2", "assets/level-2.tmj");
        this.load.tilemapTiledJSON("level-2-background", "assets/level-2-background.tmj");

        this.load.tilemapTiledJSON("level-3", "assets/level-3.tmj");
        this.load.tilemapTiledJSON("level-3-background", "assets/level-3-background.tmj");

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

        // load platform
        this.load.image("cloud", "assets/tilemaps/cloud.png");

        // load particle multiatlas
        this.load.multiatlas("particles", "assets/particles.json");

        // TODO: load audio
        // "On My Way" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
        this.load.audio("levelOneMusic", "assets/audio/On My Way.mp3");

        // "Rainbows" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
        this.load.audio("levelTwoMusic", "assets/audio/Rainbows.mp3");

        // "Almost New" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
        this.load.audio("levelThreeMusic", "assets/audio/Almost New.mp3");

        this.load.audio("grassWalk", "assets/audio/footstep_grass_004.ogg");
        this.load.audio("snowWalk", "assets/audio/footstep_snow_004.ogg");
        this.load.audio("coins", "assets/audio/handleCoins2.ogg");
        this.load.audio("playerFall", "assets/audio/impactPunch_heavy_000.ogg");
        this.load.audio("jump", "assets/audio/select_006.ogg");
    }

    create() {
        // create walking animations for player character sprite
        // TODO: fix for all types of characters to choose, use parameter?
        this.avatar = this.scene.get("startScreenScene").avatar
        this.jump_frame;
        this.start_val;

        if (this.avatar == "tile_0000.png") {
            this.start_val = 0;
            this.jump_frame = "tile_0001.png";
        } else if (this.avatar == "tile_0002.png") {
            this.start_val = 2;
            this.jump_frame = "tile_0003.png";
        } else if (this.avatar == "tile_0004.png") {
            this.start_val = 4;
            this.jump_frame = "tile_0005.png";
        } else if (this.avatar == "tile_0006.png") {
            this.start_val = 6;
            this.jump_frame = "tile_0007.png";
        } else if (this.avatar == "tile_0009.png") {
            this.start_val = 9;
            this.jump_frame = "tile_0010.png";
        }
        console.log(this.avatar, this.jump_frame, this.start_val)

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: this.start_val,
                end: this.start_val + 1,
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
                { frame: this.avatar }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: this.jump_frame }
            ],
        });

        // start scene
        this.scene.start("levelOneScene");
    }

    update() {
    }
}