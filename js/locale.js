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
			FAILED: "failed",
			TUTORIAL_0: 'Swipe to move\ngreen boxes',
			TUTORIAL_1: 'Connect blue boxes \n by using walls',
			TUTORIAL_3: 'Beware of\nwhite points',
			TUTORIAL_4: "more boxes \nit is not a problem"
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
			FAILED: "зрада",
			TUTORIAL_0: 'Керуйте зеленими квадратиками\n за допомогою свайпiв',
			TUTORIAL_1: "Щоб з'єднати квадрати\n викориситовуйте стiни",
			TUTORIAL_3: 'Оберiгайтесь шипiв',
			TUTORIAL_4: "Не бiйтесь великої\nкількостi квадратiв"
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
			FAILED: "неудача",
			TUTORIAL_0: 'Делая свайп\n ты двигаешь квадраты',
			TUTORIAL_1: "Используй стены\n чтобы объединить квадраты",
			TUTORIAL_3: 'Бойся шипов!',
			TUTORIAL_4: "Два квадрата слишком\nскучно?"
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