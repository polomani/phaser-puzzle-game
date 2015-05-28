var Puzzle = Puzzle || {};

Puzzle.Preload = function(){};

Puzzle.Preload.prototype = {
  preload: function() {
  	this.load.image('box_black', 'assets/images/box_black.png');
	this.load.image('box_blue', 'assets/images/box_blue.png');
	this.load.image('box_gap', 'assets/images/box_gap.png');
  },
  create: function() {
  	this.state.start('MainMenu');
  }
};