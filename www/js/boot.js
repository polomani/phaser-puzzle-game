var Puzzle = Puzzle || {};

Puzzle.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Puzzle.Boot.prototype = {
  preload: function() {

  },
  create: function() {
  	var ratio = getRatio('all', 320, 480);        
	if (navigator.isCocoonJS) {            
		this.game.world._container.scale.x = ratio.x;            
		this.game.world._container.scale.y = ratio.y;            
		this.game.world._container.updateTransform();        
	} else {            
		this.game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;            
		this.game.stage.scale.minWidth = 320;            
		this.game.stage.scale.minHeight = 480;            
		this.game.stage.scale.pageAlignHorizontally = true;    
		//this.game.stage.scale.setScreenSize(true);        
	}   
	  this.game.add.sprite(0,0,'');
    this.game.stage.backgroundColor = '#1d002d';

    //scaling options
	/*this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.minWidth = 240;
	this.scale.minHeight = 170;
	this.scale.maxWidth = 2880;
	this.scale.maxHeight = 1920;
	
	//have the game centered horizontally
	this.scale.pageAlignHorizontally = true;

	//screen size will be set automatically
	this.scale.setScreenSize(true);
    */
    this.state.start('Preload');
  }
};

function getRatio(type, w, h) {
	var width = navigator.isCocoonJS ? window.innerWidth : 320,        
		height = navigator.isCocoonJS ? window.innerHeight : 480;    
	var scaleX = width / w,            
		scaleY = height / h,            
				result = {                
					x: 1,                
					y: 1            
				};        
				switch (type) {        
					case 'all':            
						result.x = scaleX > scaleY ? scaleY : scaleX;            
						result.y = scaleX > scaleY ? scaleY : scaleX;            
					break;        
					case 'fit':            
					result.x = scaleX > scaleY ? scaleX : scaleY;            
					result.y = scaleX > scaleY ? scaleX : scaleY;            
					break;        
					case 'fill':            
					result.x = scaleX;            
					result.y = scaleY;            
					break;        
				}        
				return result;    
			}    