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
	o.BSIZE = 50;
};


function onResizedEditor (f) {
	
}

function onBoxDown(sprite, pointer) {
	o.boxes.remove (sprite);
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
	if (cursor) cursor.type = key;
}

Puzzle.Editor.prototype.create = function () {
	o.world.setBounds(0, 0, 2880, 2880);
	o.input.addMoveCallback(mouseMove);
	o.input.onDown.add(mouseClicked);
	o.boxes = o.add.group();
	o.BSIZE = 50;

	o.ONE = o.input.keyboard.addKey(Phaser.Keyboard.ONE);
	o.TWO = o.input.keyboard.addKey(Phaser.Keyboard.TWO);
	o.THREE = o.input.keyboard.addKey(Phaser.Keyboard.THREE);
	o.FOUR = o.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	o.keyS = o.input.keyboard.addKey(Phaser.Keyboard.S);
	o.ONE.onDown.add(changeCursor);
	o.TWO.onDown.add(changeCursor);
	o.THREE.onDown.add(changeCursor);
	o.FOUR.onDown.add(changeCursor);
	o.keyS.onDown.add(commitLevel);

	o.net = o.add.bitmapData(o.world.width,o.world.height);
	
	o.add.sprite(0, 0, o.net);
	o_updateNet();
	

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
		var newLvl = saveLevel();
		if (newLvl!=null)
			LEVELS[Editor.aimLVL] = newLvl;
		this.game.state.start('Game');
	});

	game.add.text(0, 50, '1 = box black \n2 = box blue \n3 = box gap\n4 = cursor\nS = save lvl \n ', { font: '18px Arial', fill: '#0' });


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

function saveLevel () {
	if (o.boxes.length == 0) return null;
	var minX = o.boxes.getChildAt(0).x, minY = o.boxes.getChildAt(0).y, maxX = 0, maxY = 0;
	o.boxes.forEach (function(box) {
		if (box == cursor) return; 
		if (box.x > maxX) maxX = box.x;
		if (box.y > maxY) maxY = box.y;
		if (box.x < minX) minX = box.x;
		if (box.y < minY) minY = box.y;
	});
	minX /= o.BSIZE;
	minY /= o.BSIZE;
	maxX /= o.BSIZE;
	maxY /= o.BSIZE;
	var levelArr = new Array (maxX - minX + 1);
	//alert (maxX - minX + 1);
	for (var i = 0; i < levelArr.length; ++i) {
		levelArr[i] = new Array (maxY - minY + 1);
		for (var j = 0; j < levelArr[i].length; ++j) {
			levelArr[i][j] = 0;
		}
	}
	o.boxes.forEach (function(box) {
		if (box == cursor) return;
		//alert (levelArr.length + " " + box.x/o.BSIZE);
		levelArr [box.x/o.BSIZE - minX][box.y/o.BSIZE - minY] = box.btype;
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
	if (cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown) {
		o_updateNet();
	}
};

Puzzle.Editor.prototype.render = function() {
	
};


o_updateNet = function () {
	o.net.ctx.beginPath();
	o.net.ctx.lineWidth = "1";
	o.net.ctx.strokeStyle = 0;
	o.net.ctx.moveTo(0, 0);
	for (var j = 0; j < (height+o.camera.y)/o.BSIZE; ++j) {
		o.net.ctx.moveTo(0, j*o.BSIZE);
		o.net.ctx.lineTo(o.world.width, j*o.BSIZE);
	}
	for (var j = 0; j < (width+o.camera.x)/o.BSIZE; ++j) {
		o.net.ctx.moveTo(j*o.BSIZE, 0);
		o.net.ctx.lineTo(j*o.BSIZE, o.world.height);
	}
	o.net.ctx.stroke();
}