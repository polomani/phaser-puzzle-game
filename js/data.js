
(function(exports){

	exports.completedLevels = 0;
	exports.newbie = 1;
	exports.locale = "en";
	exports.notification = Date.now();
	exports.rated = 1;
	var db = null;

	exports.load = function() {
		db = window.sqlitePlugin.openDatabase({name: 'ccdreamlikequady.db', location: 'default'}, onDatabaseOpen);
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
		db.transaction(function (tx) {
		    tx.executeSql('CREATE TABLE IF NOT EXISTS map (key, value)');
		}, function (error) {
		    console.log('transaction error: ' + error.message);
		}, getData);
	}

	function getData() {
	    db.transaction(function (tx) {

	        var query = "SELECT key, value FROM map";

	        tx.executeSql(query, null, function (tx, resultSet) {
	        	if (resultSet.rows.length>0) {
	        		for(var x = 0; x < resultSet.rows.length; x++) {
	        			Data[resultSet.rows.item(x)["key"]] = resultSet.rows.item(x)["value"];
		            }	        		
	            } else {
	            	putEmptyData();
	            }
	            setLocale(Data.locale);
	            Puzzle.game.state.start('MainMenu');
	        },
	        function (tx, error) {
	            console.log('SELECT error: ' + error.message);
	        });
	    }, function (error) {
	        console.log('transaction error: ' + error.message);
	    }, function () {
	        console.log('transaction ok');
	    });
	    
	}

	function putData(key, value) {
	    db.transaction(function (tx) {
	        var query = "INSERT INTO map (key, value) VALUES (?,?)";

	        tx.executeSql(query, [key, value], function(tx, res) {
	            console.log("insertId: " + res.insertId + " -- probably 1");
	            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
	        },
	        function(tx, error) {
	            console.log('INSERT error: ' + error.message);
	        });
	    }, function(error) {
	        console.log('transaction error: ' + error.message);
	    }, function() {
	        console.log('transaction ok');
	    });
	}

	function putEmptyData() {
		putData("completedLevels", exports.completedLevels);
		putData("locale", exports.locale);
		putData("newbie", exports.newbie);
		putData("notification", exports.notification);
		putData("rated", exports.rated);
	}

	function updateData(key, value) {
		db.transaction(function (tx) {
	        var query = "UPDATE map SET value=? WHERE key=?";

	        tx.executeSql(query, [value, key], function(tx, res) {
	            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
	        },
	        function(tx, error) {
	            console.log('INSERT error: ' + error.message);
	        });
	    }, function(error) {
	        console.log('transaction error: ' + error.message);
	    }, function() {
	        console.log('transaction ok');
	    });
	}

})(window.Data = {});

function debug(message) {
	var firebase = new Firebase("https://puzzle-lvl-editor-dev.firebaseio.com/gebug");
	var firebaseData = {};
	firebaseData[new Date().toUTCString().slice(5, 25)] = message;
	firebase.push(firebaseData);
}