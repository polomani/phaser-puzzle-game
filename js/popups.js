Popup = function(){};

Popup.clearAll = function() {
	if (Popup.gameWinWin)
		Popup.gameWinWin.destroy();
	if (Popup.gameOverWin)
		Popup.gameOverWin.destroy();
	if (Popup.optWin)
		Popup.optWin.destroy();
	if (Popup.propsMenu)
		Popup.propsMenu.destroy();
	Popup.gameWinWin = Popup.gameOverWin = Popup.optWin = Popup.propsMenu = false;
}

Popup.anyWinOpened = function() {
	return Popup.gameWinWin || Popup.gameOverWin || Popup.optWin || Popup.propsMenu;
}

Popup.openGameOverMenu = function () {
	Popup.clearAll();
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.FAILED, Dimensions.getFontSize()+10);
	var replay = game.add.bitmapText(game.width/2, text.y+text.height*2.5, "white", LOCALE.REPLAY, Dimensions.getFontSize());
	var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*2.5, "white", LOCALE.LEVELS, Dimensions.getFontSize());
	var menu = game.add.bitmapText(game.width/2, levels.y+levels.height*2.5, "white", LOCALE.MENU, Dimensions.getFontSize());
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
	var tween = game.add.tween(win).from( { alpha:0 }, 300, Phaser.Easing.Exponential.In, true);
	tween.onComplete.add(function() { win.opened = true; });

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
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');

	if (Game.aimLVL<29) {
		var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.COMPLETED, Dimensions.getFontSize()+10);
		var next = game.add.bitmapText(game.width/2, text.y+text.height*2.5, "white", LOCALE.NEXT_LEVEL, Dimensions.getFontSize());
		var replay = game.add.bitmapText(game.width/2, next.y+next.height*2.5, "white", LOCALE.REPLAY, Dimensions.getFontSize());
		var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*2.5, "white", LOCALE.LEVELS, Dimensions.getFontSize());
		var menu = game.add.bitmapText(game.width/2, levels.y+levels.height*2.5, "white", LOCALE.MENU, Dimensions.getFontSize());
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
	} else {
		var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.END_GAME, Dimensions.getFontSize()+10);
		var text2 = game.add.bitmapText(game.width/2, 0, "white", "", Dimensions.getFontSize()-10);
		var wrapped = Helper.TextWrapper.wrapText(LOCALE.END_GAME_TEXT, game.width*0.9, game.height, 'white', text2.fontSize)[0];
		text2.setText(wrapped);
		text2.align = 'center';
		text2.y = text.y+text.height*3;
		var menu = game.add.bitmapText(game.width/2, text2.y+text.height*2, "blue", LOCALE.OK, Dimensions.getFontSize()-8);
		text.anchor.set (0.5, 1);
		text2.anchor.set (0.5, 1);
		menu.anchor.set (0.5, 1);
		menu.inputEnabled = true;
    	menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});
    	win.add(elements);
		elements.add(text);
		elements.add(text2);
		elements.add(menu);
		elements.y = (game.height-elements.height)/2;
	}

    back.alpha = 0.9;
	win.realWidth = win.width;
	back.width = game.width;
	back.height = game.height;
	var tween = game.add.tween(win).from( { alpha:0 }, 300, Phaser.Easing.Exponential.In, true);
	tween.onComplete.add(function() { win.opened = true; });

    Popup.gameWinWin = win;
}

Popup.openOptMenu = function () {
	Popup.clearAll();
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "blue", "Paused", Dimensions.getFontSize()+10);
	var cont = game.add.bitmapText(game.width/2, text.y+text.height*2.5, "white", LOCALE.CONTINUE, Dimensions.getFontSize());
	var replay = game.add.bitmapText(game.width/2, cont.y+cont.height*2.5, "white", LOCALE.REPLAY, Dimensions.getFontSize());
	var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*2.5, "white", LOCALE.LEVELS, Dimensions.getFontSize());
	var menu = game.add.bitmapText(game.width/2, levels.y+levels.height*2.5, "white", LOCALE.MENU, Dimensions.getFontSize());
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
	var tween = game.add.tween(win).from( { alpha:0 }, 300, Phaser.Easing.Exponential.In, true);
	tween.onComplete.add(function() { win.opened = true; });

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

Popup.openPropsMenu = function (_game, alpha) {
	Popup.game = _game = game || _game;
	alpha = alpha || 0.9;
	Popup.clearAll();
	var win = _game.add.group();
	var elements = win.elements = _game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = _game.add.bitmapText(_game.width/2, 0, "blue", LOCALE.LANGUAGE, Dimensions.getFontSize());
	var flag  = _game.add.sprite (_game.width/2, text.height+50, "flag");
   	flag.scale.x = flag.scale.y = Math.min (Dimensions.getMinDimension()/4/flag.width, 1);
   	flag.frame = getLocales().indexOf(getLocale());
	var left = _game.add.sprite (text.x-flag.width/2-45,flag.y+flag.height/2, 'btn_lang_arr');
	var right = _game.add.sprite (flag.x+flag.width/2+45,flag.y+flag.height/2, 'btn_lang_arr');
	left.scale.x = left.scale.y = flag.scale.x/2.5;
	right.scale.x = right.scale.y = left.scale.x;
	left.x-=left.width/2;
	var ok = _game.add.bitmapText(_game.width/2, flag.y+flag.height+35, "white", LOCALE.OK, Dimensions.getFontSize()-10);
    ok.anchor.set (0.5, 0);
	text.anchor.set (0.5, 0);
	flag.anchor.set (0.5, 0);
	left.anchor.set (0.5, 0.5);
	right.anchor.set (0, 0.5);
	left.angle=-180;
	win.add(elements);
	elements.add(text);
	elements.add(flag);
	elements.add(left);
	elements.add(right);
	elements.add(ok);
	elements.y = (_game.height-elements.height)/3;
	back.alpha = alpha;
	win.realWidth = win.width;
	back.width = _game.width;
	back.height = _game.height;
	var tween = _game.add.tween(win).from( { alpha:0 }, 300, Phaser.Easing.Exponential.In, true);
	tween.onComplete.add(function() { win.opened = true; });

	left.inputEnabled = true;
    left.events.onInputDown.add(function () {changeLang (false);});
    right.inputEnabled = true;
    right.events.onInputDown.add(function () {changeLang (true);});
    ok.inputEnabled = true;
   	ok.events.onInputDown.add(function (){Popup.closeMenu();});

    function changeLang (side) {
    	var locales = getLocales();
    	var index = side ? 1 : locales.length-1;
       	setLocale(locales[(locales.indexOf(getLocale())+1*index)%locales.length]);
       	flag.frame = locales.indexOf(getLocale());
       	text.setText(LOCALE.LANGUAGE);
       	ok.setText(LOCALE.OK);
       	Tutorial.changeLocale();
       	if (_game) _game.changeLocale();
    }

    Popup.propsMenu = win;
}

Popup.closeMenu = function (newState) {
	var _game = game || Popup.game;
	var win = Popup.anyWinOpened();
	if (win && win.opened) {
		if (newState) {
			var tween = _game.add.tween(win.back).to( { alpha:1 }, 300, Phaser.Easing.Exponential.Out, true);
			_game.add.tween(win.elements).to( { alpha:0, x:0 }, 300, Phaser.Easing.Exponential.Out, true);
			tween.onComplete.add(function() { 
				_game.state.start(newState); 
				Popup.clearAll();
			});
		} else {
			var tween = _game.add.tween(win).to( { alpha:0 }, 300, Phaser.Easing.Exponential.Out, true);
			tween.onComplete.add(function() { 
				win.destroy(); 
				Popup.clearAll();
			});
		}
	}
}