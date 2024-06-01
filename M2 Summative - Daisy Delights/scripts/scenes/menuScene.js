import game from '../main.js';

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('clouds', './assets/sprites/clouds.png'); 
        this.load.audio('menuTheme', './assets/audio/bgm/menu.mp3');
    }

    create() {
        this.sound.stopAll(); 

        this.backgroundMusic = this.sound.add('menuTheme', { loop: true });
        this.backgroundMusic.play();

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

        const title = this.add.text(480, 150, 'DAISY DELIGHTS', {
            fontSize: '90px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        const playButton = this.add.text(380, 300, 'PLAY', {
            fontSize: '40px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        const quitButton = this.add.text(580, 300, 'EXIT', {
            fontSize: '40px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(480, 450, 'Stephanie Pearl F. Virtudazo', {
            fontSize: '20px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(480, 480, 'EMC131P - A223', {
            fontSize: '20px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(480, 510, 'BSEMC - 2nd Year', {
            fontSize: '20px',
            fontFamily: 'Fatpix',
            fill: '#fde6ee',
            stroke: '#e17c80',
            strokeThickness: 5
        }).setOrigin(0.5);

        playButton.setInteractive().on('pointerdown', () => {
            this.tweens.add({
                targets: playButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                yoyo: true
            });
            this.scene.start('GameScene_Level1');
        });

        quitButton.setInteractive().on('pointerdown', () => {
            this.tweens.add({
                targets: quitButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                yoyo: true
            });
            alert('Exiting the game.');
        });

        this.addHoverEffect(playButton);
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

    shutdown() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }
}

export default MainMenuScene;
