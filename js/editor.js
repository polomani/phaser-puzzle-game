var Puzzle = Puzzle || {};
Puzzle.Editor = function(){};
var cursor;
var COLS = 20;
var ROWS = 30;
var o;

Puzzle.Editor.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;

	o = this.game;
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

	o_updateNet();;
}

function onBoxDown(sprite, pointer) {
	o.boxes.remove (sprite);
	saveLevel ();
}

function mouseClicked (obj) {
	if (cursor) {
		cursor.inputEnabled = true;
		cursor.events.onInputDown.add(onBoxDown, this);
		var type = cursor.type;
		cursor = null;
		changeCursor (type);
	}
	else
		changeCursor (o.FOUR);
	saveLevel ();
}

function mouseMove (pointer, x, y) {
	if (cursor) {
		cursor.y = o.camera.y + Math.floor(y / o.BSIZE)*o.BSIZE;
		cursor.x = o.camera.x + Math.floor(x / o.BSIZE)*o.BSIZE;
	}
}

function changeCursor (key) {
	if (cursor)
		o.boxes.remove (cursor);
	var x = o.camera.x + Math.floor(o.input.x / o.BSIZE)*o.BSIZE;
	var y = o.camera.y + Math.floor(o.input.y / o.BSIZE)*o.BSIZE;
	switch (key) {
		case o.ONE :
		cursor = o.boxes.create (x, y, 'box_black');
		cursor.btype = 1;
		break;
		case o.TWO :
		cursor = o.boxes.create (x, y, 'box_blue');
		cursor.btype = 2;
		break;
		case o.THREE :
		cursor = o.boxes.create (x, y, 'box_gap');
		cursor.btype = 3;
		break;
		case o.FOUR :
		
		break;
	}
	if (cursor) {
		cursor.type = key;
		cursor.scale.setTo (o.BSIZE/50, o.BSIZE/50);
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
	o.keyS = o.input.keyboard.addKey(Phaser.Keyboard.S);
	o.keyPlus = o.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ADD);
	o.keyMinus = o.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_SUBTRACT);
	o.ONE.onDown.add(changeCursor);
	o.TWO.onDown.add(changeCursor);
	o.THREE.onDown.add(changeCursor);
	o.FOUR.onDown.add(changeCursor);
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
				if(arr[y][x]==1) box = o.boxes.create (xx, yy, 'box_black');
				if(arr[y][x]==2) box = o.boxes.create (xx, yy, 'box_blue');
				if(arr[y][x]==3) box = o.boxes.create (xx, yy, 'box_gap');
				if (arr[y][x]==3) o.boxes.setChildIndex(box, 0);
				box.btype = arr[y][x];
				box.indexX = x;
				box.indexY = y;
				box.scale.setTo (o.BSIZE/50, o.BSIZE/50);
				box.x = x*o.BSIZE;
				box.y = y*o.BSIZE;
				box.inputEnabled = true;
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

	game.add.text(0, 50, '1 = box black \n2 = box blue \n3 = box gap\n4 = cursor\nS = save lvl \n ', { font: '18px Arial', fill: '#0' });


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
	if (cursor) {

		cursor.scale.setTo (o.BSIZE/50, o.BSIZE/50);
	}
}

function o_resizeBox (box, indentX, indentY) {
	box.scale.setTo (o.BSIZE/50, o.BSIZE/50);
	var xx = (indentX + box.indexX) * o.BSIZE;
	var yy = (indentY + box.indexY)* o.BSIZE;
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
				string += arr[y][x] + ",";
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
		if (box == cursor) return;
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
		if (box == cursor) return;
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