var Puzzle = Puzzle || {};

Puzzle.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Puzzle.Boot.prototype = {
  preload: function() {
    
  },
  create: function() {
    this.game.stage.backgroundColor = '#1d2224';

    //scaling options
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.minWidth = 240;
	this.scale.minHeight = 170;
	this.scale.maxWidth = 2880;
	this.scale.maxHeight = 1920;
	
	//have the game centered horizontally
	this.scale.pageAlignHorizontally = true;
    
    this.state.start('Preload');
  }
};