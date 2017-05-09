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

function isBlueBox (id) {
	return (typeof id === 'number') && (id==2 || Math.floor(id/10)==2);
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
	game.solution = game.solution.replace (new RegExp(Phaser.UP, 'g'), "u-");
	game.solution = game.solution.replace (new RegExp(Phaser.DOWN, 'g'), "d-");
	game.solution = game.solution.replace (new RegExp(Phaser.LEFT, 'g'), "l-");
	game.solution = game.solution.replace (new RegExp(Phaser.RIGHT, 'g'), "r-");
	data[game.solution] = new Date().toUTCString().slice(5, 25) + " =" + game.solution.length/2;
	firebase.update(data);
}
