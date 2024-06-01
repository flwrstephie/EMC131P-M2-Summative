import game from '../main.js';

class GameScene_Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene_Level2' });
    }

    preload() {
        this.load.image('blueberry', './assets/sprites/blueberry.png');
        this.load.image('bird', './assets/sprites/bird.png');
        this.load.image('backgroundFar', './assets/sprites/backgroundFar.png');  
        this.load.image('backgroundMid', './assets/sprites/backgroundMid.png');  
        this.load.image('backgroundNear', './assets/sprites/backgroundNear.png'); 

        this.load.spritesheet('daisy', './assets/sprites/daisy.png', { frameWidth: 25, frameHeight: 25 });
        this.load.spritesheet('girl', './assets/sprites/farmer.png', { frameWidth: 60, frameHeight: 90 });

        this.load.image('Level1Tiles', './assets/sprites/tilemaps/Level1.png'); 
        this.load.image('waterZone', './assets/sprites/tilemaps/water.png');
        this.load.image('daisyTile', './assets/sprites/tilemaps/daisy.png'); // Changed the name of the daisy tile
        this.load.tilemapTiledJSON('level2Map', './assets/sprites/tilemaps/gameMap-Level2.json');
    }

    create() {
        // Reset score and daisies collected
        this.score = 0;
        this.daisiesCollected = 0;

        this.sound.stopAll();

        this.backgroundFar = this.add.tileSprite(0, 0, 960, 540, 'backgroundFar').setOrigin(0).setScrollFactor(0);
        this.backgroundMid = this.add.tileSprite(0, 0, 960, 540, 'backgroundMid').setOrigin(0).setScrollFactor(0);
        this.backgroundNear = this.add.tileSprite(0, 0, 960, 540, 'backgroundNear').setOrigin(0).setScrollFactor(0);

        const map = this.make.tilemap({ key: 'level2Map' });
        const platformTiles = map.addTilesetImage('Level1', 'Level1Tiles');
        const waterZone = map.addTilesetImage('water', 'waterZone');
        const daisyTiles = map.addTilesetImage('daisy', 'daisyTile'); // Changed the name of the daisy tiles

        const groundLayer = map.createLayer('ground', platformTiles, 0, 0);
        const grassLayer = map.createLayer('grass', platformTiles, 0, 0);
        grassLayer.setDepth(1);

        const daisiesLayer = map.createLayer('flowers', daisyTiles, 0, 0); // Changed the layer name to daisiesLayer
        daisiesLayer.setCollisionByProperty({ collides: true });
        daisiesLayer.setTileIndexCallback([2], this.collectDaisies, this);

        const waterLayer = map.createLayer('water', waterZone, 0, 0);
        waterLayer.setCollisionByExclusion([-1]);

        groundLayer.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(230, 700, 'girl');
        this.player.body.setSize(30, 90); 
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setDepth(2);

        // Add collision between player and ground layer
        this.physics.add.collider(this.player, groundLayer);

        // Add collision between player and daisies layer
        this.physics.add.collider(this.player, daisiesLayer, this.collectDaisies, null, this);

        // Add collision between player and water layer
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

        this.updateScoreText();
        this.updateDaisiesCollectedText();

        const goal = this.physics.add.sprite(2600, 625, 'bird');
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

        this.updateBackgroundPositions();
    }

    updateBackgroundPositions() {
        this.backgroundFar.tilePositionX = this.cameras.main.scrollX * 0.25;
        this.backgroundMid.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.backgroundNear.tilePositionX = this.cameras.main.scrollX * 0.75;
    }

    collectDaisies(player, tile) {
        if (tile) {
            tile.tilemapLayer.removeTileAt(tile.x, tile.y);
            this.score += 10;
            this.daisiesCollected += 1;
            this.updateScoreText();
            this.updateDaisiesCollectedText();
        }
    }
    
    updateScoreText() {
        this.scoreText.setText('Score: ' + this.score);
    }

    updateDaisiesCollectedText() {
        this.daisiesCollectedText.setText('x ' + this.daisiesCollected);
    }

    gameOver() {
        this.scene.pause(); 
        this.scene.start('GameOverScene3', { score: this.score, daisiesCollected: this.daisiesCollected });
    }

    checkGoal(player, goal) {
        if (this.daisiesCollected === 5) {
            this.scene.start('WinScene3', { score: this.score, daisiesCollected: this.daisiesCollected }); // Pass both score and daisiesCollected
        } else {
            const notEnoughDaisiesText = this.add.text(2550, 600, 'Not enough flowers', {
                fontSize: '20px',
                fontFamily: 'Fatpix',
                fill: '#fde6ee',
                stroke: '#eca03e',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(10);
            this.tweens.add({
                targets: notEnoughDaisiesText,
                alpha: 0,
                duration: 2000,
                ease: 'Power1',
                onComplete: function () {
                    notEnoughDaisiesText.destroy();
                }
            });
        }
    }
    
}

export default GameScene_Level2;
