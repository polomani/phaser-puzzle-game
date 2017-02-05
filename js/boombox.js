(function (exports) {
	exports.isMusic = function () {
		return (Data.music == 1);
	}

	exports.toggleMusic = function () {
		Data.toggleMusic();
	}
})(window.Boombox={});