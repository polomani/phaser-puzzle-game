function readImage(file)
{
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var img = new Image();

	img.onload = function() {
		context.drawImage(img, 0, 0);
		var myData = context.getImageData(0, 0, 1, 1);
		alert (rgbToHex(myData.data[0], myData.data[1], myData.data[2]));
	};
	img.src = file;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//readImage ("assets/levels/level1.png");