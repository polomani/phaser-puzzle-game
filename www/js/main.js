var Puzzle = Puzzle || {};
var Editor = {};
var Game = {
	aimLVL: 1
};

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("DOMContentLoaded", onDeviceReady, false);

function onDeviceReady() {
	var w = window.innerWidth * window.devicePixelRatio,
		h = window.innerHeight * window.devicePixelRatio,
		width = (h > w) ? h : w,
		height = (h > w) ? w : h;
	if (window.innerWidth >= 1024 && window.devicePixelRatio >= 2){
		width = Math.round(width / 2);
		height = Math.round(height / 2);
	}
	if (window.devicePixelRatio === 3){
		width = Math.round(width / 3) * 2;
		height = Math.round(height / 3) * 2;
	}

	console.log('device ready');
	//Puzzle.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, '', null, false, false);
	Puzzle.game = new Phaser.Game(width, height, Phaser.CANVAS, '', null, false, false);

	Puzzle.game.state.add('Boot', Puzzle.Boot);
	Puzzle.game.state.add('Preload', Puzzle.Preload);
	Puzzle.game.state.add('MainMenu', Puzzle.MainMenu);
	Puzzle.game.state.add('LevelsMenu', Puzzle.LevelsMenu);
	Puzzle.game.state.add('Game', Puzzle.Game);
	Puzzle.game.state.add('Editor', Puzzle.Editor);

	Puzzle.game.state.start('Boot');
}