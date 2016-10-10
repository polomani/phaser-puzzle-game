
Popup = function(){};

Popup.clearAll = function() {
	if (Popup.gameWinWin)
		Popup.gameWinWin.destroy();
	if (Popup.gameOverWin)
		Popup.gameOverWin.destroy();
	if (Popup.optWin)
		Popup.optWin.destroy();
	Popup.gameWinWin = Popup.gameOverWin = Popup.optWin = false;
}

Popup.openGameOverMenu = function () {
	Popup.clearAll();
	var size = (game.width < 500) ? 30 : 72;
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "white", "Failed", size+10);
	var replay = game.add.bitmapText(game.width/2, text.y+text.height*4, "white", "Replay", size);
	var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*3, "white", "Levels", size);
	var menu = game.add.bitmapText(game.width/2, levels.y+levels.height*3, "white", "Menu", size);
	replay.anchor.set (0.5, 1);
	text.anchor.set (0.5, 1);
	levels.anchor.set (0.5, 1);
	menu.anchor.set (0.5, 1);
	win.add(elements);
	elements.add(text);
	elements.add(replay);
	elements.add(menu);
	elements.add(levels);
	elements.y = (game.height-elements.height)/2;
	back.alpha = 0.9;
	win.realWidth = win.width;
	back.width = game.width;
	back.height = game.height;
	var tween = game.add.tween(win).from( { alpha:0 }, 500, Phaser.Easing.Exponential.In, true);

    replay.inputEnabled = true;
    replay.events.onInputDown.add(function (){Popup.closeMenu("Game");});

    levels.inputEnabled = true;
    levels.events.onInputDown.add(function (){Popup.closeMenu("LevelsMenu");});

    menu.inputEnabled = true;
    menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});

    Popup.gameOverWin = win;
}

Popup.openWinMenu = function () {
	Popup.clearAll();
	var size = (game.width < 500) ? 30 : 72;
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "white", "Got it", size+10);
	var next = game.add.bitmapText(game.width/2, text.y+text.height*4, "white", "Next level", size);
	var replay = game.add.bitmapText(game.width/2, next.y+next.height*3, "white", "Replay", size);
	var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*3, "white", "Levels", size);
	var menu = game.add.bitmapText(game.width/2, levels.y+levels.height*3, "white", "Menu", size);
	replay.anchor.set (0.5, 1);
	text.anchor.set (0.5, 1);
	next.anchor.set (0.5, 1);
	levels.anchor.set (0.5, 1);
	menu.anchor.set (0.5, 1);
	win.add(elements);
	elements.add(text);
	elements.add(next);
	elements.add(replay);
	elements.add(menu);
	elements.add(levels);
	elements.y = (game.height-elements.height)/2;
	back.alpha = 0.9;
	win.realWidth = win.width;
	back.width = game.width;
	back.height = game.height;
	var tween = game.add.tween(win).from( { alpha:0 }, 500, Phaser.Easing.Exponential.In, true);

	next.inputEnabled = true;
    next.events.onInputDown.add(function (){
    	Game.aimLVL = Math.min(Game.aimLVL+1, Data.completedLevels);
     	Popup.closeMenu("Game");
    });

	replay.inputEnabled = true;
    replay.events.onInputDown.add(function (){Popup.closeMenu("Game");});

    levels.inputEnabled = true;
    levels.events.onInputDown.add(function (){Popup.closeMenu("LevelsMenu");});

    menu.inputEnabled = true;
    menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});

    Popup.gameWinWin = win;
}

Popup.openOptMenu = function () {
	Popup.clearAll();
	var size = (game.width < 500) ? 30 : 72;
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "white", "Paused", size+10);
	var cont = game.add.bitmapText(game.width/2, text.y+text.height*4, "white", "Continue", size);
	var replay = game.add.bitmapText(game.width/2, cont.y+cont.height*3, "white", "Replay", size);
	var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*3, "white", "Levels", size);
	var menu = game.add.bitmapText(game.width/2, levels.y+levels.height*3, "white", "Menu", size);
	replay.anchor.set (0.5, 1);
	text.anchor.set (0.5, 1);
	cont.anchor.set (0.5, 1);
	levels.anchor.set (0.5, 1);
	menu.anchor.set (0.5, 1);
	win.add(elements);
	elements.add(text);
	elements.add(cont);
	elements.add(replay);
	elements.add(menu);
	elements.add(levels);
	elements.y = (game.height-elements.height)/2;
	back.alpha = 0.9;
	win.realWidth = win.width;
	back.width = game.width;
	back.height = game.height;
	var tween = game.add.tween(win).from( { alpha:0 }, 500, Phaser.Easing.Exponential.In, true);

	cont.inputEnabled = true;
    cont.events.onInputDown.add(function (){Popup.closeMenu();});

	replay.inputEnabled = true;
    replay.events.onInputDown.add(function (){Popup.closeMenu("Game");});

    levels.inputEnabled = true;
    levels.events.onInputDown.add(function (){Popup.closeMenu("LevelsMenu");});

    menu.inputEnabled = true;
    menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});

    Popup.optWin = win;
}

Popup.closeMenu = function (newState) {
	var win = Popup.gameWinWin || Popup.gameOverWin || Popup.optWin;
	if (win) {
		if (newState) {
			var tween = game.add.tween(win.back).to( { alpha:1 }, 300, Phaser.Easing.Exponential.Out, true);
			game.add.tween(win.elements).to( { alpha:0, x:0 }, 300, Phaser.Easing.Exponential.Out, true);
			tween.onComplete.add(function() { 
				//win.destroy(); 
				game.state.start(newState); 
				Popup.clearAll();
			});
		} else {
			var tween = game.add.tween(win).to( { alpha:0 }, 300, Phaser.Easing.Exponential.Out, true);
			tween.onComplete.add(function() { 
				win.destroy(); 
				Popup.clearAll();
			});
		}
	}
}