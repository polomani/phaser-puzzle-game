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
	
	replay.anchor.set (0.5, 1);
	text.anchor.set (0.5, 1);
	levels.anchor.set (0.5, 1);
	win.add(elements);
	elements.add(text);
	elements.add(replay);
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

    Popup.gameOverWin = win;
}

Popup.openWinMenu = function () {
	Popup.clearAll();
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');

	if (Game.aimLVL<44) {
		var text;
		var next;
		var share;
		if (Game.aimLVL == 14 || Game.aimLVL == 24 || Game.aimLVL == 34) {
			text = game.add.bitmapText(game.width/2, 0, "blue", "", Dimensions.getFontSize()-10);
			text.align = 'center';
			var wrapped = Helper.TextWrapper.wrapText(LOCALE.ASK_SHARE.replace("%", Game.aimLVL+1), game.width*0.9, game.height, 'blue', text.fontSize)[0];
			text.setText(wrapped);
			share = game.add.bitmapText(game.width/2, text.y+text.height, "white", LOCALE.SHARE, Dimensions.getFontSize());
			share.y += share.height*1.5;
			next = game.add.bitmapText(game.width/2, share.y+share.height*2.5, "white", LOCALE.NEXT_LEVEL, Dimensions.getFontSize());
			share.inputEnabled = true;
	    	share.events.onInputDown.add(Promotion.openShare);
		} else {
			text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.COMPLETED, Dimensions.getFontSize()+10);
			next = game.add.bitmapText(game.width/2, text.y+text.height*2.5, "white", LOCALE.NEXT_LEVEL, Dimensions.getFontSize());
		}
		var replay = game.add.bitmapText(game.width/2, next.y+next.height*2.5, "white", LOCALE.REPLAY, Dimensions.getFontSize());
		var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*2.5, "white", LOCALE.LEVELS, Dimensions.getFontSize());
		
		replay.anchor.set (0.5, 0);
		text.anchor.set (0.5, 0);
		next.anchor.set (0.5, 0);
		levels.anchor.set (0.5, 0);
		win.add(elements);
		elements.add(text);
		if (share) {
			share.anchor.set (0.5, 0);
			elements.add(share);
		}
		elements.add(next);
		elements.add(replay);
		elements.add(levels);
		elements.y = (game.height-elements.height)/2;

		next.inputEnabled = true;
	    next.events.onInputDown.add(function (){
	    	if (!win.closing) ++Game.aimLVL;
	     	Popup.closeMenu("Game");
	    });

		replay.inputEnabled = true;
	    replay.events.onInputDown.add(function (){Popup.closeMenu("Game");});

	    levels.inputEnabled = true;
	    levels.events.onInputDown.add(function (){Popup.closeMenu("LevelsMenu");});
	} else {
		var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.END_GAME, Dimensions.getFontSize()+10);
		var text2 = game.add.bitmapText(game.width/2, 0, "white", "", Dimensions.getFontSize()-10);
		var wrapped = Helper.TextWrapper.wrapText(LOCALE.END_GAME_TEXT, game.width*0.9, game.height, 'white', text2.fontSize)[0];
		text2.setText(wrapped);
		text2.align = 'center';
		text2.y = text.y+text.height*3;
		var menu = game.add.bitmapText(0, text2.y+text2.height*1.7, "blue", LOCALE.OK, Dimensions.getFontSize()-8);
		var share = game.add.bitmapText(menu.x+menu.width*1.3, text2.y+text2.height*1.7, "blue", LOCALE.SHARE, Dimensions.getFontSize()-8);
		text.anchor.set (0.5, 0);
		text2.anchor.set (0.5, 0);
		menu.anchor.set (0, 0);
		share.anchor.set (0, 0);
		menu.inputEnabled = true;
    	menu.events.onInputDown.add(function (){Popup.closeMenu("MainMenu");});
    	share.inputEnabled = true;
    	share.events.onInputDown.add(Promotion.openShare);
    	var buttons = game.add.group();
    	win.add(elements);
		elements.add(text);
		elements.add(text2);
		elements.add(buttons);
		buttons.add(menu);
		buttons.add(share);
		buttons.x = (game.width-buttons.width)/2;
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
	var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.PAUSED, Dimensions.getFontSize()+10);
	var cont = game.add.bitmapText(game.width/2, text.y+text.height*2.5, "white", LOCALE.CONTINUE, Dimensions.getFontSize());
	var replay = game.add.bitmapText(game.width/2, cont.y+cont.height*2.5, "white", LOCALE.REPLAY, Dimensions.getFontSize());
	var levels = game.add.bitmapText(game.width/2, replay.y+replay.height*2.5, "white", LOCALE.LEVELS, Dimensions.getFontSize());
	
	replay.anchor.set (0.5, 1);
	text.anchor.set (0.5, 1);
	cont.anchor.set (0.5, 1);
	levels.anchor.set (0.5, 1);
	win.add(elements);
	elements.add(text);
	elements.add(cont);
	elements.add(replay);
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
	var flag  = _game.add.sprite (_game.width/2, text.y + text.height + Dimensions.getMinDimension()/6, Dimensions.getImageKey('flag'));
   	flag.scale.x = flag.scale.y = Math.min (Dimensions.getMinDimension()/4/flag.width, 1);
   	flag.frame = getLocales().indexOf(getLocale());
	var left = _game.add.sprite (text.x,flag.y+flag.height/2, Dimensions.getImageKey("btn_lang_arr"));
	var right = _game.add.sprite (text.x,flag.y+flag.height/2, Dimensions.getImageKey("btn_lang_arr"));
	left.scale.x = left.scale.y = flag.scale.x/1.5;
	right.scale.x = right.scale.y = left.scale.x;
	var ok = _game.add.bitmapText(_game.width/2, flag.y+flag.height+Dimensions.getMinDimension()/6, "white", LOCALE.OK, Dimensions.getFontSize()-10);
    ok.anchor.set (0.5, 0);
	text.anchor.set (0.5, 0);
	flag.anchor.set (0.5, 0);
	left.anchor.set (0, 0.5);
	right.anchor.set (0, 0.5);
	left.angle=-180;
	left.x -= Math.max(text.width/2, flag.width/2 + left.width/3);
	right.x += Math.max(text.width/2, flag.height/2 + right.width/3);
	win.add(elements);
	elements.add(text);
	elements.add(flag);
	elements.add(left);
	elements.add(right);
	elements.add(ok);
	elements.y = (_game.height-elements.height)/2;
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
   	ok.events.onInputDown.add(function (){ Popup.closeMenu(); });

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
	if (win && win.opened && !win.closing) {
		win.closing = true;
		Promotion.showInterstitial();
		if (newState) {
			var tween = _game.add.tween(win.back).to( { alpha:1 }, 300, Phaser.Easing.Exponential.Out, true);
			_game.add.tween(win.elements).to( { alpha:0, x:0 }, 300, Phaser.Easing.Exponential.Out, true);
			Tutorial.invise();
			_game.boxes.visible = false;
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