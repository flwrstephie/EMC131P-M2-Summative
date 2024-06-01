import game from '../main.js';

class GameScene_Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene_Level1' });
    }

    preload() {
        this.load.image('blueberry', './assets/sprites/blueberry.png');
        this.load.image('sign', './assets/sprites/sign.png');
        this.load.image('backgroundFar', './assets/sprites/backgroundFar.png');  
        this.load.image('backgroundMid', './assets/sprites/backgroundMid.png');  
        this.load.image('backgroundNear', './assets/sprites/backgroundNear.png'); 

        this.load.spritesheet('daisy', './assets/sprites/daisy.png', { frameWidth: 25, frameHeight: 25 });
        this.load.spritesheet('girl', './assets/sprites/farmer.png', { frameWidth: 60, frameHeight: 90 });

        this.load.image('Level1Tiles', './assets/sprites/tilemaps/Level1.png'); 
        this.load.image('waterZone', './assets/sprites/tilemaps/water.png');
        this.load.tilemapTiledJSON('level1Map', './assets/sprites/tilemaps/gameMap-Level1.json');
    }

    create() {
        // Reset score and berries collected
        this.score = 0;
        this.berriesCollected = 0;

        this.sound.stopAll();

        this.backgroundFar = this.add.tileSprite(0, 0, 960, 540, 'backgroundFar').setOrigin(0).setScrollFactor(0);
        this.backgroundMid = this.add.tileSprite(0, 0, 960, 540, 'backgroundMid').setOrigin(0).setScrollFactor(0);
        this.backgroundNear = this.add.tileSprite(0, 0, 960, 540, 'backgroundNear').setOrigin(0).setScrollFactor(0);

        const map = this.make.tilemap({ key: 'level1Map' });
        const platformTiles = map.addTilesetImage('Level1', 'Level1Tiles');
        const waterZone = map.addTilesetImage('water', 'waterZone');

        const groundLayer = map.createLayer('ground', platformTiles, 0, 0);
        const grassLayer = map.createLayer('grass', platformTiles, 0, 0);
        grassLayer.setDepth(1);

        const berriesLayer = map.createLayer('berries', platformTiles, 0, 0);
        berriesLayer.setCollisionByProperty({ collides: true });
        berriesLayer.setTileIndexCallback([2], this.collectBerry, this);

        const waterLayer = map.createLayer('water', waterZone, 0, 0);
        waterLayer.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(230, 800, 'girl');
        this.player.body.setSize(30, 90); 
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setDepth(2);

        groundLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, berriesLayer, this.collectBerry, null, this);
        this.physics.add.collider(this.player, waterLayer, this.gameOver, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();


        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(0, 40);
        this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true;

        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#eca03e',
            strokeThickness: 4
        });

        this.daisiesCollectedText = this.add.text(60, 55, 'x 0', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#eca03e',
            strokeThickness: 4
        });

        this.scoreText.setDepth(100);
        this.daisiesCollectedText.setDepth(100);
        this.scoreText.setScrollFactor(0);
        this.daisiesCollectedText.setScrollFactor(0);

        const blueberryIcon = this.add.sprite(35, 70, 'blueberry');
        blueberryIcon.setScale(1.5);
        blueberryIcon.setDepth(100);
        blueberryIcon.setScrollFactor(0);

        this.updateScoreText();
        this.updateBerriesCollectedText();

        const goal = this.physics.add.sprite(4260, 750, 'sign');
        goal.setScale(2);
        goal.setImmovable(true);  
        goal.body.allowGravity = false; 
        this.physics.add.collider(this.player, goal, this.checkGoal, null, this);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn', true);
        }
    
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-330);
        }

        this.backgroundFar.tilePositionX = this.cameras.main.scrollX * 0.25;
        this.backgroundMid.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.backgroundNear.tilePositionX = this.cameras.main.scrollX * 0.75;
    }

    collectBerry(player, tile) {
        if (tile) {
            tile.tilemapLayer.removeTileAt(tile.x, tile.y);
            this.score += 10;
            this.berriesCollected += 1;
            this.updateScoreText();
            this.updateBerriesCollectedText();
        }
    }

    updateScoreText() {
        this.scoreText.setText('Score: ' + this.score);
    }

    updateBerriesCollectedText() {
        this.daisiesCollectedText.setText('x ' + this.berriesCollected);
    }

    checkGoal(player, goal) {
        if (this.berriesCollected >= 10) {
            // Pass the score and berriesCollected as data to the WinScene2
            this.scene.start('WinScene2', { score: this.score, daisiesCollected: this.berriesCollected });
        } else {
            if (!this.needMoreBerriesShown) {
                this.showNeedMoreBerriesMessage();
                this.needMoreBerriesShown = true;
            }
        }
    }
    

    showNeedMoreBerriesMessage() {
        const message = this.add.text(this.player.x - 50, this.player.y - 50, 'Hmm... I need more berries', {
            fontSize: '20px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#eca03e',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        this.time.delayedCall(5000, () => {
            message.destroy();
        });
    }


    gameOver() {
        this.scene.pause(); 
        this.scene.start('GameOverScene2', { score: this.score, daisiesCollected: this.berriesCollected });
    }

    updateBackgroundPositions() {
        this.backgroundFar.tilePositionX = this.cameras.main.scrollX * 0.25;
        this.backgroundMid.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.backgroundNear.tilePositionX = this.cameras.main.scrollX * 0.75;
    }
}

export default GameScene_Level1;
