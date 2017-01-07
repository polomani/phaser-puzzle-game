var Puzzle = Puzzle || {};

Puzzle.Preload = function(){};

Puzzle.Preload.prototype = {
	preload: function() {
		this.game.bar = this.game.add.bitmapText(this.game.width/2, this.game.height/2, "blue", "0%", Dimensions.getFontSize());
		this.game.bar.anchor.set (0.5, 0.5);
		this.load.onFileComplete.add(this.progress, this);
		this.load.spritesheet('flag_large', 'assets/images/flag_large.png', 400, 400);
		this.load.spritesheet('flag_small', 'assets/images/flag_small.png', 200, 200);
		this.load.image('btn_next', 'assets/images/button_next_large.png');
		this.load.image('btn_lang_arr_small', 'assets/images/lang_arrow_small.png');
		this.load.image('btn_lang_arr_large', 'assets/images/lang_arrow_large.png');
		this.load.spritesheet('btn_play', 'assets/images/play.png', 348, 98);
		this.load.image('btn_pause', 'assets/images/pause.png');
		this.load.image('btn_props', 'assets/images/prop_icon.png');
		this.load.image('logo_small', 'assets/images/logo_small.png');
		this.load.image('logo_large', 'assets/images/logo_large.png');
		this.load.image('box_black_small', 'assets/images/box_black_small.png');
		this.load.spritesheet('box_blue_small', 'assets/images/box_blue_small.png', 100, 100);
		this.load.image('box_gap_small', 'assets/images/box_gap_small.png');
		this.load.image('box_black_large', 'assets/images/box_black_large.png');
		this.load.spritesheet('box_blue_large', 'assets/images/box_blue_large.png', 200, 200);
		this.load.image('box_gap_large', 'assets/images/box_gap_large.png');
		this.load.spritesheet('box_door', 'assets/images/box_door.png', 100, 100);
		this.load.image('box_arr_small', 'assets/images/box_arr_small.png');
		this.load.image('box_arr_large', 'assets/images/box_arr_large.png');
		this.load.spritesheet('box_port', 'assets/images/box_port.png', 100, 100);
		this.load.image('box_red', 'assets/images/box_red.png');
		this.load.spritesheet('box_red_dir', 'assets/images/box_red_dir.png', 100, 100);
		this.load.image('window', 'assets/images/window.png');
		this.load.spritesheet('tutorial_0', 'assets/tutorial/tutorial_0.png', 228, 228);
		this.load.spritesheet('tutorial_2', 'assets/tutorial/tutorial_2.png', 228, 228);

		this.game.load.bitmapFont('white', 'assets/fonts/white.png', 'assets/fonts/white.fnt');
		this.game.load.bitmapFont('black', 'assets/fonts/black.png', 'assets/fonts/black.fnt');
	},
	create: function() {
		Data.load();
		Puzzle.game.state.start('MainMenu');
	},
	progress: function() {
		this.game.bar.setText(this.load.progress+'%');
	}
};