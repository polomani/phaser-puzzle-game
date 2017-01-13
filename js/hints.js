Tutorial = function(){};

Tutorial.resize = function(data) {
	if (data && Tutorial.image) {
		var maxDimension = Tutorial.image.realWidth;
		if (Tutorial.level!=0) maxDimension *= 1.5;
		Tutorial.image.width = 
		Tutorial.image.height = Math.round(Math.min (Dimensions.getMinDimension()/4, maxDimension));
		Tutorial.image.y = game.height/2;
		Tutorial.image.x = Math.max(data.bbounds.x/2, Tutorial.image.height/2);
	}
	if (Tutorial.label) {
		var sensei = Tutorial.label.sensei;
		sensei.scale.x = sensei.scale.y = Math.min (Dimensions.getMinDimension()/8/sensei.rwidth, 1); 

		Tutorial.label.text.x = sensei.x + sensei.width + Dimensions.getMinDimension()*0.02;
		Tutorial.label.text.y = Math.min(sensei.y, sensei.y - sensei.height/2 + Tutorial.label.text.height/2);

		Tutorial.label.y = game.height*0.99;
		Tutorial.label.x = (game.width-Tutorial.label.width)/2;
	}
}

Tutorial.open = function (level) {
	Tutorial.level = level;
	var key = Dimensions.getImageKey('tutorial_'+level);
	if (game.cache.checkImageKey(key)) {
		var animation = game.add.sprite(0, 0, key);
	    animation.animations.add('play');
	    animation.anchor.set (0.5, 0.5);
	    if (level!=0) animation.angle = -90; 
	    animation.animations.play('play', 30, true);
	    animation.realWidth=animation.width;
	    animation.realHeight=animation.height;

	    Tutorial.image=animation;
	}

	if (LOCALE["TUTORIAL_"+level]) {
	    var text = game.add.bitmapText(0, 0, "blue", "", Dimensions.getFontSize()-18); 
	    text.anchor.set (0, 1);

		var sensei = game.add.sprite(0, 0, Dimensions.getImageKey('sensei'));
		sensei.rwidth = sensei.width;
		sensei.anchor.set (0, 1);

		Tutorial.label = game.add.group();
		Tutorial.label.add (sensei);
		Tutorial.label.add (text);
		Tutorial.label.sensei = sensei;
		Tutorial.label.text = text;
		Tutorial.changeLocale ();
	}
}

Tutorial.clean = function (level) {
	Tutorial.image = null;
	Tutorial.label= null;
	Tutorial.level = null;
}

Tutorial.invise = function () {
	if (Tutorial.image) Tutorial.image.visible=false;
	if (Tutorial.label) Tutorial.label.visible=false;
}

Tutorial.changeLocale = function () {
	if (Tutorial.label) {
		var text = LOCALE["TUTORIAL_"+Tutorial.level];
		var wrapped = Helper.TextWrapper.wrapText(text, game.width*0.83, game.height, 'blue', Tutorial.label.text.fontSize)[0];
		Tutorial.label.text.setText(wrapped);
		Tutorial.resize();
	}
}
