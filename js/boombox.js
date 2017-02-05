(function (exports) {

	var ambient;

	exports.init = function() {
		ambient = Puzzle.game.add.audio('ambient');
		ambient.loop = true;
		if (exports.isMusic()) ambient.play();
	}

	exports.isMusic = function () {
		return (Data.music == 1);
	}

	exports.toggleMusic = function () {
		Data.toggleMusic();
		if (exports.isMusic()) 
			ambient.play();
		else
			ambient.pause();
	}
})(window.Boombox={});