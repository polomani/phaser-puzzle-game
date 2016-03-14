
Popup = function(){};

Popup.resize = function() {
	if (Popup.gameWinWin)
		resize(Popup.gameWinWin);
	if (Popup.gameOverWin)
		resize(Popup.gameOverWin);

	function resize (win) {
		var scale = Math.min(win.realWidth, game.width*0.80) / win.realWidth;
		win.scale.setTo(scale, scale);
		win.x = game.width/2-win.width/2;
		win.y = game.height/2-win.height/2;
	} 
}

Popup.clearAll = function() {
	Popup.gameWinWin = Popup.gameOverWin = false;
}

Popup.openGameOverMenu = function () {
	var win = game.add.group();
	win.create (0, 0, 'window');
	var text = game.add.text(0,0,'Sorry, but not this time.', { font: '36px Arial', fill: '#0', wordWrap: true, wordWrapWidth: win.width});
	var replay = game.add.text(0,0,'Replay', { font: '30px Arial', fill: '#0' });
	var levels = game.add.text(0,0,'Levels', { font: '30px Arial', fill: '#0' });
	var menu = game.add.text(0,0,'Menu', { font: '30px Arial', fill: '#0' });
	replay.anchor.set (0.5, 0);
	text.anchor.set (0.5, 0.5);
	text.x = win.width/2;
	text.y = win.height/2;
	levels.y = replay.y = menu.y = win.height - replay.height;
	replay.x = win.width/2;
	menu.x = win.width - menu.width;
	win.add(text);
	win.add(replay);
	win.add(menu);
	win.add(levels);
	win.realWidth = win.width;
	var scale = Math.min(win.width, game.width*0.80) / win.width;
	win.scale.setTo(scale, scale);
	win.x = game.width/2-win.width/2;
	win.y = game.height/2-win.height/2;
	var tween = game.add.tween(win).from( { alpha:0, y: -win.height }, 500, Phaser.Easing.Exponential.In, true);

    replay.inputEnabled = true;
    replay.events.onInputDown.add(function (){Popup.closeMenu("Game");});

    levels.inputEnabled = true;
    levels.events.onInputDown.add(function (){Popup.closeMenu("LevelsMenu");});

    menu.inputEnabled = true;
    menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});

    Popup.gameOverWin = win;
}

Popup.openWinMenu = function () {
	var win = game.add.group();
	win.create (0, 0, 'window');
	var text = game.add.text(0,0,"Well done!\n  [✭[✭]✭]", {font: '36px Arial', fill: '#0', wordWrap: true, wordWrapWidth: win.width});
		text.text.align = 'center';
	var replay = game.add.text(0,0,'Replay', { font: '30px Arial', fill: '#0' });
	var contin = game.add.text(0,0,'Continue', { font: '30px Arial', fill: '#0' });
	var levels = game.add.text(0,0,'Levels', { font: '30px Arial', fill: '#0' });
	var menu = game.add.text(0,0,'Menu', { font: '30px Arial', fill: '#0' });
	text.anchor.set (0.5, 0.5);
	text.x = win.width/2;
	text.y = win.height/2;
	levels.y = replay.y = menu.y = contin.y = win.height - replay.height;
	replay.x = levels.width + 10;
	contin.x = replay.x + replay.width + 10;
	menu.x = win.width - menu.width;
	win.add(text);
	win.add(replay);
	win.add(menu);
	win.add(levels);
	win.add(contin);
	win.realWidth = win.width;
	var scale = Math.min(win.width, game.width*0.80) / win.width;
	win.scale.setTo(scale, scale);
	win.x = game.width/2-win.width/2;
	win.y = game.height/2-win.height/2;
	var tween = game.add.tween(win).from( { alpha:0, y: -win.height }, 500, Phaser.Easing.Exponential.In, true);

	contin.inputEnabled = true;
    contin.events.onInputDown.add(function (){Editor.aimLVL++; Popup.closeMenu("Game");});

	replay.inputEnabled = true;
    replay.events.onInputDown.add(function (){Popup.closeMenu("Game");});

    levels.inputEnabled = true;
    levels.events.onInputDown.add(function (){Popup.closeMenu("LevelsMenu");});

    menu.inputEnabled = true;
    menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});

    Popup.gameWinWin = win;
}

Popup.closeMenu = function (newState) {
	var win = Popup.gameWinWin || Popup.gameOverWin;
	var tween = game.add.tween(win).to( { alpha:0, y: game.height }, 300, Phaser.Easing.Exponential.Out, true);
	tween.onComplete.add(function() { 
		win.destroy(); 
		game.state.start(newState); 
		Popup.gameWinWin = Popup.gameOverWin = false;
	});
}