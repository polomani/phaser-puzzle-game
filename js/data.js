
(function(exports){

	exports.completedLevels = 0;
	exports.newbie = 1;
	exports.locale = "en";
	exports.notification = Date.now();
	exports.rated = 1;
	exports.music = 1;
	var db = null;

	exports.load = function() {
		db = window.localStorage;
		onDatabaseOpen();
	}

	exports.notificate = function(time) {
		exports.notification = time;
		updateData("notification", exports.notification);
	}

	exports.rateFlag = function(flag) {
		exports.rated = flag;
		updateData("rated", exports.rated);
	}

	exports.checkIn = function() {
		exports.newbie = 0;
		updateData("newbie", exports.newbie);
	}

	exports.setLocale = function(locale) {
		exports.locale = locale;
		updateData("locale", exports.locale);
	}

	exports.setCompletedLevels = function(number) {
		if (number > exports.completedLevels) {
			exports.completedLevels = number;
			updateData("completedLevels", number);
		}
	}

	exports.toggleMusic = function() {
		if (exports.music == 0) 
			exports.music = 1;
		else 
			exports.music = 0;
		updateData("music", exports.music);
	}

	function onDatabaseOpen () {
		getData();
	}

	function getData() {
		if (db) {
			if (!db.getItem("newbie")) {
				putEmptyData ();
			}

			exports.completedLevels = db.getItem('completedLevels');
			exports.newbie =  db.getItem('newbie');
			exports.locale =  db.getItem('locale');
			exports.notification =  db.getItem('notification');
			exports.rated =  db.getItem('rated');
			exports.music =  db.getItem('music') || exports.music;

			setLocale(Data.locale);
		}
	    Puzzle.game.state.start('MainMenu');
	}

	function putData(key, value) {
		if (db)
	    	db.setItem(key, value);
	}

	function putEmptyData() {
		putData("completedLevels", exports.completedLevels);
		putData("locale", exports.locale);
		putData("newbie", exports.newbie);
		putData("notification", exports.notification);
		putData("rated", exports.rated);
		putData("music", exports.music);
	}

	function updateData(key, value) {
		if (db)
			db.setItem(key, value);
	}

})(window.Data = {});

function debug(message) {
	var firebase = new Firebase("https://puzzle-lvl-editor-dev.firebaseio.com/gebug");
	var firebaseData = {};
	firebaseData[new Date().toUTCString().slice(5, 25)] = message;
	firebase.push(firebaseData);
}