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
		this.load.spritesheet('btn_play_small', 'assets/images/play_small.png', 249, 69);
		this.load.spritesheet('btn_play_large', 'assets/images/play_large.png', 500, 139);
		this.load.image('btn_pause_small', 'assets/images/pause_small.png');
		this.load.image('btn_pause_large', 'assets/images/pause_large.png');
		this.load.image('btn_props_small', 'assets/images/prop_icon_small.png');
		this.load.image('btn_props_large', 'assets/images/prop_icon_large.png');
		this.load.image('btn_replay_small', 'assets/images/replay_small.png');
		this.load.image('btn_replay_large', 'assets/images/replay_large.png');
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
		this.load.image('sensei_small', 'assets/images/sensei_small.png');
		this.load.image('sensei_large', 'assets/images/sensei_large.png');
		this.load.text('share', 'assets/images/share.txt');


		this.load.image('tutorial_0_small', 'assets/tutorial/tutorial_0_small.png');
		this.load.image('tutorial_0_large', 'assets/tutorial/tutorial_0_large.png');
		this.load.spritesheet('tutorial_1', 'assets/tutorial/tutorial_1.png', 162, 162);
		this.load.spritesheet('tutorial_3', 'assets/tutorial/tutorial_3.png', 162, 162, 57);
		this.load.spritesheet('tutorial_4', 'assets/tutorial/tutorial_4.png', 162, 162);
		this.load.spritesheet('tutorial_5', 'assets/tutorial/tutorial_5.png', 162, 162, 49);

		this.game.load.bitmapFont('white', 'assets/fonts/white.png', 'assets/fonts/white.fnt');
		this.game.load.bitmapFont('black', 'assets/fonts/black.png', 'assets/fonts/black.fnt');
	},
	create: function() {
		if (window.cordova) {
			document.addEventListener('deviceready', function() {
				Data.load();
			});
		} else {
			Data.load();
		}
	},
	progress: function() {
		this.game.bar.setText(this.load.progress+'%');
	}
};