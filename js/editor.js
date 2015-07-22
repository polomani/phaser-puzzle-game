var Puzzle = Puzzle || {};
Puzzle.Editor = function(){};
var cursor;
var COLS = 20;
var ROWS = 30;
var BSIZE = 50;
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
		cursor.y = Math.floor(y / BSIZE)*BSIZE;
		cursor.x = Math.floor(x / BSIZE)*BSIZE;
	}
}

function changeCursor (key) {
	if (cursor)
		o.boxes.remove (cursor);
	var x = Math.floor(o.input.x / BSIZE)*BSIZE;
	var y = Math.floor(o.input.y / BSIZE)*BSIZE;
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
	BSIZE = 50;

	o.ONE = o.input.keyboard.addKey(Phaser.Keyboard.ONE);
	o.TWO = o.input.keyboard.addKey(Phaser.Keyboard.TWO);
	o.THREE = o.input.keyboard.addKey(Phaser.Keyboard.THREE);
	o.FOUR = o.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	o.keyS = o.input.keyboard.addKey(Phaser.Keyboard.S);
	o.ONE.onDown.add(changeCursor);
	o.TWO.onDown.add(changeCursor);
	o.THREE.onDown.add(changeCursor);
	o.FOUR.onDown.add(changeCursor);
	o.keyS.onDown.add(saveLevel);

	var bmd = o.add.bitmapData(width,height);
	bmd.ctx.beginPath();
    bmd.ctx.lineWidth = "1";
    bmd.ctx.strokeStyle = 0;
    for (var j = 0; j < height/BSIZE; ++j) {
    	bmd.ctx.moveTo(0, j*BSIZE);
  		bmd.ctx.lineTo(width, j*BSIZE);
    }
    for (var j = 0; j < width/BSIZE; ++j) {
    	bmd.ctx.moveTo(j*BSIZE, 0);
  		bmd.ctx.lineTo(j*BSIZE, height);
    }
    bmd.ctx.stroke();
	o.add.sprite(0, 0, bmd);

	this.addMenu();
};

Puzzle.Editor.prototype.addMenu = function () {
	var play_label = game.add.text(0, 20, 'Play', { font: '24px Arial', fill: '#0' });
    play_label.inputEnabled = true;
    play_label.events.onInputDown.add(function () {
    	LEVELS[LEVELS.length] = saveLevel();
    	this.game.state.start('Game');
    });
}

function saveLevel () {
	var minX = o.boxes.getChildAt(0).x, minY = o.boxes.getChildAt(0).y, maxX = 0, maxY = 0;
	o.boxes.forEach (function(box) {
		if (box == cursor) return; 
		if (box.x > maxX) maxX = box.x;
		if (box.y > maxY) maxY = box.y;
		if (box.x < minX) minX = box.x;
		if (box.y < minY) minY = box.y;
	});
	minX /= BSIZE;
	minY /= BSIZE;
	maxX /= BSIZE;
	maxY /= BSIZE;
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
		//alert (levelArr.length + " " + box.x/BSIZE);
		levelArr [box.x/BSIZE - minX][box.y/BSIZE - minY] = box.btype;
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

};


Puzzle.Editor.prototype.render = function() {
	
};
