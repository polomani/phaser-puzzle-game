Tutorial = function(){};

Tutorial.resize = function() {
	if (Tutorial.image) {
		Tutorial.image.width = 
		Tutorial.image.height = Math.min (Math.min(game.width, game.height)/3, Tutorial.image.realWidth);
		Tutorial.image.x = game.width-Tutorial.image.width;
	}
	if (Tutorial.text) {
		Tutorial.text.x = game.width/2;
		Tutorial.text.y = game.height-Tutorial.text.height-20;

		Tutorial.back.y = Tutorial.text.y;
		Tutorial.back.width = game.width;
		Tutorial.back.height = Tutorial.text.height;
	}
}

Tutorial.open = function (level) {
	var tutorialText = [];
	tutorialText[0] = 'Swipe to move blue boxes \nConnect them using walls';
	tutorialText[2] = 'Beware of white points';
	tutorialText[3] = "more boxes it is not a problem";

	if (game.cache.checkImageKey('tutorial_'+level)) {
		var animation = game.add.sprite(game.width-228/2, 0, 'tutorial_'+level);
	    animation.animations.add('play');
	    animation.animations.play('play', 13, true);
	    animation.realWidth=animation.width;
	    animation.realHeight=animation.height;

	    Tutorial.image=animation;
	}

	if (tutorialText[level]) {
		var background = game.add.sprite(0,0,"window");
		background.alpha = 0.6;
		Tutorial.back = background;

	    var text = game.add.bitmapText(0, 0, "white", tutorialText[level], Dimensions.getFontSize()-12); 
	    text.anchor.set (0.5, 0);
		text.align = 'center';
		Tutorial.text = text;
	}
}

Tutorial.clean = function (level) {
	Tutorial.image = null;
	Tutorial.text = null;
}
