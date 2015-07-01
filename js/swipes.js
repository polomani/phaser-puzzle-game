//код від Emanuele Feronato 
//крутий чувак, хоч і макаронник)
var startX;
var startY;
var endX;
var endY;

function beginSwipe(){
	startX = game.input.x;
	startY = game.input.y;
	game.input.onDown.remove(beginSwipe);
	game.input.onUp.add(endSwipe);
	game.input.addMoveCallback(swiping);
}

//#ivano polomani
function swiping (){
	var distX = startX-game.input.x;
	var distY = startY-game.input.y;
	if (Math.sqrt(distX*distX+distY*distY) > 100)
		endSwipe();
}

function endSwipe(){
	// saving mouse/finger coordinates
	endX = game.input.x;
	endY = game.input.y;
	// determining x and y distance travelled by mouse/finger from the start
	// of the swipe until the end
	var distX = startX-endX;
	var distY = startY-endY;
	// in order to have an horizontal swipe, we need that x distance is at least twice the y distance
	// and the amount of horizontal distance is at least 10 pixels
	if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10){
		// moving left, calling move function with horizontal and vertical tiles to move as arguments
		if(distX>0){
			step(game.keyLEFT);
		}
		// moving right, calling move function with horizontal and vertical tiles to move as arguments
		else{
			step(game.keyRIGHT);
		}
	}
	// in order to have a vertical swipe, we need that y distance is at least twice the x distance
	// and the amount of vertical distance is at least 10 pixels
	if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>10){
		// moving up, calling move function with horizontal and vertical tiles to move as arguments
		if(distY>0){
			step(game.keyUP);
		}
		// moving down, calling move function with horizontal and vertical tiles to move as arguments
		else{
			step(game.keyDOWN);
		}
	}
	if (Math.abs(distY)<10 && Math.abs(distX)<10){
		//tap
	}
	// stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
	game.input.onDown.add(beginSwipe);
	game.input.onUp.remove(endSwipe);
	game.input.deleteMoveCallback(0);
}