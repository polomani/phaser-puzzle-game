Tutorial = function(){};

Tutorial.resize = function() {
	if (Tutorial.image) {
		Tutorial.image.width = 
		Tutorial.image.height = Math.min (Dimensions.getMinDimension()/3, Tutorial.image.realWidth);
		Tutorial.image.y = game.height/2;
		Tutorial.image.x = 0;
	}
	if (Tutorial.text) {
		Tutorial.text.x = game.width/2;
		Tutorial.text.y = game.height-Tutorial.text.height-20;
	}
}

Tutorial.open = function (level) {
	
	if (game.cache.checkImageKey('tutorial_'+level)) {
		var animation = game.add.sprite(0, 0, 'tutorial_'+level);
	    animation.animations.add('play');
	    animation.anchor.set (0.5, 0);
	    animation.angle = -90; 
	    animation.animations.play('play', 30, true);
	    animation.realWidth=animation.width;
	    animation.realHeight=animation.height;

	    Tutorial.image=animation;
	}

	if (LOCALE["TUTORIAL_"+level]) {
	    var text = game.add.bitmapText(0, 0, "blue", "", Dimensions.getFontSize()-18); 
	    text.anchor.set (0.5, 0);
		text.align = 'center';
		text.level = level;
		Tutorial.text = text;
		Tutorial.changeLocale ();
	}
}

Tutorial.clean = function (level) {
	Tutorial.image = null;
	Tutorial.text = null;
}

Tutorial.changeLocale = function () {
	if (Tutorial.text) {
		var text = LOCALE["TUTORIAL_"+Tutorial.text.level];
		var wrapped = Helper.TextWrapper.wrapText(text, game.width*0.95, game.height, 'blue', Tutorial.text.fontSize)[0];
		Tutorial.text.setText(wrapped);
		Tutorial.resize();
	}
}
