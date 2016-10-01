
var Puzzle = Puzzle || {};
var Editor = {};
var Game = {};

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
		Game.aimLVL = $( "#lSelect option:selected" ).attr("value");
		if (Game.aimLVL == LEVELS.length) {
			LEVELS[Game.aimLVL] = [[0]];
			updateList();
		}
		Puzzle.game.state.restart();
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