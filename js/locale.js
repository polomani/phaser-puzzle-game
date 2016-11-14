(function(exports) {
	var locale = "uk";
	var locales = {
		en: {
			SELECT_LEVEL: "select level",
			PAUSED: "paused",
			CONTINUE: "continue",
			REPLAY: "replay",
			LEVELS: "levels",
			MENU: "menu",
			COMPLETED: "completed",
			NEXT_LEVEL: "next level",
			FAILED: "failed"
		},
		uk: {
			SELECT_LEVEL: "вибрати рiвень",
			PAUSED: "лобi",
			CONTINUE: "продовжити",
			REPLAY: "спочатку",
			LEVELS: "рiвнi",
			MENU: "меню",
			COMPLETED: "перемога",
			NEXT_LEVEL: "наступний",
			FAILED: "зрада"
		},
		ru: {
			SELECT_LEVEL: "выбор уровня",
			PAUSED: "опции",
			CONTINUE: "продолжить",
			REPLAY: "заново",
			LEVELS: "уровни",
			MENU: "меню",
			COMPLETED: "победа",
			NEXT_LEVEL: "следующий уровень",
			FAILED: "неудача"
		}
	};
	exports.setLocale = function (loc) {
		exports.LOCALE = locales[loc];
		locale = loc;
	};
	exports.getLocale = function () {
		return locale;
	};
	exports.getLocales = function () {
		return Object.keys(locales);
	};
	exports.setLocale("en");
})(window);