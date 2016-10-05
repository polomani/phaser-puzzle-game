
(function(exports){

	exports.completedLevels = 0;
	var db = null;

	exports.load = function() {
		//db = window.sqlitePlugin.openDatabase({name: 'com-dreamlike-puzzle.db', location: 'default'}, onDatabaseOpen);
	}

	exports.setCompletedLevels = function(number) {
		/*if (number > exports.completedLevels) {
			exports.completedLevels = number;
			if (db) {
				updateData("completedLevels", number);
			}
		}*/
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
		putData("completedLevels", 0);
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

document.addEventListener('deviceready', Data.load);