
var BSIZE = 50;
var Puzzle = Puzzle || {};
Puzzle.Game = function(){};
var game;


Puzzle.Game.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;
	game = this.game;

};

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
		Puzzle.Game.prototype.createStage(arr);
	};
	img.src = src;
};

Puzzle.Game.prototype.createStage = function (arr) {
	game.world.setBounds(0, 0, 2880, 2880);
	game.boxes = game.add.group();

	game.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	game.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	game.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	game.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	game.keyUP.onDown.add(step, this);
	game.keyDOWN.onDown.add(step, this);
	game.keyLEFT.onDown.add(step, this);
	game.keyRIGHT.onDown.add(step, this);

	//var arr = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,2,0,0,1],[1,0,0,0,1],[1,0,0,1,2], [1,2,,,3],[1],[1],[1],[1], [1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	for (var y = 0; y < arr.length; y++) {
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y]) 
			{
				if(arr[y][x]==0 && !arr[y][x]) continue;
				if (x==0 && arr[y][x]==0) console.log("w");
				var box;
				if(arr[y][x]==1) box = game.boxes.create (x*50, y*BSIZE, 'box_black');
				if(arr[y][x]==2) box = game.boxes.create (x*50, y*BSIZE, 'box_blue');
				if(arr[y][x]==3) box = game.boxes.create (x*50, y*BSIZE, 'box_gap');
				if (arr[y][x]==3) game.boxes.setChildIndex(box, 0);
			}
		}
	}

	game.inputEnabled = true;
	game.input.onDown.add(beginSwipe, this);
};


Puzzle.Game.prototype.update = function() {

};

function step (key)
{
	game.boxes.forEach (move, this);	
	function move (box)
	{
		if (box.key == "box_gap") return;
		if (box.key == "box_black" || collide(box, key.keyCode)) return;
		if (key == game.keyUP)    game.add.tween(box).to( { y: (-BSIZE).toString() }, 100, "Linear", true);
		if (key == game.keyDOWN)  game.add.tween(box).to( { y: BSIZE.toString() },    100, "Linear", true);
		if (key == game.keyLEFT)  game.add.tween(box).to( { x: (-BSIZE).toString() }, 100, "Linear", true);
		if (key == game.keyRIGHT) game.add.tween(box).to( { x: BSIZE.toString() },    100, "Linear", true);
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
