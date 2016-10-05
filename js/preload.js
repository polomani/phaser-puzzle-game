var Puzzle = Puzzle || {};

Puzzle.Preload = function(){};

Puzzle.Preload.prototype = {
	preload: function() {
		this.load.image('box_space', 'assets/images/box_space.png');
		this.load.image('box_black', 'assets/images/box_black.png');
		this.load.image('box_blue', 'assets/images/box_blue.png');
		this.load.image('box_gap', 'assets/images/box_gap.png');
		this.load.spritesheet('box_door', 'assets/images/box_door.png', 100, 100);
		this.load.image('box_arr', 'assets/images/box_arr.png');
		this.load.spritesheet('box_port', 'assets/images/box_port.png', 100, 100);
		this.load.image('box_red', 'assets/images/box_red.png');
		this.load.spritesheet('box_red_dir', 'assets/images/box_red_dir.png', 100, 100);
		this.load.image('window', 'assets/images/window.png');
		this.load.spritesheet('tutorial_0', 'assets/tutorial/tutorial_0.png', 228, 228);
		this.load.spritesheet('tutorial_2', 'assets/tutorial/tutorial_2.png', 228, 228);

		this.game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
	},
	create: function() {
		this.state.start('MainMenu');
	}
};