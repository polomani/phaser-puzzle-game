var Puzzle = Puzzle || {};

Puzzle.Preload = function(){};

Puzzle.Preload.prototype = {
	preload: function() {
		this.load.image('box_black', 'assets/images/box_black.png');
		this.load.image('box_blue', 'assets/images/box_blue.png');
		this.load.image('box_gap', 'assets/images/box_gap.png');
		this.load.spritesheet('box_door', 'assets/images/box_door.png', 50, 50);
		this.load.image('box_arr', 'assets/images/box_arr.png');
		this.load.spritesheet('box_port', 'assets/images/box_port.png', 50, 50);
		this.load.image('box_red', 'assets/images/box_red.png');
		this.load.spritesheet('box_red_dir', 'assets/images/box_red_dir.png', 50, 50);
	},
	create: function() {
		this.state.start('MainMenu');
	}
};