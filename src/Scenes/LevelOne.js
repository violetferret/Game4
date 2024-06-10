class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOneScene");
    }

    preload() {
        // load animation plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init() {
        // variables and settings
        this.ACCELERATION = 90;
        this.DRAG = 4000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -440;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {
        // create new tilemap game object
        this.background_map = this.make.tilemap({ key: "level-1-background" });
        this.map = this.make.tilemap({ key: "level-1" });

        // set world bounds w/ physics library
        this.physics.world.setBounds(0, 0, 245 * 18, 85 * 18);

        // load tilesets
        this.background_tileset = this.background_map.addTilesetImage("background_tilemap", "background_tilemap_tiles");
        this.base_tileset = this.map.addTilesetImage("base_tilemap_packed", "base_tilemap_tiles");
        this.farm_tileset = this.map.addTilesetImage("farm_tilemap_packed", "farm_tilemap_tiles");
        // this.food_tileset = this.map.addTilesetImage("food_tilemap_packed", "food_tilemap_tiles");

        // load layers
        this.backgroundLayer = this.background_map.createLayer("Background", this.background_tileset, 0, 0);
        this.treeLeavesLayer = this.map.createLayer("Tree-Leaves", this.base_tileset, 0, 0);
        this.treeTrunksLayer = this.map.createLayer("Tree-Trunks", this.base_tileset, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.base_tileset, 0, 0);
        this.groundExtraLayer = this.map.createLayer("Ground-Extra", this.base_tileset, 0, 0);
        this.plantsLayer = this.map.createLayer("Plants", [this.base_tileset, this.farm_tileset], 0, 0);

        // set properties for background
        this.backgroundLayer.setScale(4);
        this.backgroundLayer.setScrollFactor(.5);

        // make layers collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.groundExtraLayer.setCollisionByProperty({
            collides: true
        });

        // layers with one-way platforms
        // credit to https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-tile-maps for implementation
        this.treeLeavesLayer.forEachTile(tile => {
            if (tile.properties["oneWay"]) {
                tile.setCollision(false, false, true, false);
            }
        });

        this.treeTrunksLayer.forEachTile(tile => {
            if (tile.properties["oneWay"]) {
                tile.setCollision(false, false, true, false);
            }
        });

        this.plantsLayer.forEachTile(tile => {
            if (tile.properties["oneWay"]) {
                tile.setCollision(false, false, true, false);
            }
        });

        // start animate plugin
        this.animatedTiles.init(this.map);

        // set up player avatar
        // TODO: fix w/ choice
        my.sprite.player = this.physics.add.sprite(30, 530, "platformer_characters", "tile_0006.png");
        my.sprite.player.flipX = true;
        my.sprite.player.setCollideWorldBounds(true);

        // enable collision handling
        this.physics.add.collider(my.sprite.player, this.treeLeavesLayer);
        this.physics.add.collider(my.sprite.player, this.treeTrunksLayer);
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.plantsLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        this.physics.world.drawDebug = false;
        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx
        my.vfx.walking = this.add.particles(-10, 0, "particles", {
            frame: ['particle.png', 'particle.png'],
            // TODO: Try: add 
            random: true,
            scale: { start: .8, end: .2 },
            // TODO: Try: 
            maxAliveParticles: 10,
            lifespan: 600,
            // TODO: Try: 
            gravityY: -100,
            alpha: { start: 1, end: 0.1 },
        });

        my.vfx.walking.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
        // credit to this Phaser forum post for this funcitonality: 
        // https://phaser.discourse.group/t/one-way-and-pass-thru-platforms-in-phaser-3/11641/4
        if (my.sprite.player.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.down) && my.sprite.player.body.checkCollision.down) {
            drop();
            this.time.delayedCall(200, dropExpire);
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }

    // credit to this Phaser forum post for these functions: 
    // https://phaser.discourse.group/t/one-way-and-pass-thru-platforms-in-phaser-3/11641/4
    drop() {
        my.sprite.player.setVelocityY(150);
        my.sprite.player.body.checkCollision.down = false;
    }

    dropExpire() {
        my.sprite.player.body.checkCollision.down = true;
    }
}