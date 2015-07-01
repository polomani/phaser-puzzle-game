
var BSIZE = 50;
var Puzzle = Puzzle || {};
Puzzle.Game = function(){};
var game;


Puzzle.Game.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;
	game = this.game;

	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.setScreenSize(true);
    this.game.scale.setResizeCallback(onResized);
	game.scale.refresh();
};


function onResized (f) {
	if (f!=true && game.width==innerWidth && game.height==innerHeight) return;
	game.width = innerWidth;
	game.height = innerHeight;
	game.scale.setScreenSize(true);
	game.scale.refresh();
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
	                        Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));
	if (game.boxes)
		game.boxes.forEach (resize);
	function resize (box) {
		box.scale.setTo (BSIZE/50, BSIZE/50);

		var xx = Math.floor ((window.innerWidth - game.levelWidth*BSIZE)/2) + box.indexX*BSIZE;
		var yy = Math.floor ((window.innerHeight - game.levelHeight*BSIZE)/2) + box.indexY*BSIZE;

		game.invert = (game.levelHeight > game.levelWidth) && (window.innerWidth > window.innerHeight) || (game.levelHeight < game.levelWidth) && (window.innerWidth < window.innerHeight);

		if (game.invert) {
			xx =  Math.floor ((window.innerWidth - game.levelHeight*BSIZE)/2) + box.indexY*BSIZE;
			yy =  Math.floor ((window.innerHeight - game.levelWidth*BSIZE)/2) + box.indexX*BSIZE;
		}

		box.x = xx;
		box.y = yy; 
	}
}

Puzzle.Game.prototype.create = function () {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var img = new Image();
	var arr = [];
	var src = "assets/levels/level1.png";

	img.onload = function() {
		context.drawImage(img, 0, 0);
		for (var y = 0; y < img.height; y++) {
			arr [y] = [];
			for (var x = 0; x < img.width; x++) {
				var myData = context.getImageData(x, y, 1, 1);
				arr [y][x] = rgbToHex(myData.data[0], myData.data[1], myData.data[2]);
				if (arr [y][x]==='ffffff') arr [y][x] = 0;
				if (arr [y][x]==='000000') arr [y][x] = 1;
				if (arr [y][x]==='0000ff') arr [y][x] = 2;
				if (arr [y][x]==='ff0000') arr [y][x] = 3;

			}
		}
		game.levelWidth = img.width;
		game.levelHeight = img.height;
		game.levelArr = arr;
		BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(img.width, img.height),
	                        Math.min(game.width, game.height) / Math.min(img.width, img.height)));
		game.invert = (img.height > img.width) && (window.innerWidth > window.innerHeight) || (img.height < img.width) && (window.innerWidth < window.innerHeight);
		Puzzle.Game.prototype.createStage();
		onResized(true);
	};
	img.src = src;
};

Puzzle.Game.prototype.createStage = function () {
	game.actiont = 0;
	game.world.setBounds(0, 0, 2880, 2880);
	game.boxes = game.add.group();
	game.actionb = false;

	game.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	game.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	game.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	game.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	game.keyUP.onDown.add(step, this);
	game.keyDOWN.onDown.add(step, this);
	game.keyLEFT.onDown.add(step, this);
	game.keyRIGHT.onDown.add(step, this);

	//var arr = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,2,0,0,1],[1,0,0,0,1],[1,0,0,1,2], [1,2,,,3],[1],[1],[1],[1], [1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var arr = game.levelArr;
	for (var y = 0; y < arr.length; y++) {
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y]) 
			{
				if(arr[y][x]==0 && !arr[y][x]) continue;
				if (x==0 && arr[y][x]==0) console.log("w");
				var box;
				var xx = 0, yy = 0;
				if(arr[y][x]==1) box = game.boxes.create (xx, yy, 'box_black');
				if(arr[y][x]==2) box = game.boxes.create (xx, yy, 'box_blue');
				if(arr[y][x]==3) box = game.boxes.create (xx, yy, 'box_gap');
				if (arr[y][x]==3) game.boxes.setChildIndex(box, 0);
				box.indexX = x;
				box.indexY = y;
			}
		}
	}

	game.inputEnabled = true;
	game.input.onDown.add(beginSwipe, this);
};


Puzzle.Game.prototype.update = function() {
	game.actiont--;
};

function step (key)
{
	console.log (game.actiont);
	if (game.actiont > 0) return;
	game.actiont += 120;
	game.boxes.forEach (move);	
	function move (box)
	{
		var tween;
		if (box.key == "box_gap") return;
		if (box.key == "box_black" || collide(box, key.keyCode)) return;
		if (key == game.keyUP) {
			if (game.invert)
				box.indexX--;
			else
				box.indexY--;
			tween = game.add.tween(box).to( { y: (-BSIZE).toString() }, 100, "Linear", true);
		}
		if (key == game.keyDOWN) {
			if (game.invert)
				box.indexX++;
			else
				box.indexY++;
			tween = game.add.tween(box).to( { y: BSIZE.toString() },    100, "Linear", true);
		}
		if (key == game.keyLEFT) {
			if (game.invert)
				box.indexY--;
			else
				box.indexX--;
			tween = game.add.tween(box).to( { x: (-BSIZE).toString() }, 100, "Linear", true);
		}
		if (key == game.keyRIGHT) {
			if (game.invert)
				box.indexY++;
			else
				box.indexX++;
			tween = game.add.tween(box).to( { x: BSIZE.toString() },    100, "Linear", true);
		}
		tween.onComplete.add(function() { game.actiont = 0; });
	}
}

function collide (box, side, n)
{
	n = n || 0;
	for (var i = 0; i < game.boxes.children.length; i++)
	{
		if (box.key!="box_blue") continue;
		if (_collide(game.boxes.getChildAt(i)))	
		{
			if (n > 0)
			{
				game.boxes.remove(box);
				return false;
			}
			if (game.boxes.getChildAt(i).key=="box_gap")
			{
				game.boxes.remove(box);
				gameOver();
				return false;
			}
			return true;
		}
	}
	function _collide (_box)
	{
		if (_box==box) return false;
		if ((_box.y==box.y && ((_box.x == box.x-BSIZE && side==37) ||  (_box.x == box.x+BSIZE && side==39)))
			|| (_box.x==box.x && ((_box.y == box.y-BSIZE && side==38) || (_box.y == box.y+BSIZE && side==40))))
		{
			return collide (_box, side, n+1) || _box.key == "box_black" || _box.key == "box_gap";
		}
		
	}
	return false;
}

Puzzle.Game.prototype.render = function() {
	this.game.debug.text(this.time.fps || '--', 2, 14, "#00ff00");
	//this.debug.cameraInfo(this.camera, 32, 32);
	//game.debug.body(player);
};

function gameOver () {
	Puzzle.game.state.start('Boot');
}
