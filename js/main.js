
var Puzzle = Puzzle || {};
var Editor = {};
var Game = {};

var width = screen.height = window.innerWidth;// = 800;
var height = screen.width = window.innerHeight;// = 600;
var screenRatio;
var gWidth;
var gHeight;
if(width>height){
	gWidth = width;
	gHeight = height;
	screenRatio = (height / width);
}
else {
	gWidth = height;
	gHeight = width;
	screenRatio = (width / height);
}
if(isNaN(screenRatio))
{
	if(window.innerHeight > window.innerWidth)
	{
		gWidth = window.innerHeight;
		gHeight = window.innerWidth;
		screenRatio = (window.innerWidth / window.innerHeight); 
	}
	else
	{ 
		gWidth = window.innerWidth;
		gHeight = window.innerHeight;
		screenRatio = (window.innerHeight / window.innerWidth);
	}
}

Puzzle.game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '');

Puzzle.game.state.add('Boot', Puzzle.Boot);
Puzzle.game.state.add('Preload', Puzzle.Preload);
Puzzle.game.state.add('MainMenu', Puzzle.MainMenu);
Puzzle.game.state.add('Game', Puzzle.Game);
Puzzle.game.state.add('Editor', Puzzle.Editor);

Puzzle.game.state.start('Boot');

$(document).ready (function () {
	//Editor.aimLVL = LEVELS.length - 1;
	Editor.aimLVL = 0;

    updateList();

	$("#lSelect").click (function() {
		Editor.aimLVL = $( "#lSelect option:selected" ).attr("value");
		if (Editor.aimLVL == LEVELS.length) {
			LEVELS[Editor.aimLVL] = [[0]];
			updateList();
		}
		Puzzle.game.state.restart();
	});

	function updateList () {
		var html = '';
		for (var i = 0; i < LEVELS.length; ++i) {
			html += '<option value="'+i+'">level '+i+'</option>';
		}
		html += '<option value="'+LEVELS.length+'"> [new level] </option>';
		$("#lSelect").html(html);
	}
});