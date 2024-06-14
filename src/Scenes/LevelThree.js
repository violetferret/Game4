class LevelThree extends Phaser.Scene {
    constructor() {
        super("levelThreeScene");
    }

    preload() {
        // load animation plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 100;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        // amnt of coins 
        this.coinsAmount = this.scene.get("levelTwoScene").coinsAmount;

        // swimming
        this.swim = false;
    }

    create() {
        // create new tilemap game object
        this.background_map = this.make.tilemap({ key: "level-3-background" });
        this.map = this.make.tilemap({ key: "level-3" });

        // set world bounds w/ physics library
        this.physics.world.setBounds(0, 0, 245 * 18, 85 * 18);

        // load tilesets
        this.background_tileset = this.background_map.addTilesetImage("background_tilemap", "background_tilemap_tiles");
        this.base_tileset = this.map.addTilesetImage("base_tilemap", "base_tilemap_tiles");

        // load layers
        this.backgroundLayer = this.background_map.createLayer("Background", this.background_tileset, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.base_tileset, 0, 0);
        this.waterBackLayer = this.map.createLayer("WaterBack", this.base_tileset, 0, 0);
        this.pipesLayer = this.map.createLayer("Pipes", this.base_tileset, 0, 0);
        this.airLayer = this.map.createLayer("Air-Platforms", this.base_tileset, 0, 0);
        this.waterfallsLayer = this.map.createLayer("Waterfalls", this.base_tileset, 0, 0);
        this.extrasLayer = this.map.createLayer("Extras", this.base_tileset, 0, 0);

        // set properties for background
        this.backgroundLayer.setScale(4);
        this.backgroundLayer.setScrollFactor(.5);

        // make layers collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.pipesLayer.setCollisionByProperty({
            collides: true
        });

        // start animate plugin
        this.animatedTiles.init(this.map);

        // set up player avatar
        // TODO: fix w/ choice
        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", this.scene.get("startScreenScene").avatar);
        my.sprite.player.flipX = true;
        my.sprite.player.setCollideWorldBounds(true);

        // create water layer to overlay over player
        this.waterLayer = this.map.createLayer("Water", this.base_tileset, 0, 0);

        // enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.pipesLayer);

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

        // add sound effects
        this.sound.stopAll();
        this.soundPlaying = false;

        // TODO: replace w/ snow walk sound
        this.snowWalkSound = this.sound.add("snowWalk");
        this.snowWalkSound.loop = true;
        this.snowWalkSound.volume = 0.25;

        this.coinsSound = this.sound.add("coins");
        this.coinsSound.volume = 1;

        this.playerFallSound = this.sound.add("playerFall");
        this.playerFallSound.volume = 1;

        this.playerJumpSound = this.sound.add("jump");
        this.playerJumpSound.volume = .25;

        // play music
        this.levelThreeMusic = this.sound.add("levelThreeMusic");
        this.levelThreeMusic.loop = true;
        this.levelThreeMusic.volume = 0.25;
        this.levelThreeMusic.play();

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
        this.scene.launch("hudScene", "levelThreeScene");
    }

    update() {
        // handle swimming

        let tile = this.waterLayer.getTileAtWorldXY(my.sprite.player.x, my.sprite.player.y);
        if (tile != null && tile.index == 74) {
            this.swim = true;
        } else if (tile != null && tile.index == 54){
            this.JUMP_VELOCITY = -1000000000;
            this.physics.world.gravity.y = 0;
        } else {
            this.swim = false;
        }

        if (this.swim) {
            // my.sprite.player.setAngle(90);
            // my.sprite.player.setAngle(0);
            this.physics.world.gravity.y = 150;
            this.JUMP_VELOCITY = -200;
        } else {
            my.sprite.player.setAngle(0);
            this.physics.world.gravity.y = 1300;
            this.JUMP_VELOCITY = -500;
        }

        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            if (this.swim) {
                my.sprite.player.setAngle(270);
            }
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();

                // play sound effect
                if (!this.soundPlaying) {
                    this.snowWalkSound.play();
                    this.soundPlaying = true;
                }
            }

        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            if (this.swim) {
                my.sprite.player.setAngle(90);
            }
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
                    this.snowWalkSound.play();
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

            this.snowWalkSound.stop();
            this.soundPlaying = false;
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (my.sprite.player.body.onFloor() && !this.swim) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.playerJumpSound.play();
            } else if (this.swim) {
                my.sprite.player.setAngle(0);
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                // this.playerJumpSound.play();
            }
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.down)&& this.swim) {
                my.sprite.player.setAngle(180);
            }
        

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
            this.levelThreeMusic.stop();
        }

        // go to next scene
        if (my.sprite.player.x >= 4300) {
            this.scene.start("endScreenScene");
            this.levelThreeMusic.stop();
        }

        // for falling into the void
        if (my.sprite.player.y >= 1420) {
            this.scene.restart();
            this.levelThreeMusic.stop();
        }
    }
}