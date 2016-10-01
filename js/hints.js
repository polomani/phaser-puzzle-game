Tutorial = function(){};

Tutorial.resize = function() {
	if (Tutorial.image) {
		Tutorial.image.width = 
		Tutorial.image.height = Math.min (Math.min(game.width, game.height)/3, Tutorial.image.realWidth);
		Tutorial.image.x = game.width-Tutorial.image.width;
	}
	if (Tutorial.text) {
		Tutorial.text.x = game.width/2;
		Tutorial.text.y = game.height-50;
	}
}

Tutorial.open = function (level) {
	var tutorialText = [];
	tutorialText[0] = 'Swipe to move boxes. \nConnect them using walls.';
	tutorialText[2] = 'Beware of red holes';
	tutorialText[3] = "3 boxes it's not a problem!";

	if (game.cache.checkImageKey('tutorial_'+level)) {
		var animation = game.add.sprite(game.width-228/2, 0, 'tutorial_'+level);
	    animation.animations.add('play');
	    animation.animations.play('play', 13, true);
	    animation.realWidth=animation.width;
	    animation.realHeight=animation.height;

	    Tutorial.image=animation;
	}

	if (tutorialText[level]) {
	    var text = game.add.text(0,game.height-50, tutorialText[level], { font: '25px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: game.width});
		text.anchor.set (0.5, 0.5);
		text.align = 'center';

		Tutorial.text = text;
	}
}
