
var BSIZE = 50;
var Puzzle = Puzzle || {};
Puzzle.Game = function(){};
var game;

Puzzle.Game.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;
	this.game.renderer.renderSession.roundPixels = true;
	this.game.stage.smoothed = false;
	game = this.game;

	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
};

Puzzle.Game.prototype.create = function () {
	console.log(Dimensions.getSize());
	console.log(game.width + "x" + game.height);
	game.gameOver = game.gameWin = false;
	game.levelWidth = LEVELS[Game.aimLVL][0].length;
	game.levelHeight = LEVELS[Game.aimLVL].length;
	game.levelArr = LEVELS[Game.aimLVL];
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
		Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));

	game.scale.prevWidth = game.scale.prevHeight = false;
	game.invert = (game.levelHeight > game.levelWidth) && (game.width > game.height) || (game.levelHeight < game.levelWidth) && (game.width < game.height);
	game.solution = "";
	Tutorial.clean();
	Puzzle.Game.prototype.createStage();
	onGameResized();

	this.addMenu();
};

onGameResized =  function (full) {
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
		Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));
	BSIZE = Math.min(Math.min (Dimensions.getBoxSize(), BSIZE), Dimensions.getMinDimension()/8);
	if (game.boxes)
		game.boxes.forEach (resize);
	function resize (box) {
		var newscale = BSIZE/Dimensions.getBoxSize();
		box.scale.setTo (newscale, newscale);

		var xx = Math.floor ((game.width - game.levelWidth*BSIZE)/2) + box.matrix.x*BSIZE + BSIZE/2;
		var yy = Math.floor ((game.height - game.levelHeight*BSIZE)/2) + box.matrix.y*BSIZE + BSIZE/2;

		game.invert = (game.levelHeight > game.levelWidth) && (game.width > game.height) || (game.levelHeight < game.levelWidth) && (game.width < game.height);

		if (game.invert) {
			xx =  game.width - Math.floor ((game.width - game.levelHeight*BSIZE)/2) - box.matrix.y*BSIZE - BSIZE/2;
			yy =  Math.floor ((game.height - game.levelWidth*BSIZE)/2) + box.matrix.x*BSIZE + BSIZE/2;
		}

		box.x = xx;
		box.y = yy; 
	}
	Puzzle.Game.rotateArrows();
	Tutorial.resize({bbounds:game.boxes.getLocalBounds()});
}

Puzzle.Game.prototype.addMenu = function () {

	var pause = this.game.add.sprite (0,0, Dimensions.getImageKey("btn_pause"));
    pause.inputEnabled = true;
    pause.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/pause.width));
    pause.events.onInputDown.add(function () {
      if (!(Popup.anyWinOpened())) {
      		Popup.openOptMenu();
      	}
    });

    var props = this.game.add.sprite (this.game.width,0, Dimensions.getImageKey("btn_props"));
    props.anchor.setTo(1, 0);
    props.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/props.width));
    props.inputEnabled = true;
    props.events.onInputDown.add(function () {
      if (!(Popup.anyWinOpened())) {
      		Popup.openPropsMenu();
      	}
    });

    if (Game.aimLVL > 6) {
	    var replay = this.game.add.sprite (this.game.width,this.game.height, Dimensions.getImageKey("btn_replay"));
	    replay.anchor.setTo(1, 1);
	    replay.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/replay.width));
	    replay.inputEnabled = true;
	    replay.events.onInputDown.add(function () {
	      if (!(Popup.anyWinOpened())) {
	      		this.game.state.start("Game");
	      	}
	    });
	}

	if (false && game.device.desktop) {
		var editor_label = game.add.text(0 , 50, 'F1 - Editor', { font: '24px Arial', fill: '#FFFFFF' });
		editor_label.inputEnabled = true;
		editor_label.events.onInputDown.add(function () {
			this.game.state.start('Editor');
		});
	}
}

Puzzle.Game.prototype.createStage = function () {
	game.moving = false;
	game.world.setBounds(0, 0, 2880, 2880);
	game.boxes = game.add.group();

	game.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	game.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	game.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	game.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	game.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	game.keyF1 = game.input.keyboard.addKey(Phaser.Keyboard.F1);
	game.keyUP.onDown.add(step, this);
	game.keyDOWN.onDown.add(step, this);
	game.keyLEFT.onDown.add(step, this);
	game.keyRIGHT.onDown.add(step, this);
	game.keyQ.onDown.add(function () {
		var s = AI.findSolution (game.matrix);
		alert(s);
	});
	game.keyF1.onDown.add(function () {
		this.game.state.start('Editor');
	});

	var matrix = game.matrix = [];
	matrix.visual = {
		toRemove:[],
		onSpikes:[],
		toTeleport:[]
	};
	matrix.blueBoxes = [];
	matrix.doors = [];
	matrix.ports = [];
	matrix.robots = [];
	matrix.arrows = [];
	matrix.gaps = [];
	var arr = game.levelArr;
	for (var y = 0; y < arr.length; y++) {
		matrix[y]=[];
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y]) 
			{
				if(arr[y][x]==0 && !arr[y][x]) {
					matrix[y][x] = undefined;
					continue;
				}
				var box;
				var xx = 0, yy = 0;
				if(arr[y][x]==1) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_black'));
				if(isBlueBox(arr[y][x])) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_blue_'+getBlueBoxColor(arr[y][x])));
				if(arr[y][x]==3) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_gap'));
				if(arr[y][x]==8) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_sokoban'));
				if (arr[y][x] instanceof Object) {
					if (arr[y][x].value == 4) {
						box = game.boxes.create(xx, yy, 'box_door');
						box.frame = arr[y][x].state;
					}
					if (arr[y][x].value == 5) {
						box = game.boxes.create(xx, yy, Dimensions.getImageKey('box_arr'));
						box.angle = o_getAngleFromDir(arr[y][x].dir);
						if (arr[y][x].spin) 
						{
							box.frame = (arr[y][x].spin=="cw") ? 1 : 2;
						}
					}
					if (arr[y][x].value == 6) {
						box = game.boxes.create(xx, yy, 'box_port');
						box.frame = arr[y][x].id;
					}
					if (arr[y][x].value == 7) {
						box = game.boxes.create(xx, yy, 'box_red');
					}
				}
				if (arr[y][x]==0 || arr[y][x]==3 || arr[y][x] instanceof Object) game.boxes.setChildIndex(box, 0);
				box.anchor.setTo(0.5, 0.5);
				matrix[y][x] = {
					x:x,
					y:y,
					type:arr[y][x],
					box:box
				};
				box.matrix = matrix[y][x];
				if (is (box,"box_blue") || is (box,"box_sokoban")) 
					matrix.blueBoxes.push (matrix[y][x]);
				else if (is (box,"box_door"))
					matrix.doors.push (matrix[y][x]);
				else if (is (box,"box_port"))
					matrix.ports.push (matrix[y][x]);
				else if (is (box,"box_red"))
					matrix.robots.push (matrix[y][x]);
				else if (is (box,"box_arr"))
					matrix.arrows.push (matrix[y][x]);
				else if (is (box,"box_gap"))
					matrix.gaps.push (matrix[y][x]);

				function is (box, key) {
					if (box.key.lastIndexOf(key)!=-1) {
						return true;
					}
					return false;
				}
			}
		}
	}
	game.inputEnabled = true;
	game.input.onDown.addOnce(beginSwipe, game);
	Tutorial.open(Game.aimLVL);
	onGameResized();

	game.visualize = function() {
		var matrix = game.matrix;
		var counter = {
			moving:0,
			teleports:0,
			spikes:0 
		};

		game.boxes.forEach (function(box) {
			var ttask = getTeleportTask(box.matrix);
			moveBox(box.matrix, ttask);
		});

		spinBoxArrows();

		function finishTeleport() { finish("teleports"); };
		function finishSpike() { finish("spikes"); };
		function finishMoving() { finish("moving"); };

		function finish (type) {
			counter[type]--;
			if (counter.moving==0) {
				matrix.visual.toRemove.forEach (function(elem) {
					game.boxes.remove(elem.box);
				});
				matrix.visual.onSpikes.forEach (function(elem) {
					game.add.tween(elem.box).to( { alpha:0 }, 200, "Linear", true, 0, 1, true).onComplete.add(finishSpike);
					counter.spikes++;
				});
				matrix.visual.toRemove = [];
				matrix.visual.onSpikes = [];
				matrix.visual.toTeleport = [];
			}
			if (counter.moving==0 && counter.spikes==0 && counter.teleports==0) {
				game.moving = false;
				if (game.gameWin) {
					Popup.openWinMenu();
				}
				if (game.gameOver) {
					Popup.openGameOverMenu();
				}
			}
		}

		function getTeleportTask (aim) {
			var result;
			matrix.visual.toTeleport.forEach (function (elem) {
				if (aim == elem.elem) {
					result = elem;
				}
			});
			return result;
		}

		function getNewCoords(x, y) {
			var xx, yy;
			if (!game.invert) {
				xx = Math.floor ((game.width - game.levelWidth*BSIZE)/2) + x*BSIZE + BSIZE/2;
				yy = Math.floor ((game.height - game.levelHeight*BSIZE)/2) + y*BSIZE + BSIZE/2;	
			} else {
				xx =  game.width - Math.floor ((game.width - game.levelHeight*BSIZE)/2) - y*BSIZE - BSIZE/2;
				yy =  Math.floor ((game.height - game.levelWidth*BSIZE)/2) + x*BSIZE + BSIZE/2;
			}
			return {x:xx, y:yy};
		}

		function moveBox (elem, teletask) {
			var x = elem.x;
			var y = elem.y;

			if (teletask) {
				x = teletask.from.x;
				y = teletask.from.y;
			}

			var coords = getNewCoords (x, y);
			var xx=coords.x, yy=coords.y;
			
			counter.moving++;
			var tween = game.add.tween(elem.box).to( { x: xx, y: yy }, 100, "Linear", true);
			tween.onComplete.add(function () {
				if (teletask) teleportBox (teletask);
				finishMoving ();
			});
		}

		function spinBoxArrows() {
			matrix.arrows.forEach (function(elem){
				elem.box.angle = o_getAngleFromDir(elem.type.dir);
			});

			matrix.blueBoxes.forEach(function(elem) {
				var x = elem.x;
				var y = elem.y;
				var aim = matrix[y][x];
				var prev = aim.prev;

				if (prev && prev.type.value==5) {
					matrix[y][x].box.frame = 1;
					if (!game.invert) {
						matrix[y][x].box.angle = o_getAngleFromDir(prev.type.dir);
					} else {
						matrix[y][x].box.angle = getInvertedAngleFromDir(prev.type.dir);
					}
				} else {
					matrix[y][x].box.frame = 0;
				}
			});
		}

		function teleportBox (teletask) {
			counter.teleports++;
			var elem = teletask.elem;
			var x = elem.x;
			var y = elem.y;
			
			var coords = getNewCoords (x, y);
			var xx=coords.x, yy=coords.y;
			
			var tween = game.add.tween(elem.box).to( { alpha:0.3, width:0, height:0 }, 50, "Linear", true);
			tween.onComplete.add(function() {
				elem.box.x = xx;
				elem.box.y = yy;
				tween = game.add.tween(elem.box).to( { alpha:1, width:BSIZE, height:BSIZE }, 50, "Linear", true);
				tween.onComplete.add(finishTeleport);
			});
		}
	}
};

Puzzle.Game.prototype.update = function() {};

function step (key)
{
	var matrix = game.matrix;
	if (game.moving || game.gameOver || game.gameWin) 
		return;
	game.moving = true;
	
	if (key == game.keyUP) {
			if (game.invert)
				matrixLeft(matrix);
			else
				matrixUp(matrix);
		}
		if (key == game.keyDOWN) {
			if (game.invert)
				matrixRight(matrix);
			else
				matrixDown(matrix);
		}
		if (key == game.keyLEFT) {
			if (game.invert)
				matrixDown(matrix);
			else
				matrixLeft(matrix);
		}
		if (key == game.keyRIGHT) {
			if (game.invert)
				matrixUp(matrix);
			else
				matrixRight(matrix);
		}

	var result = checkGameOver();
	if (result.win) {
		game.gameWin = true;
		saveSolutionToFirebase();
		Data.setCompletedLevels(Game.aimLVL+1);
	}
	if (result.fail) {
		game.gameOver = true;
	}
	game.visualize();
}

Puzzle.Game.prototype.render = function() {
	//if (!game.device.desktop) return;
	//this.game.debug.text(this.time.fps, 2, 14, "#00ff00");
};



Puzzle.Game.rotateArrows = function() {
	var matrix = game.matrix;
	matrix.arrows.forEach(function(elem){
		if (!game.invert) {
			elem.box.angle = o_getAngleFromDir(elem.type.dir);
		} else {
			elem.box.angle = getInvertedAngleFromDir(elem.type.dir);
		}
	});
};

function matrixMove(matrix, x, y, side) {
	var temp = matrix[y][x];
	if (!temp) 
		temp;
	matrixDel(matrix, x, y);
	switch (side) {
		case Phaser.LEFT:
			--x;
		break;
		case Phaser.RIGHT:
			++x;
		break;
		case Phaser.UP:
			--y;
		break;
		case Phaser.DOWN:
			++y;
		break;
	}
	var prev = matrix[y][x];
	matrix[y][x] = temp;
	matrix[y][x].prev = prev;

	if (matrix[y][x].teleported)
		matrix[y][x].teleported = false;

	matrix[y][x].y=y;
	matrix[y][x].x=x;
	checkTeleport(matrix, x, y);
};

function matrixNext (matrix, side, x, y, line) {
	if (x == undefined) {
		switch (side) {
			case Phaser.LEFT:
				x = matrix[0].length-1;
				y = 0;
			break;
			case Phaser.RIGHT:
				x = 0;
				y = 0;
			break;
			case Phaser.UP:
				x = 0;
				y = matrix.length-1;
			break;
			case Phaser.DOWN:
				x = 0;
				y = 0;
			break;
		}
	}
	switch (side) {
		case Phaser.LEFT:
			--x;
			if (x < 0) {
				if (line) {
					return false;
				}
				++y;
				x = matrix[0].length-1;
			}
			if (y >= matrix.length)
				return false;
		break;
		case Phaser.RIGHT:
			++x;
			if (x >= matrix[0].length) {
				if (line) {
					return false;
				}
				++y;
				x = 0;
			}
			if (y >= matrix.length)
				return false;
		break;
		case Phaser.UP:
			--y;
			if (y < 0) {
				if (line) {
					return false;
				}
				++x;
				y = matrix.length-1;
			}
			if (x >= matrix[0].length)
				return false;
		break;
		case Phaser.DOWN:
			++y;
			if (y >= matrix.length) {
				if (line) {
					return false;
				}
				++x;
				y = 0;
			}
			if (x >= matrix[0].length)
				return false;
		break;
	}
	
	return matrix[y][x];
};

function matrixIsBlocked (matrix, side, x, y) {
	var elem = {x:x, y:y};
	var isBlocked = false
	while ((elem = matrixNext(matrix, side, elem.x, elem.y, true))) {
		if(!elem || elem.type==3 ||
			(elem.type.value==4 && elem.box.frame==0) ||
			(elem.type.value==5 && canGoOnDirection(elem.type.dir, side)) ||
			 elem.type.value==6) {
			break;
		}
		isBlocked = true;
		break;
	}
	if (matrix[y][x] && matrix[y][x].prev && matrix[y][x].prev.type)
		if (matrix[y][x].prev.type.value==5 && !canGoFromDirection(matrix[y][x].prev.type.dir, side))
			isBlocked = true;

	if (matrix[y][x] && matrix[y][x].type==8)
		isBlocked = isBlocked || matrixIsSokoBlocked(matrix, side, x, y);

	return isBlocked;
}

function matrixIsSokoBlocked(matrix, side, x, y) {
	var elem = {x:x, y:y}
	while ((elem = matrixNext(matrix, opp(side), elem.x, elem.y, true))) {
		if(elem && elem.box) {
			if (isBlueBox(elem.type) || elem.type==8) {
				var blue = matrix[elem.y][elem.x];
				if (blue.prev && blue.prev.type && blue.prev.type.value==5) {
					if (!canGoFromDirection(blue.prev.type.dir, side))
						return true;
				}
				if (elem.type==8) {
					continue;
				} else {
					return false;
				}
			}		
		}
		break;
	}
	return true;
}

function matrixMoveAll(matrix, side){
	game.solution += side;
	matrix.blueBoxes.sort(matrixSortFunction(side));
	for (var i = 0; i < matrix.blueBoxes.length; ++i) {
		var cur = matrix.blueBoxes[i];
		var next = matrixNext(matrix, side, cur.x, cur.y);
		if (!matrixIsBlocked(matrix, side, cur.x, cur.y)) {
			if (next && next.type==3) {
				if (isBlueBox(cur.type)) {
					if (matrix.visual) matrix.visual.onSpikes.push(cur);
				} else {
					cur.type = 1;
					matrix.blueBoxes[i] = "deleted";
				}
			}
			matrixMove(matrix, cur.x, cur.y, side);
		} else {
			if (next && isSameBlueBox(next.type, cur.type) && !(next.prev && next.prev.type.value==5 && !canGoOnDirection(next.prev.type.dir, side))) {
				if (((!cur.prev || cur.prev.type.value!=5) || canGoFromDirection(cur.prev.type.dir, side)) && matrixIsBlocked(matrix, side, next.x, next.y)) {				
					matrix.blueBoxes[matrix.blueBoxes.indexOf(next)]="deleted";
					matrixDel(matrix, next.x, next.y);
					if (matrix.visual) matrix.visual.toRemove.push(next);
					matrixMove(matrix, cur.x, cur.y, side);
				}
			}
		}
	}
	while (matrix.blueBoxes.indexOf("deleted")!=-1)
		matrix.blueBoxes.splice(matrix.blueBoxes.indexOf("deleted"), 1);

	updateDoors(matrix);
	moveRobots(matrix);
	spinArrows(matrix);
}

function isAnyBoxOnGap (matrix) {
	var res = false;
	matrix.blueBoxes.forEach (function(box1) {
		if (isBlueBox(box1.type)) {
			matrix.gaps.forEach (function(box2) {
				if(box1.x==box2.x && box1.y==box2.y) {
					res=true;
				}
			});
		}
	});
	return res;
}

function checkGameOver (matrix) {
	matrix = matrix || game.matrix;
	var fail = isAnyBoxOnGap(matrix);
	var win = false;
	var frozen = false;
	if (!fail) {
		var blue = countBlueBoxes(matrix);
		win = blue.max==1;
		frozen = blue.frozen;
	}
	return {win:win, fail:fail, frozen:frozen};
}

function countBlueBoxes(matrix)  {
	var q1 = 0;
	var q2 = 0;
	var q3 = 0;
	var f1 = 0;
	var f2 = 0;
	var f3 = 0;
	matrix.blueBoxes.forEach (function(box) {
		if (isBlueBox(box.type)) {
			if (box.type==2 || box.type==20) {
				q1++;
				if (isFrozen(matrix, box)) {
					f1++;
				}
			}
			if (box.type==21) {
				q2++;
				if (isFrozen(matrix, box)) {
					f2++;
				}
			}
			if (box.type==22) {
				q3++;
				if (isFrozen(matrix, box)) {
					f3++;
				}
			}
		}
	});
	var max = Math.max(q1, Math.max(q2, q3));
	var frozen = (q1>1 && q1==f1) || (q2>1 && q2==f2) || (q3>1 && q3==f3);
	return {max:max, frozen:frozen};
}

function isFrozen (matrix, elem) {
	function isFrosenSide(side) {
		if (canGoFromDirection(elem.prev.type.dir, side)) {
			return matrixIsBlocked (matrix, side, elem.x, elem.y);
		}
		return true;
	}

	if (elem.prev && elem.prev.type.value==5) {
		return  isFrosenSide (Phaser.LEFT) && 
				isFrosenSide (Phaser.RIGHT) &&
				isFrosenSide (Phaser.DOWN) &&
				isFrosenSide (Phaser.UP);
	}
	return false;
}

function updateDoors(matrix) {
	matrix.doors.forEach(function(box){
		box.type.state = (box.type.state+1)%2;
		box.box.frame=box.type.state;
	});
}

function checkTeleport(matrix, x, y) {
	if (matrix[y][x].prev && matrix[y][x].prev.type.value==6) {
		if (!matrix[y][x].teleported) {	
			var elem = findTeleport(matrix, x, y);
			if (elem) {
				matrix[y][x].teleported = true;
				var tempSecondTeleport = matrix[elem.y][elem.x];
				matrix[elem.y][elem.x] = matrix[y][x];
				matrix[y][x] = matrix[y][x].prev;
				matrix[elem.y][elem.x].prev = tempSecondTeleport;
				matrix[elem.y][elem.x].x = elem.x;
				matrix[elem.y][elem.x].y = elem.y;
				if (matrix.visual)  matrix.visual.toTeleport.push({from: {x:x, y:y}, elem:matrix[elem.y][elem.x]});
			}
		} 
	}
}

function findTeleport(matrix, x, y) {
	var box = matrix[y][x].prev;
	var res;
	matrix.ports.forEach (function(elem){
		if (box.type.id==elem.type.id && box!=elem)
			if(matrix[elem.y][elem.x]==elem)
				res =  elem;
	});
	return res;
}

function moveRobots(matrix) {
	matrix.robots.forEach (function(elem){
		if (!elem.startX) {
			elem.startX = elem.x;
			elem.startY = elem.y;
			elem.path = elem.type.path;
		} else {
			elem.cycle = elem.startX==elem.x && elem.startY==elem.y;
		}

		if (!elem.path && elem.cycle) {				
			elem.path = elem.type.path;
		}

		var side = parseInt(elem.path.charAt(0));
		if (!matrixIsBlocked(matrix, side, elem.x, elem.y)) {
			matrixMove(matrix, elem.x, elem.y, side);
			elem.path = elem.path.substring(1);
		}
	});	
}

function spinArrows(matrix) {
	matrix.arrows.forEach (function(elem){
		if (elem.type.spin=="cw") {
			elem.type.dir = getDirCW (elem.type.dir);
		} else if (elem.type.spin=="ccw") {
			elem.type.dir = getDirCCW (elem.type.dir);
		}
	});	
}

