var Puzzle = Puzzle || {};
Puzzle.Editor = function(){};
var o;

Puzzle.Editor.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;

	o = this.game;
	o.cursor = null;
	//o.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	//o.scale.setResizeCallback(onResizedEditor);
	//o.scale.refresh();
	o.inputEnabled = true;
	o.path = {};
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

	game.savebutton.x = o.width-200;
}

function onBoxDown(sprite, pointer) {
	if (o.input.x > o.width*0.95 || o.input.x < o.width*0.05 || o.input.y > o.height*0.95 || o.input.y < o.height*0.05) {
		return;
	}

	if (sprite.key=="box_red" || sprite.key=="box_red_dir") {
		if (o.cursor && o.cursor.key=="box_red") {
			o.path.edit = true;
			o.path.curbox = sprite.init || sprite;
			o.path.last = getLastPathBox(sprite);
			changeCursor(o.SEVEN);
			return;
		} else if (!o.path.edit) {
			deletePathBoxes(sprite);
		}
	}
	if (!o.path.edit && !o.cursor) {
		if (sprite.key=="box_red_dir") {
			deleteNextPathBoxes(sprite);
			sprite.init.btype.path = getPathBoxes(sprite.init);
		}
		o.boxes.remove(sprite);
	}
	reindexBoxes();
	saveLevel ();
}

function mouseClicked (obj) {
	if (o.input.x > o.width*0.95)
		Puzzle.Editor.cameraRight();
	else if (o.input.x < o.width*0.05)
		Puzzle.Editor.cameraLeft()
	else if (o.input.y > o.height*0.95)
		Puzzle.Editor.cameraDown();
	else if (o.input.y < o.height*0.05)
		Puzzle.Editor.cameraUp();
	else if (!(o.input.x < 120 && o.input.y< 310)) {

		if (o.cursor) {
			if (isRedBoxUnderCursor() && o.cursor.key=="box_red") return;
			o.cursor.inputEnabled = true;
			o.cursor.events.onInputDown.add(onBoxDown, this);
			var type = o.cursor.type;
			if (type==o.SEVEN)
				o.path.edit = true;
			if (o.path.edit)
				o.path.last = o.cursor;
			o.cursor = null;
			changeCursor (type);
		}
		else
			changeCursor (o.ZERO);
	}
	reindexBoxes();
	saveLevel ();
}

function mouseMove (pointer, x, y) {
	if (o.cursor) {
		if (o.path.edit) {
			if (Math.abs (y - o.path.last.y) < Math.abs (x - o.path.last.x)) {
				o.cursor.y = o.path.last.y;
				var dir = 1;
				if (x <= o.path.last.x) dir = -1;
				o.cursor.x = o.path.last.x + o.BSIZE*dir;
				if (dir == 1) {
					o.cursor.dir = Phaser.RIGHT;
				} else {
					o.cursor.dir = Phaser.LEFT;
				}
			} else {
				var dir = 1;
				if (y <= o.path.last.y) dir = -1;
				o.cursor.y = o.path.last.y + o.BSIZE*dir;
				o.cursor.x = o.path.last.x;
				if (dir == 1) {
					o.cursor.dir = Phaser.DOWN;
				} else {
					o.cursor.dir = Phaser.UP;
				}
			}
			o.cursor.angle = o_getAngleFromDir(o.cursor.dir);
			o.path.last.frame = getPrevPathBoxFrame(o.path.last, o.cursor);
			return;
		}
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
			o.cursor = o.boxes.create (x, y, 'box_black_small');
			o.cursor.btype = 1;
			break;
		case o.TWO :
			var btype;
			if (prevcur && isBlueBox(prevcur.btype)) {
				btype = prevcur.btype + 1;
				if (btype>22) btype = 20;
			} else {
				btype = 20;
			}
			o.cursor = o.boxes.create (x, y, 'box_blue_small');	
            o.cursor.frame = getBlueBoxFrame(btype);
			o.cursor.btype = btype;
			break;
		case o.THREE :
			o.cursor = o.boxes.create (x, y, 'box_gap_small');
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
			o.cursor = o.boxes.create (x, y, 'box_arr_small');
			o.cursor.btype = {
				value:5
			};
			if (prevcur && prevcur.btype instanceof Object && prevcur.btype.value==5)
				o.cursor.angle = prevcur.angle + 90;
			o.cursor.btype.dir = getDirFromAngle(o.cursor.angle);
			break;
		case o.SIX:
			o.cursor = o.boxes.create (x, y, 'box_port_small');
			if (prevcur && prevcur.btype instanceof Object && prevcur.btype.value==6)
				o.cursor.frame = (prevcur.btype.id+1)% o.cursor.animations.frameTotal;
			o.cursor.btype = {
				value:6,
				id:o.cursor.frame
			};
			break;
		case o.SEVEN:
			if (o.path.edit) {
				o.cursor = o.boxes.create(x, y, 'box_red_dir');
				o.cursor.init = o.path.curbox;
				if (o.path.last)
					o.path.last.next = o.cursor;
				o.path.curbox.btype.path = getPathBoxes(o.path.curbox);
			} else {
				o.cursor = o.boxes.create(x, y, 'box_red');
				o.path.curbox = o.cursor;
				o.cursor.btype = {
					value:7
				};
			}
			break;
		case o.EIGHT:
			o.cursor = o.boxes.create (x, y, 'box_sokoban_small');
			o.cursor.btype = 8;
			break;
		case o.NINE:
			o.cursor = o.boxes.create (x, y, 'box_arr_small');
			o.cursor.btype = {
				value:5,
				spin:"cw"
			};
			if (prevcur && prevcur.btype instanceof Object && prevcur.btype.value==5 && prevcur.btype.spin) {	
				o.cursor.angle = prevcur.angle + 90;
				if (o.cursor.angle==0) {
					o.cursor.btype.spin = oppClock(prevcur.btype.spin);
				} else {
					o.cursor.btype.spin = prevcur.btype.spin;
				}
			}
			o.cursor.frame = (o.cursor.btype.spin=="cw") ? 1 : 2;
			o.cursor.btype.dir = getDirFromAngle(o.cursor.angle);
			break;
		case o.ZERO:
			break;
	}
	if (key!=o.SEVEN) {
		if (o.path.edit && o.path.last)
			o.path.last.frame = 0;
		o.path.edit = false;
		if (o.path.last)
		{
			o.path.last.next = null;
			o.path.last = null;
		}
		o.path.curbox = null;
	}
	if (o.cursor) {
		o.cursor.anchor.setTo(0.5, 0.5);
		o.cursor.type = key;
		o.cursor.scale.setTo (o.BSIZE/100, o.BSIZE/100);
	}
	function oppClock(current) {
		if (current=="cw")
			return "ccw";
		return "cw";
	}
}

Puzzle.Editor.prototype.create = function () {
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
	o.EIGHT = o.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
	o.NINE = o.input.keyboard.addKey(Phaser.Keyboard.NINE);
	o.ZERO = o.input.keyboard.addKey(Phaser.Keyboard.ZERO);
	o.keyS = o.input.keyboard.addKey(Phaser.Keyboard.S);
	o.keyPlus = o.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ADD);
	o.keyMinus = o.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_SUBTRACT);
	game.keyF1 = game.input.keyboard.addKey(Phaser.Keyboard.F1);
	o.ONE.onDown.add(changeCursor);
	o.TWO.onDown.add(changeCursor);
	o.THREE.onDown.add(changeCursor);
	o.FOUR.onDown.add(changeCursor);
	o.FIVE.onDown.add(changeCursor);
	o.SIX.onDown.add(changeCursor);
	o.SEVEN.onDown.add(changeCursor);
	o.EIGHT.onDown.add(changeCursor);
	o.NINE.onDown.add(changeCursor);
	o.ZERO.onDown.add(changeCursor);
	o.keyS.onDown.add(commitLevel);
	o.keyMinus.onDown.add(function() {o_zoom(false);});
	o.keyPlus.onDown.add(function() {o_zoom(true);});
	game.keyF1.onDown.add(function () {
		this.game.state.start('Game');
	});

	var arr = LEVELS[Game.aimLVL];
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
						box = game.boxes.create(xx, yy, 'box_arr_small');
						if (arr[y][x].spin) box.frame = (arr[y][x].spin=="cw") ? 1 : 2;
						box.angle = o_getAngleFromDir(arr[y][x].dir);
					}
					if (arr[y][x].value==6) {
						box = game.boxes.create(xx, yy, 'box_port_small');
						box.frame = arr[y][x].id;
					}
					if (arr[y][x].value==7) {
						box = game.boxes.create(xx, yy, 'box_red');
					}
				} else {
					if (arr[y][x] == 1) box = o.boxes.create(xx, yy, 'box_black_small');
					if (isBlueBox(arr[y][x])) {
                        box = o.boxes.create(xx, yy, 'box_blue_small');
                        box.frame = getBlueBoxFrame(arr[y][x]);
                    }
					if (arr[y][x] == 3) box = o.boxes.create(xx, yy, 'box_gap_small');
					if (arr[y][x] == 8) box = o.boxes.create(xx, yy, 'box_sokoban_small');
				}
				box.btype = arr[y][x];
				box.indexX = x;
				box.indexY = y;
				box.scale.setTo (o.BSIZE/100, o.BSIZE/100);
				box.x = x*o.BSIZE;
				box.y = y*o.BSIZE;
				box.inputEnabled = true;
				box.anchor.setTo(0.5, 0.5);
				box.events.onInputDown.add(onBoxDown);
				if(box.key=='box_red')
					createPathForBox(box);
			}
		}
	}

	Editor.cursors = o.input.keyboard.createCursorKeys();
	this.addMenu();
	onResizedEditor();
};

Puzzle.Editor.prototype.addMenu = function () {
	var play_label = game.add.text(0, 20, 'F1 - Play', { font: '24px Arial', fill: '#FFFFFF' });
	play_label.inputEnabled = true;
	play_label.events.onInputDown.add(function () {
		changeCursor (o.ZERO);
		this.game.state.start('Game');
	});

	game.cursorbutton = game.add.text(0, 75, '9 = cursor', { font: '18px Arial', fill: '#FFFFFF' });
	game.blackbutton = game.add.text(0, 100, '1 = box white', { font: '18px Arial', fill: '#FFFFFF' });
	game.bluebutton = game.add.text(0, 125, '2 = box green', { font: '18px Arial', fill: '#FFFFFF' }); 
	game.gapbutton = game.add.text(0, 150, '3 = box gap', { font: '18px Arial', fill: '#FFFFFF' });
	game.doorbutton = game.add.text(0, 175, '4 = box door', { font: '18px Arial', fill: '#FFFFFF' });
	game.directbutton = game.add.text(0, 200, '5 = direction', { font: '18px Arial', fill: '#FFFFFF' });
	game.telebutton = game.add.text(0, 225, '6 = teleport', { font: '18px Arial', fill: '#FFFFFF' });
	game.redbutton = game.add.text(0, 250, '7 = red box', { font: '18px Arial', fill: '#FFFFFF' });
	game.sokobutton = game.add.text(0, 275, '8 = sokoban', { font: '18px Arial', fill: '#FFFFFF' });
	game.spinbutton = game.add.text(0, 300, '9 = spin arr', { font: '18px Arial', fill: '#FFFFFF' });
	game.plusbutton = game.add.text(0, 325, '[zoom in +]', { font: '18px Arial', fill: '#FFFFFF' });
	game.minusbutton = game.add.text(0, 350, '[zoom out -]', { font: '18px Arial', fill: '#FFFFFF' });
	game.savebutton = game.add.text(0, 0, 'S = save lvl', { font: '18px Arial', fill: '#FFFFFF' });
	game.cursorbutton.inputEnabled = true;
	game.blackbutton.inputEnabled = true;
	game.bluebutton.inputEnabled = true; 
	game.gapbutton.inputEnabled = true;
	game.doorbutton.inputEnabled = true;
	game.directbutton.inputEnabled = true;
	game.telebutton.inputEnabled = true;
	game.redbutton.inputEnabled = true;
	game.sokobutton.inputEnabled = true;
	game.spinbutton.inputEnabled = true;
	game.plusbutton.inputEnabled = true;
	game.minusbutton.inputEnabled = true;
	game.savebutton.inputEnabled = true;
	game.cursorbutton.events.onInputDown.add(function () {changeCursor(o.ZERO)});
    game.blackbutton.events.onInputDown.add(function () {changeCursor(o.ONE)});
    game.bluebutton.events.onInputDown.add(function () {changeCursor(o.TWO)});
    game.gapbutton.events.onInputDown.add(function () {changeCursor(o.THREE)});
    game.doorbutton.events.onInputDown.add(function () {changeCursor(o.FOUR)});
    game.directbutton.events.onInputDown.add(function () {changeCursor(o.FIVE)});
    game.telebutton.events.onInputDown.add(function () {changeCursor(o.SIX)});
    game.redbutton.events.onInputDown.add(function () {changeCursor(o.SEVEN)});
    game.sokobutton.events.onInputDown.add(function () {changeCursor(o.EIGHT)});
    game.spinbutton.events.onInputDown.add(function () {changeCursor(o.NINE)});
    game.plusbutton.events.onInputDown.add(function () {o_zoom(true);});
    game.minusbutton.events.onInputDown.add(function () {o_zoom(false);});
    game.savebutton.events.onInputDown.add(commitLevel);
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
		o.cursor.scale.setTo (o.BSIZE/100, o.BSIZE/100);
	}
}

function o_resizeBox (box, indentX, indentY) {
	box.scale.setTo (o.BSIZE/100, o.BSIZE/100);
	var xx = (indentX + box.indexX) * o.BSIZE + o.BSIZE/2;
	var yy = (indentY + box.indexY) * o.BSIZE + o.BSIZE/2;
	box.x = xx;
	box.y = yy;
}

function commitLevel() {
	var newLvl = saveLevel();
	LEVELS[Game.aimLVL] = newLvl;
	var string = levelsToString();
	var data = {
		pass:"korleone",
		level:string
	};
	console.log(string);
	$.ajax({
		url: 'http://dreamlike.wanspi.com/puzzle_editor/',
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
	var firebase = new Firebase("https://puzzle-lvl-editor-dev.firebaseio.com/levels");
	var firebaseData = {};
	firebaseData[new Date().toUTCString().slice(5, 25)] = string;
	firebase.update(firebaseData);
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
						if (arr[y][x].spin) 
							string += "{ value:5, dir:" + arr[y][x].dir + ", spin:'" + arr[y][x].spin + "' },";
						else
							string += "{ value:5, dir:" + arr[y][x].dir + " },";
					if (arr[y][x].value==6)
						string += "{ value:6, id:" + arr[y][x].id + " },";
					if (arr[y][x].value==7)
						string += "{ value:7, path:'" + arr[y][x].path +  "' },";
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
		if (box.key=="box_red_dir") return;
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
		if (box.key=="box_red_dir") return;
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
	LEVELS[Game.aimLVL] = levelArr;
	return levelArr;
}

Puzzle.Editor.prototype.update = function() {
	var cursors = Editor.cursors;
	if (cursors.up.isDown)
	{
		Puzzle.Editor.cameraUp();
	}
	else if (cursors.down.isDown)
	{
		Puzzle.Editor.cameraDown();
	}

	if (cursors.left.isDown)
	{
		Puzzle.Editor.cameraLeft();
	}
	else if (cursors.right.isDown)
	{
		Puzzle.Editor.cameraRight();
	}
};

Puzzle.Editor.cameraLeft = function () {
	o.camera.x -= o.BSIZE;
}

Puzzle.Editor.cameraRight = function () {
	o.camera.x += o.BSIZE;
}

Puzzle.Editor.cameraUp = function () {
	o.camera.y -= o.BSIZE;
}

Puzzle.Editor.cameraDown = function () {
	o.camera.y += o.BSIZE;
}


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
	o.net.ctx.strokeStyle = "white";
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

function createPathForBox(box) {
	var str = box.btype.path;
	box.init = box;
	while (str.length>0) {
		var ch = str.charAt(0);
		str = str.substring(1);
		var newbox = game.boxes.create(0, 0, 'box_red_dir');
		newbox.init = box.init;
		newbox.anchor.setTo(0.5, 0.5);
		newbox.indexX = box.indexX;
		newbox.indexY = box.indexY;
		newbox.dir = parseInt(ch);
		newbox.angle = o_getAngleFromDir(newbox.dir);
		newbox.inputEnabled = true;
		newbox.events.onInputDown.add(onBoxDown, this);
		switch (newbox.dir) {
			case Phaser.LEFT:
				newbox.indexX--;
				break;
			case Phaser.RIGHT:
				newbox.indexX++;
				break;
			case Phaser.UP:
				newbox.indexY--;
				break;
			case Phaser.DOWN:
				newbox.indexY++;
				break;
		}
		box.next = newbox;
		box.frame = getPrevPathBoxFrame(box, newbox);
		box = newbox;
	}
}

function getPrevPathBoxFrame(prev, cur) {
	if (cur.dir==prev.dir|| prev.key=="box_red") return 1;
	else if (prev.dir==Phaser.RIGHT) {
		if (cur.dir == Phaser.DOWN)
			return 3;
		if (cur.dir == Phaser.UP)
			return 2;
		if (cur.dir == Phaser.LEFT)
			return 0;
	} else if (prev.dir==Phaser.LEFT) {
		if (cur.dir == Phaser.DOWN)
			return 2;
		if (cur.dir == Phaser.UP)
			return 3;
		if (cur.dir == Phaser.RIGHT)
			return 0;
	} else if (prev.dir==Phaser.UP) {
		if (cur.dir == Phaser.RIGHT)
			return 3;
		if (cur.dir == Phaser.LEFT)
			return 2;
		if (cur.dir == Phaser.DOWN)
			return 0;
	}  else if (prev.dir==Phaser.DOWN) {
		if (cur.dir == Phaser.RIGHT)
			return 2;
		if (cur.dir == Phaser.LEFT)
			return 3;
		if (cur.dir == Phaser.UP)
			return 0;
	}
}


function getPathBoxes(box) {
	var res = '';
	while (box) {
		if (box.dir)
			res += '' + box.dir;
		box = box.next;
	}
	return res;
}

function deletePathBoxes(_box) {
	var arr = new Array();
	o.boxes.forEach (function (box) {
		if (box.init==_box)
			arr.push (box);
	});
	while (arr.length>0) {
		o.boxes.remove (arr.shift());
	}

}

function deleteNextPathBoxes(_box) {
	var box = _box.init;
	while (box) {
		if (box.next==_box) {
			box.frame = 0;
			box.next = null;
			break;
		}
		box = box.next;
	}
	while (_box) {
		var box = _box;
		_box = _box.next;
		o.boxes.remove(box);
	}
}

function getLastPathBox(box) {
	while (box.next) {
		box = box.next;
	}
	return box;
}

function isRedBoxUnderCursor() {
	var res = false;
	o.boxes.forEach (function(box) {
		if (box.key=="box_red" && Phaser.Rectangle.containsPoint(box.getBounds(), o.cursor.position) && box!=o.cursor)
			res = true;
	});
	return res;
}