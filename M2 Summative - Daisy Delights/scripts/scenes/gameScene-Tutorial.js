import game from '../main.js';

class GameScene_Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene_Tutorial' });
        this.score = 0;
        this.daisiesCollected = 0;     
        this.backgroundMusic = null;    
    }

    preload() {
        this.load.image('clouds', './assets/sprites/clouds.png'); 
        this.load.image('goal', './assets/sprites/goal.png');

        this.load.spritesheet('daisy', './assets/sprites/daisy.png', { frameWidth: 25, frameHeight: 25 });
        this.load.spritesheet('girl', './assets/sprites/farmer.png', { frameWidth: 60, frameHeight: 90 });
        
        this.load.image('tiles', './assets/sprites/tilemaps/grassPlatform.png');
        this.load.image('buttonTiles', './assets/sprites/tilemaps/buttons.png');
        this.load.image('waterZone', './assets/sprites/tilemaps/water.png');
        this.load.tilemapTiledJSON('map', './assets/sprites/tilemaps/gameMap-Tutorial.json');

        this.load.audio('theme', './assets/audio/bgm/game.mp3');
        this.load.audio('collectFlower', './assets/audio/sfx/daisyCollect.wav')
    }

    create() {
        this.sound.stopAll(); 

        this.score = 0;
        this.daisiesCollected = 0;
        this.cameras.main.setBackgroundColor('#88a1d7'); 
        const clouds = this.add.tileSprite(0, 0, 960, 540, 'clouds').setOrigin(0);
        clouds.setScrollFactor(0); 
    
        this.tweens.add({
            targets: clouds,
            tilePositionX: 960, 
            duration: 5000, 
            ease: 'Linear',
            loop: -1 
        });
    
        const map = this.add.tilemap('map');
        const platformTiles = map.addTilesetImage('grassPlatform', 'tiles');
        const buttonTiles = map.addTilesetImage('buttons', 'buttonTiles');
        const waterZone = map.addTilesetImage('water', 'waterZone');
        const grassLayer = map.createLayer('grass', platformTiles, 0, 0);
        grassLayer.setDepth(-1); 
        
        const groundLayer = map.createLayer('ground', platformTiles, 0, 0);
        const waterLayer = map.createLayer('water', waterZone, 0, 0);
        const tutorialButtons = map.createLayer('tutorial', buttonTiles, 0, 0);
        
        const tutorialLayer = map.getObjectLayer('Tutorial');
        tutorialLayer.objects.forEach(object => {
            const text = object.text;
            const adjustedX = object.x + (object.width / 2);  
            const adjustedY = object.y - (object.height / 3);  
            this.add.text(adjustedX, adjustedY, text.text, {
                fontFamily: text.fontfamily,
                fontSize: `${text.pixelsize}px`,
                color: text.color
            }).setOrigin(0.5, 0.5);  
        });
    
        groundLayer.setCollisionByExclusion([-1]);
        waterLayer.setCollisionByExclusion([-1]);
    
        this.player = this.physics.add.sprite(50, 450, 'girl');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, waterLayer, this.gameOver, null, this);
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('girl', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('girl', { start: 6, end: 9 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(0, 40);
        this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true;
    
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('daisy', { start: 0, end: 2}),
            frameRate: 8,
            repeat: -1
        });
    
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
    
        const daisyIcon = this.add.sprite(35, 70, 'daisy').play('spin');
        daisyIcon.setScale(1.5);
        daisyIcon.setDepth(100);
        daisyIcon.setScrollFactor(0);
    
        this.daisy = this.physics.add.sprite(2000, 290, 'daisy').play('spin');
        this.daisy.setImmovable(true);
        this.daisy.body.allowGravity = false;  
    
        const daisy2 = this.physics.add.sprite(2850, 80, 'daisy').play('spin');
        daisy2.setImmovable(true);
        daisy2.body.allowGravity = false;
        this.physics.add.overlap(this.player, daisy2, this.collectDaisy, null, this);
    
        const daisy3 = this.physics.add.sprite(3510, 430, 'daisy').play('spin');
        daisy3.setImmovable(true);
        daisy3.body.allowGravity = false;
        this.physics.add.overlap(this.player, daisy3, this.collectDaisy, null, this);
    
        const daisy4 = this.physics.add.sprite(3750, 250, 'daisy').play('spin');
        daisy4.setImmovable(true);
        daisy4.body.allowGravity = false;
        this.physics.add.overlap(this.player, daisy4, this.collectDaisy, null, this);
    
        const daisy5 = this.physics.add.sprite(4280, 110, 'daisy').play('spin');
        daisy5.setImmovable(true);
        daisy5.body.allowGravity = false;
        this.physics.add.overlap(this.player, daisy5, this.collectDaisy, null, this);
    
        this.physics.add.overlap(this.player, this.daisy, this.collectDaisy, null, this);
    
        const goal = this.physics.add.sprite(5090, 438, 'goal');
        goal.setImmovable(true);  
        goal.body.allowGravity = false; 
    
        this.physics.add.overlap(this.player, goal, this.checkGoal, null, this);
    
        this.notEnoughText = this.add.text(4925, 350, 'Not enough daisies!', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#eca03e',
            strokeThickness: 4
        });
        this.notEnoughText.setOrigin(0.5);
        this.notEnoughText.setVisible(false);
    
        this.timerEvent = this.time.addEvent({
            delay: 5000,
            callback: this.hideNotEnoughText,
            callbackScope: this,
            loop: false
        });

        this.backgroundMusic = this.sound.add('theme', { loop: true });
        this.backgroundMusic.play();

        this.collectFlowerSound = this.sound.add('collectFlower');

        this.events.on('pause', this.pauseScene, this);
        this.events.on('resume', this.resumeScene, this);
        this.events.on('hide', this.hideScene, this);
        this.events.on('show', this.showScene, this);
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
    }

    collectDaisy(player, daisy) {
        daisy.disableBody(true, true);

        this.score += 10;
        this.daisiesCollected += 1;
    
        this.scoreText.setText('Score: ' + this.score);
        this.daisiesCollectedText.setText('x ' + this.daisiesCollected);

        this.collectFlowerSound.play();
    }

    resetPlayerStats() {    
        this.score = 0;
        this.daisiesCollected = 0;

        this.scoreText.setText('Score: ' + this.score);
        this.daisiesCollectedText.setText('x ' + this.daisiesCollected);
    }
    
    gameOver() {
        this.scene.pause(); 
        this.scene.start('GameOverScene1', { score: this.score, daisiesCollected: this.daisiesCollected });
    }

    checkGoal(player, goal) {
        if (this.daisiesCollected === 5) {
            this.scene.start('WinScene1', { score: this.score, daisiesCollected: this.daisiesCollected });
        } else {
            this.notEnoughText.setVisible(true);
            setTimeout(() => {
                this.hideNotEnoughText();
            }, 3000);
        }
    }

    hideNotEnoughText() {
        this.notEnoughText.setVisible(false);
    }

    resetGame() {
        this.resetPlayerStats();
        this.scene.restart();
    }

    pauseScene() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }

    resumeScene() {
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.resume();
        }
    }

    hideScene() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }

    showScene() {
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.resume();
        }
    }

    shutdown() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }
}
export default GameScene_Tutorial;