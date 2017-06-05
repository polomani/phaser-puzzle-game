function getAngleToAnimate (cur_angle, dir, invert) {
    var angle = getNormalOrInvertedAngleFromDir(dir, invert) - cur_angle;
    if (angle > 180) angle = angle - 360;
    else if (angle < -180) angle = 360 + angle;
    return angle;
}

function swapDeepElement(matrix, x, y) {
    var cell = matrix[y][x];
    if (cell.prev) {
        matrix[y][x] = cell.prev;
        matrix[y][x].prev = cell;
        delete matrix[y][x].prev.prev;
    }
}

function matrixToLevel (matrix) {
    var lvl = [];
    for (var y = 0; y < matrix.length; y++) {
        lvl[y]=[];
		for (var x = 0; x < matrix[y].length; x++) {
			if (matrix[y][x]) {
                lvl[y][x] = deepClone(matrix[y][x].type);
                if (matrix[y][x].prev) {
                    lvl[y][x] = { deep:true, type:lvl[y][x], prev:deepClone (matrix[y][x].prev.type) };
                }
            } else {
                lvl[y][x]=0; 
            }
		}
	}
    return lvl;
}

function matrixToString (matrix) {
	var s = "";
	for (var y = 0; y < matrix.length; y++) {
		for (var x = 0; x < matrix[y].length; x++) {
			if (matrix[y][x]) 
				s+= (matrix[y][x].type.value ? matrix[y][x].type.value : (matrix[y][x].type>=20) ? Math.round(matrix[y][x].type/10) : matrix[y][x].type) + ' ';
			else
				s+='  ';
		}
		s+='\n';
	}
	return s;
}

function matrixDel(matrix, x, y){
	if (matrix[y][x].prev) {
		matrix[y][x] = matrix[y][x].prev;
	} else {
		matrix[y][x] = undefined;
	}
};

function matrixLeft(matrix){
	matrixMoveAll(matrix, Phaser.LEFT);
};

function matrixRight(matrix){
	matrixMoveAll(matrix, Phaser.RIGHT);
};

function matrixUp(matrix){
	matrixMoveAll(matrix, Phaser.UP);
};

function matrixDown(matrix){
	matrixMoveAll(matrix, Phaser.DOWN);
};

function matrixSortFunction (side) {
	switch (side) {
		case Phaser.LEFT:
			return matrixSortFunctionLeft;
		case Phaser.RIGHT:
			return matrixSortFunctionRight;
		case Phaser.UP:
			return matrixSortFunctionUp;
		case Phaser.DOWN:
			return matrixSortFunctionDown;
	}
}

function matrixSortFunctionUp(a, b) {
	var c = a.x-b.x;
	if (c==0)
		c =  a.y-b.y;
	return c;
}

function matrixSortFunctionDown(a, b) {
	var c = a.x-b.x;
	if (c==0)
		c = b.y-a.y;
	return c;
}

function matrixSortFunctionLeft(a, b) {
	var c = a.y-b.y;
	if (c==0)
		c = a.x-b.x;
	return c;
}

function matrixSortFunctionRight(a, b) {
	var c = a.y-b.y;
	if (c==0)
		c = b.x-a.x;
	return c;
}

function isArrow (id) {
	return id && id.value===5;
}

function isWall (id) {
	return id===1;
}

function isBlueBox (id) {
	return (typeof id === 'number') && (id==2 || Math.floor(id/10)==2);
}

function isSokoBox (id) {
	return id===8;
}

function isRoboBox (type) {
	return type && type.value===7 && type.path;
}

function isSpikes (type) {
    return type===3 || isRoboBox (type);
}

function isSameBlueBox(b1, b2) {
	if (isBlueBox(b1) && isBlueBox(b2)) {
		return b1==b2;
	}
	return false;
}

function canGoFromDirection (dirArr, dir) {
	if (dirArr==dir)
		return true;
	return false;
}

function canGoOnDirection (dirArr, dir) {
	if (opp(dirArr)==dir)
		return false;
	return true;
}

function opp(side) {
	switch (side) {
		case Phaser.LEFT:
			return Phaser.RIGHT;
		case Phaser.RIGHT:
			return Phaser.LEFT;
		case Phaser.UP:
			return Phaser.DOWN;
		case Phaser.DOWN:
			return Phaser.UP;
	}
}

function getDirCW (dir) {
	switch (dir) {
		case Phaser.UP:
			return Phaser.RIGHT;
		case Phaser.RIGHT:
			return Phaser.DOWN;
		case Phaser.DOWN:
			return Phaser.LEFT;
		case Phaser.LEFT:
			return Phaser.UP;
	}
}

function getDirCCW (dir) {
	switch (dir) {
		case Phaser.DOWN:
			return Phaser.RIGHT;
		case Phaser.RIGHT:
			return Phaser.UP;
		case Phaser.UP:
			return Phaser.LEFT;
		case Phaser.LEFT:
			return Phaser.DOWN;
	}
}

function getDirFromAngle(angle) {
	switch (angle) {
		case 0:
			return Phaser.RIGHT;
		case 90:
			return Phaser.DOWN;
		case -180:
			return Phaser.LEFT;
		case -90:
			return Phaser.UP;
	}
}

function getNormalOrInvertedAngleFromDir (dir, invert) {
    if (!invert) return o_getAngleFromDir (dir);
    return getInvertedAngleFromDir(dir);
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

function getInvertedAngleFromDir (dir) {
	switch (dir) {
		case Phaser.RIGHT:
			return o_getAngleFromDir(Phaser.DOWN);
		case Phaser.DOWN:
			return o_getAngleFromDir(Phaser.LEFT);
		case Phaser.LEFT:
			return  o_getAngleFromDir(Phaser.UP);
		case Phaser.UP:
			return o_getAngleFromDir(Phaser.RIGHT);
		default :
			return 0;
	}
};

function saveSolutionToFirebase() {
	return;
	var firebase = new Firebase("https://puzzle-lvl-editor-dev.firebaseio.com/levels-solutions").child(Number(Game.aimLVL)+1);
	var data = {};
	game.solution = readableSolution (game.solution);
	data[game.solution] = new Date().toUTCString().slice(5, 25) + " =" + game.solution.length/2;
	firebase.update(data);
}

function readableSolution(s) {
	s = s.replace (new RegExp(Phaser.UP, 'g'), "u-");
	s = s.replace (new RegExp(Phaser.DOWN, 'g'), "d-");
	s = s.replace (new RegExp(Phaser.LEFT, 'g'), "l-");
	s = s.replace (new RegExp(Phaser.RIGHT, 'g'), "r-");
	return s;
}

function deepClone(obj) {
    var visitedNodes = [];
    var clonedCopy = [];
    function clone(item) {
        if (typeof item === "object" && !Array.isArray(item)) {
            if (visitedNodes.indexOf(item) === -1) {
                visitedNodes.push(item);
                var cloneObject = {};
                clonedCopy.push(cloneObject);
                for (var i in item) {
                    if (item.hasOwnProperty(i)) {
                        cloneObject[i] = clone(item[i]);
                    }
                }
                return cloneObject;
            } else {
                return clonedCopy[visitedNodes.indexOf(item)];
            }
        }
        else if (typeof item === "object" && Array.isArray(item)) {
            if (visitedNodes.indexOf(item) === -1) {
                var cloneArray = [];
                visitedNodes.push(item);
                clonedCopy.push(cloneArray);
                // for (var j = 0; j < item.length; j++) {
                //     cloneArray[j] = clone(item[j]);
                // }
                //kkkostil
                for (var i in item) {
                    if (item.hasOwnProperty(i)) {
                        cloneArray[i] = clone(item[i]);
                    }
                }
                return cloneArray;
            } else {
                return clonedCopy[visitedNodes.indexOf(item)];
            }
        }

        return item;
    }
    return clone(obj);
}
