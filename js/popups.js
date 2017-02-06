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
	Promotion.showInterstitial();
	Popup.clearAll();
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.FAILED, Dimensions.getFontSize()+10);
	var replay = addButton (text.y+text.height*3.5, LOCALE.REPLAY, Dimensions.getFontSize());
	var levels = addButton (replay.y+replay.height*1.3, LOCALE.LEVELS, Dimensions.getFontSize());
	
	text.anchor.set (0.5, 1);
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
    replay.onInputUp(function (){Popup.closeMenu("Game");});

    levels.inputEnabled = true;
    levels.onInputUp(function (){Popup.closeMenu("LevelsMenu");});

    Popup.gameOverWin = win;
}

Popup.openWinMenu = function () {
	Promotion.showInterstitial();
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
			share = addButton (text.y+text.height*1.3, LOCALE.SHARE, Dimensions.getFontSize());
			share.y += share.height*1.5;
			next = addButton (share.y+share.height*1.3, LOCALE.NEXT_LEVEL, Dimensions.getFontSize());
	    	share.onInputUp(Promotion.openShare);
	    	text.anchor.set (0.5, 0);
		} else {
			text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.COMPLETED, Dimensions.getFontSize()+10);
			next = addButton (text.y+text.height*3.5, LOCALE.NEXT_LEVEL, Dimensions.getFontSize());
			text.anchor.set (0.5, 1);
		}
		var replay = addButton (next.y+next.height*1.3, LOCALE.REPLAY, Dimensions.getFontSize());
		var levels = addButton (replay.y+replay.height*1.3, LOCALE.LEVELS, Dimensions.getFontSize());

		win.add(elements);
		elements.add(text);
		if (share) {
			elements.add(share);
		}
		elements.add(next);
		elements.add(replay);
		elements.add(levels);
		elements.y = (game.height-elements.height)/2;


	    next.onInputUp(function (){
	    	if (!win.closing) ++Game.aimLVL;
	     	Popup.closeMenu("Game");
	    });
	    replay.onInputUp(function (){Popup.closeMenu("Game");});
	    levels.onInputUp(function (){Popup.closeMenu("LevelsMenu");});
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
    	menu.events.onInputDown.add(function (){menu.alpha = 0.6;});
    	menu.events.onInputUp.add(function (){Popup.closeMenu("MainMenu");});
    	share.inputEnabled = true;
    	share.events.onInputDown.add(function (){share.alpha = 0.6;});
    	share.events.onInputUp.add(function () {Promotion.openShare(); share.alpha = 1;});
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

function addButton(y, text, fontSize, imageKey, length) {
	var game = Puzzle.game;
	imageKey = imageKey || "btn";
	length = length || 9;
	var button = game.add.group();
	var img = game.add.sprite (0, 0, Dimensions.getImageKey(imageKey));
	var text = game.add.bitmapText(0, 0, "black", text, fontSize);
	text.anchor.set (0.5,0.5);
	img.anchor.set (0.5,0.5);
	var w = img.width;
	img.scale.x = Math.min(fontSize*length/img.width, 1);
	img.scale.y = img.scale.x;
	button.add(img);
	button.add(text);
	button.x = game.width/2;
	button.y = y;
	img.inputEnabled = true;
	button.text = text;
	//img.alpha = 0;
  	img.events.onInputDown.add (function () { button.alpha = 0.6; });
  	img.events.onInputUp.add (function () { button.alpha = 1; button.onInputUpListener(); });
  	button.onInputUp = function(listener) { button.onInputUpListener = listener; };
	return button;
}

Popup.openOptMenu = function () {
	Promotion.showInterstitial();
	Popup.clearAll();
	var win = game.add.group();
	var elements = win.elements = game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var text = game.add.bitmapText(game.width/2, 0, "blue", LOCALE.PAUSED, Dimensions.getFontSize()+10);
	var cont = addButton (text.y+text.height*3.5, LOCALE.CONTINUE, Dimensions.getFontSize());
	var replay = addButton (cont.y+cont.height*1.3, LOCALE.REPLAY, Dimensions.getFontSize());
	var levels = addButton (replay.y+replay.height*1.3, LOCALE.LEVELS, Dimensions.getFontSize());
	
	text.anchor.set (0.5, 1);
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

    cont.onInputUp(function (){Popup.closeMenu();});
    replay.onInputUp(function (){Popup.closeMenu("Game");});
    levels.onInputUp(function (){Popup.closeMenu("LevelsMenu");});

    Popup.optWin = win;
}

Popup.openPropsMenu = function (_game, alpha) {
	Popup.game = _game = Puzzle.game;
	alpha = alpha || 0.9;
	Popup.clearAll();
	var win = _game.add.group();
	var elements = win.elements = _game.add.group();
	var back = win.back = win.create (0, 0, 'window');
	var music = _game.add.bitmapText(_game.width/2, 0, "blue", LOCALE.MUSIC, Dimensions.getFontSize());
	var toggle = addButton (music.y+music.height*3.5, LOCALE.MUSIC_OFF, Dimensions.getFontSize()-10, "short_btn", 5);
	toggle.state = Boombox.isMusic() ? "MUSIC_ON" : "MUSIC_OFF";
	toggle.text.setText (LOCALE[toggle.state]);
	var text = _game.add.bitmapText(_game.width/2, toggle.y+toggle.height * 2, "blue", LOCALE.LANGUAGE, Dimensions.getFontSize());
	var flag  = _game.add.sprite (_game.width/2, text.y + text.height * 3, Dimensions.getImageKey('flag'));
   	flag.scale.x = flag.scale.y = Math.min (Dimensions.getMinDimension()/4/flag.width, 1);
   	flag.frame = getLocales().indexOf(getLocale());
	var left = _game.add.sprite (text.x,flag.y+flag.height/2, Dimensions.getImageKey("btn_lang_arr"));
	var right = _game.add.sprite (text.x,flag.y+flag.height/2, Dimensions.getImageKey("btn_lang_arr"));
	left.scale.x = left.scale.y = flag.scale.x/1.5;
	right.scale.x = right.scale.y = left.scale.x;
	var ok = addButton (flag.y+flag.height + text.height * 2.5, LOCALE.OK, Dimensions.getFontSize()-10, "short_btn", 5);
    music.anchor.set (0.5, 0);
	text.anchor.set (0.5, 0);
	flag.anchor.set (0.5, 0);
	left.anchor.set (0, 0.5);
	right.anchor.set (0, 0.5);
	left.angle=-180;
	left.x -= Math.max(text.width/2, flag.width/2 + left.width/3);
	right.x += Math.max(text.width/2, flag.height/2 + right.width/3);
	win.add(elements);
	elements.add(toggle);
	elements.add(music);
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
    left.events.onInputUp.add(function () { left.alpha=1; changeLang (false);});
    left.events.onInputDown.add (function () { left.alpha=0.6; });
    right.inputEnabled = true;
    right.events.onInputUp.add(function () {right.alpha=1; changeLang (true);});
    right.events.onInputDown.add (function () { right.alpha=0.6; });
   	ok.onInputUp(function (){Popup.closeMenu();});
   	toggle.onInputUp(function (){ 
   		if (toggle.state == "MUSIC_ON") {
   			toggle.state = "MUSIC_OFF";
		} else {
			toggle.state="MUSIC_ON"
		}
		toggle.text.setText (LOCALE[toggle.state]);
		Boombox.toggleMusic();
	});

    function changeLang (side) {
    	var locales = getLocales();
    	var index = side ? 1 : locales.length-1;
       	setLocale(locales[(locales.indexOf(getLocale())+1*index)%locales.length]);
       	flag.frame = locales.indexOf(getLocale());
       	text.setText(LOCALE.LANGUAGE);
       	ok.text.setText(LOCALE.OK);
       	toggle.text.setText(LOCALE[toggle.state]);
       	music.setText(LOCALE.MUSIC);
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