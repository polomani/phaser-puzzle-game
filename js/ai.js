(function (exports) {
    
	exports.findSolution = function (matrix, best) {
		matrix = prepareMatrix(matrix);
		var checked = [];
		var queue = new PriorityQueue({ comparator: function(a, b) { return a.h - b.h; }});
        if (best) {
            queue = [];
            queue.queue = queue.push;
            queue.dequeue = queue.shift;
        }

		queue.queue (matrix);
		var aim;
		while (queue.length > 0) {
			aim = queue.dequeue();
            checked.push(aim);
			var result = checkGameOver(aim); 
			if (result.win) {
                return aim.solution;  
			} else if (!result.fail && !result.frozen) {
				addSolution (aim, Phaser.RIGHT, checked, queue);
				addSolution (aim, Phaser.LEFT, checked, queue);
				addSolution (aim, Phaser.UP, checked, queue);
				addSolution (aim, Phaser.DOWN, checked, queue);
			}
		}
        return "";
	}

	function prepareMatrix (matrix) {
		var res = deepClone(matrix);

		for (var x = 0; x < matrix.length; x++) {
			deleteBoxesInArray (res[x]);
		}

		delete res.visual;
		res.solution = "";
        res.h = heuristic(matrix);

		return res;
	}

	function deleteBoxesInArray (arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]) 
				delete arr[i].box;
		}
	}

	function addSolution (matrix, side, checked, queue) {
		matrix = deepClone (matrix);
		matrixMoveAll(matrix, side);

		if (!contains(matrix, checked)) {
			matrix.solution += '' + side;
            matrix.h = heuristic(matrix);
			queue.queue(matrix);
		}
	}

	contains = function (matrix, array) {
		for (var i = 0; i < array.length; i++) {
			if (compareMatrices(array[i], matrix))
				return true;
		}
		return false;
	}
    
    function heuristic (matrix) {
        function dist (a, b) {
            return (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y); 
        }
        var res = 0;
        var blues = matrix.blueBoxes
        for (var i = 0; i < blues.length; i++) {
            for (var j = i+1; j < blues.length; j++) {
                res+= dist(blues[i], blues[j]);
            }
        }
        return res;
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


	compareMatrices = function (a, b) {
		if (a.length!=b.length || a[0].length !=b[0].length)
			return false;

		for (var y = 0; y < a.length; y++) {
			for (var x = 0; x < a[y].length; x++) {
				if (!compareElements(a[y][x], b[y][x]))
					return false;
			}
		}

		return true;
	}

	compareElements = function (a, b) {
        if (!a || !b) return a===b;
		a = a.type;
		b = b.type;
		if (a instanceof Object) {
			return JSON.stringify(a) === JSON.stringify(b);
		} else {
			return a===b;
		}
	}

})(window.AI={});