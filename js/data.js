
(function(exports){

	exports.completedLevels = 0;
	exports.newbie = 1;
	exports.locale = "en";
	exports.notification = Date.now();
	exports.rated = 1;
	var db = null;

	exports.load = function() {
		db = window.localStorage;
		onDatabaseOpen();
	}

	exports.notificate = function(time) {
		exports.notification = time;
		if (db) {
			updateData("notification", exports.notification);
		}
	}

	exports.rateFlag = function(flag) {
		exports.rated = flag;
		if (db) {
			updateData("rated", exports.rated);
		}
	}

	exports.checkIn = function() {
		exports.newbie = 0;
		if (db) {
			updateData("newbie", exports.newbie);
		}
	}

	exports.setLocale = function(locale) {
		exports.locale = locale;
		if (db) {
			updateData("locale", exports.locale);
		}
	}

	exports.setCompletedLevels = function(number) {
		if (number > exports.completedLevels) {
			exports.completedLevels = number;
			if (db) {
				updateData("completedLevels", number);
			}
		}
	}

	function onDatabaseOpen () {
		getData();
	}

	function getData() {
		if (!db.getItem("newbie")) {
			putEmptyData ();
		}

		exports.completedLevels = db.getItem('completedLevels');
		exports.newbie =  db.getItem('newbie');
		exports.locale =  db.getItem('locale');
		exports.notification =  db.getItem('notification');
		exports.rated =  db.getItem('rated');

		setLocale(Data.locale);
	    Puzzle.game.state.start('MainMenu');
	}

	function putData(key, value) {
	    db.setItem(key, value);
	}

	function putEmptyData() {
		putData("completedLevels", exports.completedLevels);
		putData("locale", exports.locale);
		putData("newbie", exports.newbie);
		putData("notification", exports.notification);
		putData("rated", exports.rated);
	}

	function updateData(key, value) {
		db.setItem(key, value);
	}

})(window.Data = {});

function debug(message) {
	var firebase = new Firebase("https://puzzle-lvl-editor-dev.firebaseio.com/gebug");
	var firebaseData = {};
	firebaseData[new Date().toUTCString().slice(5, 25)] = message;
	firebase.push(firebaseData);
}