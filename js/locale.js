(function(exports) {
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
			FAILED: "failed",
			TUTORIAL_0: 'Swipe to move green boxes',
			TUTORIAL_1: 'Connect green boxes using walls',
			TUTORIAL_3: 'Beware of white points',
			TUTORIAL_4: "more boxes  it is not a problem",
			LANGUAGE: "language",
			OK:"ok",
			END_GAME: "You got it!",
			END_GAME_TEXT: "This was the last level. Thank you for playing."
		},
		uk: {
			SELECT_LEVEL: "рiвнi",
			PAUSED: "лобi",
			CONTINUE: "продовжити",
			REPLAY: "спочатку",
			LEVELS: "рiвнi",
			MENU: "меню",
			COMPLETED: "перемога",
			NEXT_LEVEL: "наступний",
			FAILED: "зрада",
			TUTORIAL_0: 'Керуйте зеленими квадратиками за допомогою свайпiв',
			TUTORIAL_1: "Використовуйте стiни, щоб сполучати зеленi квадрати",
			TUTORIAL_3: 'Оберiгайтесь шипiв',
			TUTORIAL_4: "Квадратiв багато не бува",
			LANGUAGE: "мова",
			OK:"добре",
			END_GAME: "Молодець!",
			END_GAME_TEXT: "Це був останнiй рiвень. Дякую за гру."
		},
		ru: {
			SELECT_LEVEL: "уровни",
			PAUSED: "опции",
			CONTINUE: "продолжить",
			REPLAY: "заново",
			LEVELS: "уровни",
			MENU: "меню",
			COMPLETED: "победа",
			NEXT_LEVEL: "следующий",
			FAILED: "неудача",
			TUTORIAL_0: 'Делая свайп ты двигаешь квадраты',
			TUTORIAL_1: "Используй стены, чтобы объединить квадраты",
			TUTORIAL_3: 'Бойся шипов!',
			TUTORIAL_4: "Два квадрата слишком скучно?",
			LANGUAGE: "язык",
			OK:"хорошо",
			END_GAME: "Умница!",
			END_GAME_TEXT: "Это был последний уровень. Спасибо за игру."
		}
	};
	exports.setLocale = function (loc) {
		Data.setLocale(loc);
		exports.LOCALE = locales[loc];
	};
	exports.getLocale = function () {
		return Data.locale;
	};
	exports.getLocales = function () {
		return Object.keys(locales);
	};
	exports.LOCALE = locales["en"];
})(window);