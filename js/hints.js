Tutorial = function(){};

Tutorial.resize = function(data) {
	if (data && Tutorial.image) {
		var maxDimension = Tutorial.image.realWidth;
		if (Tutorial.level!=0) maxDimension *= 1.5;
		Tutorial.image.width = 
		Tutorial.image.height = Math.round(Math.min (Dimensions.getMinDimension()/4, maxDimension));
		Tutorial.image.x = game.width/2;
		Tutorial.image.y = Math.max(data.bbounds.y/2, Tutorial.image.height/2);
	}
	if (Tutorial.text) {
		Tutorial.text.x = game.width/2;
		Tutorial.text.y = game.height-Tutorial.text.height-20;
	}
}

Tutorial.open = function (level) {
	Tutorial.level = level;
	var key = Dimensions.getImageKey('tutorial_'+level);
	if (game.cache.checkImageKey(key)) {
		var animation = game.add.sprite(game.width-228/2, 0, key);
	    animation.animations.add('play');
	    animation.anchor.set (0.5, 0.5);
	    animation.animations.play('play', 30, true);
	    animation.realWidth=animation.width;
	    animation.realHeight=animation.height;

	    Tutorial.image=animation;
	}

	if (LOCALE["TUTORIAL_"+level]) {
	    var text = game.add.bitmapText(0, 0, "blue", "", Dimensions.getFontSize()-8); 
	    text.anchor.set (0.5, 0);
		text.align = 'center';
		Tutorial.text = text;
		Tutorial.changeLocale ();
	}
}

Tutorial.clean = function (level) {
	Tutorial.image = null;
	Tutorial.text = null;
	Tutorial.level = null;
}

Tutorial.invise = function () {
	if (Tutorial.image) Tutorial.image.visible=false;
	if (Tutorial.text) Tutorial.text.visible=false;
}

Tutorial.changeLocale = function () {
	if (Tutorial.text) {
		var text = LOCALE["TUTORIAL_"+Tutorial.level];
		var wrapped = Helper.TextWrapper.wrapText(text, game.width*0.95, game.height, 'blue', Tutorial.text.fontSize)[0];
		Tutorial.text.setText(wrapped);
		Tutorial.resize();
	}
}
