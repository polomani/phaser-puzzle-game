
var Puzzle = Puzzle || {};
var Editor = {};
var Game = {
	aimLVL: 10
};

//Puzzle.game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '');
Puzzle.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, '', null, false, false);

Puzzle.game.state.add('Boot', Puzzle.Boot);
Puzzle.game.state.add('Preload', Puzzle.Preload);
Puzzle.game.state.add('MainMenu', Puzzle.MainMenu);
Puzzle.game.state.add('LevelsMenu', Puzzle.LevelsMenu);
Puzzle.game.state.add('Game', Puzzle.Game);
Puzzle.game.state.add('Editor', Puzzle.Editor);

Puzzle.game.state.start('Boot');

$(document).ready (function () {
	Game.aimLVL = 0;

    updateList();

	$("#lSelect").on ("change", function() {
		Popup.clearAll();
		Game.aimLVL = $( "#lSelect option:selected" ).attr("value");
		if (Game.aimLVL == LEVELS.length) {
			LEVELS[Game.aimLVL] = [[0]];
			updateList();
		}
		Puzzle.game.state.start("Game");
	});

	function updateList () {
		var html = '';
		for (var i = 0; i < LEVELS.length; ++i) {
			html += '<option value="'+i+'">level '+(i+1)+'</option>';
		}
		html += '<option value="'+LEVELS.length+'"> [new level] </option>';
		$("#lSelect").html(html);
	}
});

(function (exports) {
	var game = Puzzle.game;

	exports.getSize = function () {
		if (Math.min(game.width, game.height)<400) {
			return "xsmall";
		}
		if (Math.min(game.width, game.height)<800) {
			return "small";
		}
		if (Math.min(game.width, game.height)<1200) {
			return "large";
		}
		return "xlarge";
	}

	exports.getImageKey = function(key) {
		var size = exports.getSize();
		if (size == "xsmall")
			size = "small";
		if (size == "xlarge")
			size = "large";
		var sizeKey =  key + "_" + size;
		if (game.cache.checkImageKey(sizeKey))
			return sizeKey;
		return key;
	}

	exports.getBoxSize = function () {
		return game.cache.getImage(exports.getImageKey("box_blue")).height;
	}

	exports.getFontSize = function () {
		var size = exports.getSize();
		if (size == "xsmall")
			return 24;
		if (size == "small")
			return 40;
		if (size == "large")
			return 74;
		return 82;
	}

	exports.getHintFontSize = function () {
		var size = exports.getSize();
		if (size == "xsmall")
			return 16;
		if (size == "small")
			return 28;
		if (size == "large")
			return 52;
		return 74;
	}

	exports.getMinDimension = function () {
		return Math.min(game.width, game.height);
	}
})(window.Dimensions = {});