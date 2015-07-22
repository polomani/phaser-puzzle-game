
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
game.scale.setResizeCallback(onResized);
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
var lvlN = LEVELS.length-1;
game.levelWidth = LEVELS[lvlN][0].length;
game.levelHeight = LEVELS[lvlN].length;
game.levelArr = LEVELS[lvlN];
BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
	Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));

game.invert = (game.levelHeight > game.levelWidth) && (window.innerWidth > window.innerHeight) || (game.levelHeight < game.levelWidth) && (window.innerWidth < window.innerHeight);
		Puzzle.Game.prototype.createStage();
		onResized(true);

		this.addMenu();
	};

	Puzzle.Game.prototype.addMenu = function () {
		var editor_label = game.add.text(0 , 20, 'Editor', { font: '24px Arial', fill: '#0' });
		editor_label.inputEnabled = true;
		editor_label.events.onInputDown.add(function () {
			this.game.state.start('Editor');
		});
	}


	Puzzle.Game.prototype.createStage = function () {
		game.moving = false;
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

		var arr = game.levelArr;
	//var arr = game.levelArr;
	var string = "var arr = [";
	for (var y = 0; y < arr.length; y++) {
		string += "[";
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y]) 
			{
				string += arr[y][x] + ",";
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
		string = string.substring (0, string.length-1);
		string += "],";
	}
	string = string.substring (0, string.length-1);
	string += "]";
	//alert (string);
	game.inputEnabled = true;
	game.input.onDown.add(beginSwipe, this);
};


Puzzle.Game.prototype.update = function() {
	
};

function step (key)
{
	console.log (game.actiont);
	if (game.moving) return;
	game.boxes.forEach (move);	
	function move (box)
	{
		var tween;
		if (box.key == "box_gap") return;
		if (box.key == "box_black" || collide(box, key.keyCode)) return;
		game.moving = true;			
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
		tween.onComplete.add(function() { game.moving = false; });
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
	this.game.debug.text(this.time.fps + " " + game.moving || '--', 2, 14, "#00ff00");
};

function gameOver () {
	Puzzle.game.state.start('Boot');
}
