import MainMenuScene from './scenes/menuScene.js';
import GameScene_Tutorial from './scenes/gameScene-Tutorial.js';
import GameOverScene1 from './scenes/gameOverScene1.js';
import WinScene1 from './scenes/winScene1.js';
import GameScene_Level1 from './scenes/gameScene-Level1.js';
import GameOverScene2 from './scenes/gameOverScene2.js';
import WinScene2 from './scenes/winScene2.js';
import GameScene_Level2 from './scenes/gameScene-Level2.js';
import GameOverScene3 from './scenes/gameOverScene3.js';
import WinScene3 from './scenes/winScene3.js';


let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    pixelArt: true,   
    scene: [MainMenuScene, GameScene_Tutorial, GameOverScene1, WinScene1, GameScene_Level1, GameOverScene2, WinScene2, GameScene_Level2, GameOverScene3, WinScene3],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 370 },
            debug: false
        }
    }
};

// Initializes the Game
let game = new Phaser.Game(config);

export default game;
