var Puzzle = Puzzle || {};
Puzzle.Editor = function(){};
var o;

Puzzle.Editor.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;

	o = this.game;
	o.cursor = null;
	o.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	o.scale.setScreenSize(true);
	o.scale.setResizeCallback(onResizedEditor);
	o.scale.refresh();
	o.inputEnabled = true;
};


function onResizedEditor () {
	var xy = o_getMinMaxBoxesXY();
	var w = (xy.max.x - xy.min.x)/o.BSIZE, h = (xy.max.y - xy.min.y)/o.BSIZE;
	var indentX = Math.floor((window.innerWidth - w*o.BSIZE)/o.BSIZE/2);
	var indentY = Math.floor((window.innerHeight - h*o.BSIZE)/o.BSIZE/2);
	if (indentX < 0)
		indentX = 0;
	if (indentY < 0)
		indentY = 0;
	o.boxes.forEach (function (box) {o_resizeBox(box, indentX, indentY);})

	o_updateNet();
}

function onBoxDown(sprite, pointer) {
	o.boxes.remove (sprite);
	reindexBoxes();
	saveLevel ();
}

function mouseClicked (obj) {

	if (o.cursor) {
		o.cursor.inputEnabled = true;
		o.cursor.events.onInputDown.add(onBoxDown, this);
		var type = o.cursor.type;
		o.cursor = null;
		changeCursor (type);
	}
	else
		changeCursor (o.SEVEN);
	reindexBoxes();
	saveLevel ();
}

function mouseMove (pointer, x, y) {
	if (o.cursor) {
		o.cursor.y = o.camera.y + Math.floor(y / o.BSIZE)*o.BSIZE + o.BSIZE/2;
		o.cursor.x = o.camera.x + Math.floor(x / o.BSIZE)*o.BSIZE + o.BSIZE/2;
	}
}

function changeCursor (key) {
	if (o.cursor) {
		var prevcur = o.cursor;
		o.boxes.remove(o.cursor);
	}
	var x = o.camera.x + Math.floor(o.input.x / o.BSIZE)*o.BSIZE + o.BSIZE/2;
	var y = o.camera.y + Math.floor(o.input.y / o.BSIZE)*o.BSIZE + o.BSIZE/2;

	switch (key) {
		case o.ONE :
			o.cursor = o.boxes.create (x, y, 'box_black');
			o.cursor.btype = 1;
			break;
		case o.TWO :
			o.cursor = o.boxes.create (x, y, 'box_blue');
			o.cursor.btype = 2;
			break;
		case o.THREE :
			o.cursor = o.boxes.create (x, y, 'box_gap');
			o.cursor.btype = 3;
			break;
		case o.FOUR :
			o.cursor = o.boxes.create (x, y, 'box_door');
			if (prevcur && prevcur.btype instanceof Object && prevcur.btype.value==4)
				o.cursor.frame = (prevcur.frame+1)%2;
			else
				o.cursor.frame = 0;
			o.cursor.btype = {
				value:4,
				state:o.cursor.frame
			};
			break;
		case o.FIVE:
			o.cursor = o.boxes.create (x, y, 'box_arr');
			o.cursor.btype = {
				value:5
			};
			if (prevcur && prevcur.btype instanceof Object && prevcur.btype.value==5)
				o.cursor.angle = prevcur.angle + 90;
			o.cursor.btype.dir = o_getDirFromAngle(o.cursor.angle);
			break;
		case o.SIX:
			o.cursor = o.boxes.create (x, y, 'box_port');
			if (prevcur && prevcur.btype instanceof Object && prevcur.btype.value==6)
				o.cursor.frame = (prevcur.btype.id+1)% o.cursor.animations.frameTotal;
			o.cursor.btype = {
				value:6,
				id:o.cursor.frame
			};
			break;
		case o.SEVEN:
			break;
	}
	if (o.cursor) {
		o.cursor.anchor.setTo(0.5, 0.5);
		o.cursor.type = key;
		o.cursor.scale.setTo (o.BSIZE/50, o.BSIZE/50);
	}
}

Puzzle.Editor.prototype.create = function () {
	//alert (levelsToString(LEVELS[Editor.aimLVL]));
	o.world.setBounds(0, 0, 2880, 2880);
	o.input.addMoveCallback(mouseMove);
	o.input.onDown.add(mouseClicked);
	o.boxes = o.add.group();
	o.net = o.add.bitmapData(o.world.width,o.world.height);
	o.add.sprite(0, 0, o.net);
	o.BSIZE = 30;

	o.ONE = o.input.keyboard.addKey(Phaser.Keyboard.ONE);
	o.TWO = o.input.keyboard.addKey(Phaser.Keyboard.TWO);
	o.THREE = o.input.keyboard.addKey(Phaser.Keyboard.THREE);
	o.FOUR = o.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	o.FIVE = o.input.keyboard.addKey(Phaser.Keyboard.FIVE);
	o.SIX = o.input.keyboard.addKey(Phaser.Keyboard.SIX);
	o.SEVEN = o.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
	o.keyS = o.input.keyboard.addKey(Phaser.Keyboard.S);
	o.keyPlus = o.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ADD);
	o.keyMinus = o.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_SUBTRACT);
	o.ONE.onDown.add(changeCursor);
	o.TWO.onDown.add(changeCursor);
	o.THREE.onDown.add(changeCursor);
	o.FOUR.onDown.add(changeCursor);
	o.FIVE.onDown.add(changeCursor);
	o.SIX.onDown.add(changeCursor);
	o.SEVEN.onDown.add(changeCursor);
	o.keyS.onDown.add(commitLevel);
	o.keyMinus.onDown.add(function() {o_zoom(false);});
	o.keyPlus.onDown.add(function() {o_zoom(true);});

	var arr = LEVELS[Editor.aimLVL];
	for (var y = 0; y < arr.length; y++) {
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y])
			{
				if(arr[y][x]==0 && !arr[y][x]) continue;
				var box;
				var xx = 0, yy = 0;
				if (arr[y][x] instanceof Object) {
					if (arr[y][x].value==4) {
						box = o.boxes.create(xx, yy, 'box_door');
						box.frame = arr[y][x].state;
					}
					if (arr[y][x].value==5) {
						box = game.boxes.create(xx, yy, 'box_arr');
						box.angle = o_getAngleFromDir(arr[y][x].dir);
					}
					if (arr[y][x].value==6) {
						box = game.boxes.create(xx, yy, 'box_port');
						box.frame = arr[y][x].id;
					}
				} else {
					if (arr[y][x] == 1) box = o.boxes.create(xx, yy, 'box_black');
					if (arr[y][x] == 2) box = o.boxes.create(xx, yy, 'box_blue');
					if (arr[y][x] == 3) box = o.boxes.create(xx, yy, 'box_gap');
					if (arr[y][x] == 3) o.boxes.setChildIndex(box, 0);
				}
				box.btype = arr[y][x];
				box.indexX = x;
				box.indexY = y;
				box.scale.setTo (o.BSIZE/50, o.BSIZE/50);
				box.x = x*o.BSIZE;
				box.y = y*o.BSIZE;
				box.inputEnabled = true;
				box.anchor.setTo(0.5, 0.5);
				box.events.onInputDown.add(onBoxDown);
			}
		}
	}

	Editor.cursors = o.input.keyboard.createCursorKeys();
	this.addMenu();
};

Puzzle.Editor.prototype.addMenu = function () {
	var play_label = game.add.text(0, 20, 'Play', { font: '24px Arial', fill: '#0' });
	play_label.inputEnabled = true;
	play_label.events.onInputDown.add(function () {
		this.game.state.start('Game');
	});

	game.add.text(0, 50, '1 = box black \n2 = box blue \n3 = box gap\n4 = box door\n5 = direction\n6 = teleport\n7 = cursor\nS = save lvl \n ', { font: '18px Arial', fill: '#0' });


}

o_zoom = function(plus) {
	var xy = o_getMinMaxBoxesXY();
	var w = (xy.max.x - xy.min.x)/o.BSIZE, h = (xy.max.y - xy.min.y)/o.BSIZE;

	if (plus && o.BSIZE < 95) {
		o.BSIZE += 5;
	} else if (!plus && o.BSIZE > 10){
		o.BSIZE -= 5;
	}
	o_updateNet();

	var indentX = Math.floor((window.innerWidth - w*o.BSIZE)/o.BSIZE/2);
	var indentY = Math.floor((window.innerHeight - h*o.BSIZE)/o.BSIZE/2);
	if (indentX < 0)
		indentX = 0;
	if (indentY < 0)
		indentY = 0;
	o.boxes.forEach (function (box) {o_resizeBox(box,indentX, indentY);})
	if (o.cursor) {

		o.cursor.scale.setTo (o.BSIZE/50, o.BSIZE/50);
	}
}

function o_resizeBox (box, indentX, indentY) {
	box.scale.setTo (o.BSIZE/50, o.BSIZE/50);
	var xx = (indentX + box.indexX) * o.BSIZE + o.BSIZE/2;
	var yy = (indentY + box.indexY) * o.BSIZE + o.BSIZE/2;
	box.x = xx;
	box.y = yy;
}

function commitLevel() {
	var newLvl = saveLevel();
	LEVELS[Editor.aimLVL] = newLvl;
	var string = levelsToString();
	var data = {
		pass:"korleone",
		level:string
	};
    //alert(string);
    $.ajax({
    	url: 'http://dreamlike.cc/puzzle_editor/',
    	data: $.param(data),
    	type: 'POST',
    	dataType: 'text',
    	beforeSend: function (xhr) {
    		xhr.setRequestHeader("Accept", "text/html");
    		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    	},
    	success: function (data) {
    		alert(JSON.stringify (data));
    	},
    	error: function (e) {
    		console.log('Error: ' + e);
    	}
    });
}

function levelsToString () {
	var string  = "var LEVELS = [\n";
	for (var i = 0; i < LEVELS.length; ++i) {
		string += '\t' + levelToString(LEVELS[i]) + ',\n';
	}
	string = string.substring (0, string.length-2);
	string += "\n];"
	return string;
}

function levelToString (arr) {
	var string = "[";
	for (var y = 0; y < arr.length; y++) {
		string += "[";
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y]) 
			{
				if(arr[y][x] instanceof Object) {
					if (arr[y][x].value==4)
						string += "{ value:4, state:" + arr[y][x].state + " },";
					if (arr[y][x].value==5)
						string += "{ value:5, dir:" + arr[y][x].dir + " },";
					if (arr[y][x].value==6)
						string += "{ value:6, id:" + arr[y][x].id + " },";
				} else {
					string += arr[y][x] + ",";
				}
			}
		}
		string = string.substring (0, string.length-1);
		string += "],";
	}
	string = string.substring (0, string.length-1);
	string+=']';
	return string;
}

function o_getMinMaxBoxesXY () {
	var minX = 0, minY = 0, maxX = 0, maxY = 0;
	if (o.boxes.length > 0) {
		minX = o.boxes.getChildAt(0).x;
		minY = o.boxes.getChildAt(0).y;
	}
	o.boxes.forEach (function(box) {
		if (box == o.cursor) return;
		if (box.x > maxX) maxX = box.x;
		if (box.y > maxY) maxY = box.y;
		if (box.x < minX) minX = box.x;
		if (box.y < minY) minY = box.y;
	});
	return {
		min:{
			x:minX,
			y:minY
		},
		max:{
			x:maxX,
			y:maxY
		}
	};
}

function saveLevel () {
	if (o.boxes.length == 0) return null;
	var xy = o_getMinMaxBoxesXY();
	var minX = xy.min.x, minY = xy.min.y, maxX = xy.max.x, maxY = xy.max.y;

	minX /= o.BSIZE;
	minY /= o.BSIZE;
	maxX /= o.BSIZE;
	maxY /= o.BSIZE;
	var sizeX = maxX - minX + 1;
	var sizeY = maxY - minY + 1;
	var levelArr = new Array (sizeY);
	for (var i = 0; i < sizeY; ++i) {
		levelArr[i] = new Array (sizeX);
		for (var j = 0; j < sizeX; ++j) {
			 levelArr[i][j] = 0;
		}
	}
	o.boxes.forEach (function(box) {
		if (box == o.cursor) return;
		levelArr [box.y/o.BSIZE - minY][box.x/o.BSIZE - minX] = box.btype;
	});
	var str = "[";
	for (var i = 0; i < levelArr.length; ++i) {
		str += "[";
		for (var j = 0; j < levelArr[i].length; ++j) {
			str += levelArr[i][j] + ","
		}
		str = str.substring (0, str.length-1);
		str += "],";
	}
	str = str.substring (0, str.length-1);
	str += "]";
	//alert (str);
	LEVELS[Editor.aimLVL] = levelArr;
	return levelArr;
}

Puzzle.Editor.prototype.update = function() {
	var cursors = Editor.cursors;
	if (cursors.up.isDown)
	{
		o.camera.y -= o.BSIZE;
	}
	else if (cursors.down.isDown)
	{
		o.camera.y += o.BSIZE;
	}

	if (cursors.left.isDown)
	{
		o.camera.x -= o.BSIZE;
	}
	else if (cursors.right.isDown)
	{
		o.camera.x += o.BSIZE;
	}
};

Puzzle.Editor.prototype.render = function() {
	
};

function reindexBoxes() {
	if (o.boxes.length == 0) return;
	var xy = o_getMinMaxBoxesXY();
	var minX = xy.min.x, minY = xy.min.y, maxX = xy.max.x, maxY = xy.max.y;
	minX /= o.BSIZE;
	minY /= o.BSIZE;
	maxX /= o.BSIZE;
	maxY /= o.BSIZE;

	o.boxes.forEach (function(box) {
		if (box == o.cursor) return;
		box.indexX = box.x/o.BSIZE - minX;
		box.indexY = box.y/o.BSIZE - minY;
	});
}

o_updateNet = function () {
	o.net.ctx.clearRect(0, 0, o.net.width, o.net.height);
	o.net.ctx.beginPath();
	o.net.ctx.lineWidth = "1";
	o.net.ctx.strokeStyle = 0;
	o.net.ctx.moveTo(0, 0);
	for (var j = 0; j < o.world.height/o.BSIZE; ++j) {
		o.net.ctx.moveTo(0, j*o.BSIZE);
		o.net.ctx.lineTo(o.world.width, j*o.BSIZE);
	}
	for (var j = 0; j < o.world.width/o.BSIZE; ++j) {
		o.net.ctx.moveTo(j*o.BSIZE, 0);
		o.net.ctx.lineTo(j*o.BSIZE, o.world.height);
	}
	o.net.ctx.stroke();
}

function o_getDirFromAngle(angle) {
	switch (angle) {
		case 0:
			return Phaser.RIGHT;
		case 90:
			return Phaser.DOWN;
		case -180:
			return Phaser.LEFT;
		case -90:
			return Phaser.UP;
		default :
			return Phaser.RIGHT;
	}
}

function o_getAngleFromDir(dir) {
	switch (dir) {
		case Phaser.RIGHT:
			return 0;
		case Phaser.DOWN:
			return 90;
		case Phaser.LEFT:
			return  -180;
		case Phaser.UP:
			return -90;
		default :
			return 0;
	}
}