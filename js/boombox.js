(function (exports) {

	var ambient;

	exports.init = function () {

		if(window.plugins && plugins.NativeAudio && !ambient) {
			plugins.NativeAudio.preloadComplex('ambient', 'assets/audio/ambient.ogg', 1, 1, 0, 
			function(){
		    	ambient = true;
		        if (exports.isMusic()) {
		        	plugins.NativeAudio.loop('ambient', function(msg){
				    	alert("success1"+JSON.stringify(msg));
				    }, function (msg) {
				    	alert(JSON.stringify(msg));
				    });
		        }
		    });
		}
	}

	exports.isMusic = function () {
		return (Data.music == 1);
	}

	exports.toggleMusic = function () {
		Data.toggleMusic();
		if (exports.isMusic()) {
			plugins.NativeAudio.loop('ambient');
		} else {
			plugins.NativeAudio.stop('ambient');
		}
	}
})(window.Boombox={});