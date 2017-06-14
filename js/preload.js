var Puzzle = Puzzle || {};

Puzzle.Preload = function(){};

Puzzle.Preload.prototype = {
	preload: function() {
		this.game.bar = this.game.add.bitmapText(this.game.width/2, this.game.height/2, "blue", "0%", Dimensions.getFontSize());
		this.game.bar.anchor.set (0.5, 0.5);
		this.load.onFileComplete.add(this.progress, this);
		this.load.spritesheet('flag_large', 'assets/images/flag_large.png', 400, 400);
		this.load.spritesheet('flag_small', 'assets/images/flag_small.png', 200, 200);
        this.load.image('replay_icon', 'assets/images/replay_icon.png');
        this.load.image('hints_icon', 'assets/images/hints_icon.png');
        this.load.image('undo_icon', 'assets/images/undo_icon.png');
        this.load.image('lvls_icon', 'assets/images/lvls_icon.png');
		this.load.image('btn_next_large', 'assets/images/button_next_large.png');
		this.load.image('btn_next_small', 'assets/images/button_next_small.png');
		this.load.image('btn_lang_arr_small', 'assets/images/lang_arrow_small.png');
		this.load.image('btn_lang_arr_large', 'assets/images/lang_arrow_large.png');
		this.load.spritesheet('btn_play_small', 'assets/images/play_small.png', 249, 69);
		this.load.spritesheet('btn_play_large', 'assets/images/play_large.png', 500, 139);
		this.load.image('btn_pause_small', 'assets/images/pause_small.png');
		this.load.image('btn_pause_large', 'assets/images/pause_large.png');
		this.load.image('btn_props_small', 'assets/images/prop_icon_small.png');
		this.load.image('btn_props_large', 'assets/images/prop_icon_large.png');
		this.load.image('logo_small', 'assets/images/logo_small.png');
		this.load.image('logo_large', 'assets/images/logo_large.png');
		this.load.image('box_black_small', 'assets/images/box_black_small.png');
		this.load.spritesheet('box_blue_small', 'assets/images/box_blue_small.png', 100, 100);
        this.load.spritesheet('box_blue_large', 'assets/images/box_blue_large.png', 200, 200);
		this.load.image('box_gap_small', 'assets/images/box_gap_small.png');
		this.load.image('box_black_large', 'assets/images/box_black_large.png');
		this.load.image('box_gap_large', 'assets/images/box_gap_large.png');
		this.load.spritesheet('box_door', 'assets/images/box_door.png', 100, 100);
		this.load.spritesheet('box_arr_small', 'assets/images/box_arr_small.png', 100, 100);
		this.load.spritesheet('box_arr_large', 'assets/images/box_arr_large.png', 200, 200);
		this.load.spritesheet('box_port_small', 'assets/images/box_port_small.png', 100, 100);
        this.load.spritesheet('box_port_large', 'assets/images/box_port_large.png', 200, 200);
		this.load.image('box_red', 'assets/images/box_red.png');
		this.load.spritesheet('box_red_dir', 'assets/images/box_red_dir.png', 100, 100);
        this.load.image('box_robo_small', 'assets/images/robo_small.png');
        this.load.image('box_robo_large', 'assets/images/robo_large.png');
		this.load.spritesheet('box_sokoban_small', 'assets/images/box_sokoban_small.png', 100, 100);
        this.load.spritesheet('box_sokoban_large', 'assets/images/box_sokoban_large.png', 200, 200);
		this.load.image('window', 'assets/images/window.png');
		this.load.image('sensei_small', 'assets/images/sensei_small.png');
		this.load.image('sensei_large', 'assets/images/sensei_large.png');
		this.load.image('btn_small', 'assets/images/btn_small.png');
		this.load.image('btn_large', 'assets/images/btn_large.png');
		this.load.image('short_btn_small', 'assets/images/short_btn_small.png');
		this.load.image('short_btn_large', 'assets/images/short_btn_large.png');
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
				document.addEventListener("backbutton", onBackKeyDown, false);
				function onBackKeyDown() {
				    switch (Puzzle.game.state.current)  {
				    	case "Game":
					    	switch (Popup.anyWinOpened()) {
					    		case Popup.optWin:
					    		case Popup.propsMenu:
					    			Popup.closeMenu ();
					    		break;
					    		case Popup.gameWinWin:
					    			Popup.closeMenu ("Game");
					    		break;
					    		case Popup.gameOverWin:
					    			Popup.closeMenu ("Game");
					    		break;
					    	}
					    	if (!Popup.anyWinOpened()) {
					    		Popup.openOptMenu();
					    	}
					    	break;
					    case "LevelsMenu":
					    	Puzzle.game.state.start ("MainMenu");
					    break;
				    	default:
				    		navigator.app.exitApp();
				    	break;
			      	}
				}
			});
		} else {
			Data.load();
		}
	},
	progress: function() {
		this.game.bar.setText(this.load.progress+'%');
	}
};