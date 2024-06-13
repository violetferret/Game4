class LevelTwo extends Phaser.Scene {
    constructor() {
        super("levelTwoScene");
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
        this.background_map = this.make.tilemap({ key: "level-2-background" });
        this.map = this.make.tilemap({ key: "level-2" });

        // set world bounds w/ physics library
        this.physics.world.setBounds(0, 0, 245 * 18, 85 * 18);

        // load tilesets
        this.background_tileset = this.background_map.addTilesetImage("background_tilemap", "background_tilemap_tiles");
        this.base_tileset = this.map.addTilesetImage("base_tilemap", "base_tilemap_tiles");
        this.food_tileset = this.map.addTilesetImage("food_tilemap", "food_tilemap_tiles");

        // load layers
        this.backgroundLayer = this.background_map.createLayer("Background", this.background_tileset, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.food_tileset, 0, 0);
        this.airLayer = this.map.createLayer("Air-Platforms", this.food_tileset, 0, 0);
        this.extrasLayer = this.map.createLayer("Extras", this.food_tileset, 0, 0);

        // set properties for background
        this.backgroundLayer.setScale(4);
        this.backgroundLayer.setScrollFactor(.5);

        // make layers collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // layers with one-way platforms
        // credit to https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-tile-maps for implementation
        this.airLayer.forEachTile(tile => {
            if (tile.properties["oneWay"]) {
                tile.setCollision(false, false, true, false);
            }
            else if (tile.properties["collides"]) {
                tile.setCollision(true, true, true, true);
            }
        });

        // start animate plugin
        this.animatedTiles.init(this.map);

        // set up player avatar
        // TODO: fix w/ choice
        my.sprite.player = this.physics.add.sprite(3300, 500, "platformer_characters", "tile_0006.png");
        my.sprite.player.flipX = true;
        my.sprite.player.setCollideWorldBounds(true);

        // enable collision handling
        this.groundCollider = this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.airCollider = this.physics.add.collider(my.sprite.player, this.airLayer);

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
        this.levelTwoMusic = this.sound.add("levelTwoMusic");
        this.levelTwoMusic.loop = true;
        this.levelTwoMusic.volume = 0.25;
        this.levelTwoMusic.play();

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
        this.scene.launch("hudScene", "levelTwoScene");

        // moving platforms

        // platform 1
        this.platform1 = this.physics.add.image(1700, 550, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform1.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform1.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 100, y: 0, duration: 4000, ease: 'Stepped' },
                { x: -100, y: 0, duration: 4000, ease: 'Stepped' },
            ]
        });
        this.platform1.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform1);

        // platform 2
        this.platform2 = this.physics.add.image(1700, 630, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform2.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform2.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 50, y: 0, duration: 8000, ease: 'Stepped' },
                { x: -50, y: 0, duration: 8000, ease: 'Stepped' },
            ]
        });
        this.platform2.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform2);

        // platform 3
        this.platform3 = this.physics.add.image(1650, 760, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform3.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform3.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 50, y: 50, duration: 4000, ease: 'Stepped' },
                { x: -50, y: -50, duration: 4000, ease: 'Stepped' },
            ]
        });
        this.platform3.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform3);

        // platform 4
        this.platform4 = this.physics.add.image(1900, 760, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform4.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform4.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 50, y: 50, duration: 4000, ease: 'Stepped' },
                { x: -50, y: -50, duration: 4000, ease: 'Stepped' },
            ]
        });
        this.platform4.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform4);

        // platform 5
        this.platform5 = this.physics.add.image(1700, 1020, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform5.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform5.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 100, y: 0, duration: 4000, ease: 'Stepped' },
                { x: -100, y: 0, duration: 4000, ease: 'Stepped' },
            ]
        });
        this.platform5.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform5);

        // platform 6
        this.platform6 = this.physics.add.image(1700, 1100, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform6.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform6.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 50, y: 0, duration: 8000, ease: 'Stepped' },
                { x: -50, y: 0, duration: 8000, ease: 'Stepped' },
            ]
        });
        this.platform6.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform6);

        // platform 7
        this.platform7 = this.physics.add.image(1700, 1180, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform7.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform7.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 100, y: 0, duration: 4000, ease: 'Stepped' },
                { x: -100, y: 0, duration: 4000, ease: 'Stepped' },
            ]
        });
        this.platform7.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform7);

        // platform 8
        this.platform8 = this.physics.add.image(1700, 1340, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform8.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform8.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 50, y: 0, duration: 8000, ease: 'Stepped' },
                { x: -50, y: 0, duration: 8000, ease: 'Stepped' },
            ]
        });
        this.platform8.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform8);

        // platform 9
        this.platform9 = this.physics.add.image(2790, 600, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform9.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform9.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 0, y: 100, duration: 6000, ease: 'Stepped' },
                { x: 0, y: -100, duration: 6000, ease: 'Stepped' },
            ]
        });
        this.platform9.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform9);

        // platform 10
        this.platform10 = this.physics.add.image(3150, 600, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform10.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform10.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 0, y: 100, duration: 6000, ease: 'Stepped' },
                { x: 0, y: -100, duration: 6000, ease: 'Stepped' },
            ]
        });
        this.platform10.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform10);

        // platform 11
        this.platform11 = this.physics.add.image(3500, 100, 'cloud')
            .setImmovable(true)
            .setVelocity(0, 0);
        this.platform11.body.setAllowGravity(false);
        this.tweens.chain({
            targets: this.platform11.body.velocity,
            loop: -1,
            // yoyo: true,
            tweens: [
                { x: 0, y: 100, duration: 12000, ease: 'Stepped' },
                { x: 0, y: -100, duration: 12000, ease: 'Stepped' },
            ]
        });
        this.platform11.body.checkCollision.down = false;
        this.physics.add.collider(my.sprite.player, this.platform11);
    }

    update() {
        console.log(my.sprite.player.x, my.sprite.player.y);
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
        // credit to 
        // https://www.html5gamedevs.com/topic/44980-double-jump-phaser-3/
        // for thinking behind double jump implementation
        this.doubleJump = false;
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (my.sprite.player.body.blocked.down && !this.doubleJump) {
                    this.doubleJump = true;
                    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                    this.playerJumpSound.play();
                } else {
                    this.doubleJump = false;
                    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                    this.playerJumpSound.play();
                }
            }
        
        // credit to this Phaser forum post for this funcitonality: 
        // https://phaser.discourse.group/t/one-way-and-pass-thru-platforms-in-phaser-3/11641/4
        if (Phaser.Input.Keyboard.JustDown(cursors.down) /* && my.sprite.player.body.checkCollision.down */) {

            //this.drop(this.treeLeavesCollider, this.treeTrunksCollider, this.plantsCollider);
        } // else {
        // this.dropExpire(this.treeLeavesCollider, this.treeTrunksCollider);
        // this.time.delayedCall(5000, this.dropExpire(this.treeLeavesCollider, this.treeTrunksCollider), null, this);
        // }

        if ((Phaser.Input.Keyboard.JustUp(cursors.down))) {
            //this.dropExpire(this.treeLeavesCollider, this.treeTrunksCollider, this.plantsCollider)
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

    // credit to
    moveVertically() {
        this.scene.tweens.addCounter({
            from: 0,
            to: -300,
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
            repeat: -1,
            yoyo: true,
            onUpdate: (tween, target) => {
                const x = startX + target.value
                const dx = x - this.x
                this.x = x
                this.setVelocityX(dx)
            }
        })
    }

    // credit to this Phaser forum post for these functions: 
    // https://phaser.discourse.group/t/one-way-and-pass-thru-platforms-in-phaser-3/11641/4
    // TODO: FIX???
    // drop(treeLeavesCollider, treeTrunksCollider, plantsCollider) {
    //     my.sprite.player.setVelocityY(150);
    //     treeLeavesCollider.active = false;
    //     treeTrunksCollider.active = false;
    //     plantsCollider.active = false;
    // }

    // dropExpire(treeLeavesCollider, treeTrunksCollider, plantsCollider) {
    //     // my.sprite.player.body.checkCollision.down = true;
    //     treeLeavesCollider.active = true;
    //     treeTrunksCollider.active = true;
    //     plantsCollider.active = true;
    // }
}