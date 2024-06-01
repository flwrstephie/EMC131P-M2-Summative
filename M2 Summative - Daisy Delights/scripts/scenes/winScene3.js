import game from '../main.js';

class WinScene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene3' });
    }

    preload() {
        this.load.image('clouds', './assets/sprites/clouds.png'); 
        this.load.audio('victory', './assets/audio/sfx/victory.mp3');
    }

    init(data) {
        this.score = data.score;
        this.daisiesCollected = data.daisiesCollected;
    }

    create() {
        this.sound.stopAll(); 

        const victorySouond = this.sound.add('victory');
        victorySouond.play();

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

        this.add.text(480, 100, 'NOM NOM NOM', {
            fontSize: '72px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(480, 200, 'Score: ' + this.score, {
            fontSize: '35px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(480, 250, 'Flowers Collected: ' + this.daisiesCollected, {
            fontSize: '35px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        let restartButton = this.add.text(350, 450, 'RETRY', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene_Level2');
        });

        let quitButton = this.add.text(620, 450, 'HOME', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        this.addHoverEffect(restartButton);
        this.addHoverEffect(quitButton);
    }

    addHoverEffect(button) {
        button.on('pointerover', () => {
            button.setScale(1.1);
        });
        button.on('pointerout', () => {
            button.setScale(1);
        });
    }
}

export default WinScene3;
