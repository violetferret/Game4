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
        this.ACCELERATION = 200;
        this.DRAG = 4000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        // amnt of coins 
        this.coinsAmount = 0;
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
        my.sprite.player = this.physics.add.sprite(30, 750, "platformer_characters", "tile_0006.png");
        my.sprite.player.flipX = true;
        my.sprite.player.setCollideWorldBounds(true);

        // enable collision handling
        this.treeLeavesCollider = this.physics.add.collider(my.sprite.player, this.treeLeavesLayer);
        this.treeTrunksCollider = this.physics.add.collider(my.sprite.player, this.treeTrunksLayer);
        this.groundCollider = this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.plantsCollider = this.physics.add.collider(my.sprite.player, this.plantsLayer);

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

        // create camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        // create blocks
        my.sprite.block1 = this.physics.add.sprite(450, 850, "tilemap", "tile_0006.png");
        my.sprite.block1.setScale(2.5);

        my.sprite.block2 = this.physics.add.sprite(1300, 1050, "tilemap", "tile_0006.png");
        my.sprite.block2.setScale(5);

        my.sprite.block3 = this.physics.add.sprite(1200, 1050, "tilemap", "tile_0006.png");
        my.sprite.block3.setScale(3);

        my.sprite.block4 = this.physics.add.sprite(4000, 900, "tilemap", "tile_0006.png");
        my.sprite.block4.setScale(4);

        // make blocks collidable
        this.physics.add.collider(my.sprite.block1, this.groundLayer);
        this.physics.add.collider(my.sprite.block1, my.sprite.player);

        this.physics.add.collider(my.sprite.block2, this.groundLayer);
        this.physics.add.collider(my.sprite.block2, my.sprite.player);
        this.physics.add.collider(my.sprite.block2, my.sprite.block3);
        this.physics.add.collider(my.sprite.block3, my.sprite.block2);

        this.physics.add.collider(my.sprite.block3, this.groundLayer);
        this.physics.add.collider(my.sprite.block3, my.sprite.player);

        this.physics.add.collider(my.sprite.block4, this.groundLayer);
        this.physics.add.collider(my.sprite.block4, my.sprite.player);

        // add sound effects
        this.sound.stopAll();
        this.soundPlaying = false;

        this.grassWalkSound = this.sound.add("grassWalk");
        this.grassWalkSound.loop = true;
        this.grassWalkSound.volume = 0.25;

        this.woodWalkSound = this.sound.add("woodWalk");
        this.woodWalkSound.loop = true;
        this.woodWalkSound.volume = 0.5;

        this.coinsSound = this.sound.add("coins");
        this.coinsSound.volume = 1;

        this.playerFallSound = this.sound.add("playerFall");
        this.playerFallSound.volume = 1;

        this.playerJumpSound = this.sound.add("jump");
        this.playerJumpSound.volume = .25;

        // play music
        this.levelOneMusic = this.sound.add("levelOneMusic");
        this.levelOneMusic.loop = true;
        this.levelOneMusic.volume = 0.25;
        this.levelOneMusic.play();

        // create coins
        this.coins = this.map.createFromObjects("Coins", {
            name: "coin",
            key: "base_tilemap_sheet",
            frame: 151
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        this.coinGroup = this.add.group(this.coins);

        // handle collisison with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.sound.play("coins");
            this.coinsAmount++;
        });

        // start HUD
        this.scene.launch("hudScene", "levelOneScene");
    }

    update() {
        // console.log(my.sprite.player.x, my.sprite.player.y)
        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();

                // play sound effect
                if (!this.soundPlaying) {
                    this.grassWalkSound.play();
                    this.soundPlaying = true;
                }
            }

        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();

                // play sound effect
                if (!this.soundPlaying) {
                    // TODO: fix sound effects when walking
                    // if ((this.map.getTileAt(my.sprite.player.x, my.sprite.player.y, this.treeTrunksLayer) == 99)
                    // | (this.map.getTileAt(my.sprite.player.x, my.sprite.player.y, this.treeTrunksLayer) == 119)) {
                    //     this.woodWalkSound.play();
                    // } else {
                    this.grassWalkSound.play();
                    //}
                    // TODO: fix bug when this happens in the air?
                    this.soundPlaying = true;
                }
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();

            this.grassWalkSound.stop();
            this.soundPlaying = false;
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.playerJumpSound.play();
        }
        // credit to this Phaser forum post for this funcitonality: 
        // https://phaser.discourse.group/t/one-way-and-pass-thru-platforms-in-phaser-3/11641/4
        if (Phaser.Input.Keyboard.JustDown(cursors.down) /* && my.sprite.player.body.checkCollision.down */) {

            this.drop(this.treeLeavesCollider, this.treeTrunksCollider, this.plantsCollider);
        } // else {
        // this.dropExpire(this.treeLeavesCollider, this.treeTrunksCollider);
        // this.time.delayedCall(5000, this.dropExpire(this.treeLeavesCollider, this.treeTrunksCollider), null, this);
        // }

        if ((Phaser.Input.Keyboard.JustUp(cursors.down))) {
            this.dropExpire(this.treeLeavesCollider, this.treeTrunksCollider, this.plantsCollider)
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        // go to next scene
        if (my.sprite.player.x >= 4300) {
            this.scene.start("levelTwoScene");
            this.levelOneMusic.stop();
        }
    }

    // credit to this Phaser forum post for these functions: 
    // https://phaser.discourse.group/t/one-way-and-pass-thru-platforms-in-phaser-3/11641/4
    drop(treeLeavesCollider, treeTrunksCollider, plantsCollider) {
        my.sprite.player.setVelocityY(150);
        treeLeavesCollider.active = false;
        treeTrunksCollider.active = false;
        plantsCollider.active = false;
    }

    dropExpire(treeLeavesCollider, treeTrunksCollider, plantsCollider) {
        // my.sprite.player.body.checkCollision.down = true;
        treeLeavesCollider.active = true;
        treeTrunksCollider.active = true;
        plantsCollider.active = true;
    }
}