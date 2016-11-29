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
			END_GAME_TEXT: "This was the last level. Thank you for playing.",
			NOTIFICATION: "Quady is waiting for you!",
			RATE_TITLE:'Rate Quady',
			RATE_TEXT:'If you enjoy using Quady, would you mind taking a moment to rate it? It won’t take more than a minute.\nThanks for your support!',
			RATE_CANCEL:"No, Thanks",
			RATE_LATER:"Remind Me Later",
			RATE_NOW:"Rate It Now"
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
			END_GAME_TEXT: "Це був останнiй рiвень. Дякую за гру.",
			NOTIFICATION: "Quady хоче гратися з тобою!",
			RATE_TITLE:"Оцінити Quady",
			RATE_TEXT: "Якщо Вам подобається користуватися Quady, чи не будете Ви заперечувати проти того, щоб приділити хвилинку та оцінити її?\nСпасибі вам за підтримку!",
			RATE_CANCEL:"Ні, дякую",
			RATE_LATER:"Нагадати пізніше",
			RATE_NOW:"Оцінити зараз"
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
			END_GAME_TEXT: "Это был последний уровень. Спасибо за игру.",
			NOTIFICATION: "Quady ждет тебя!",
			RATE_TITLE:"Оцените Quady",
			RATE_TEXT:"Если Вам нравится пользоваться Quady, не будете ли Вы возражать против того, чтобы уделить минуту и оценить его?\nСпасибо вам за поддержку!",
			RATE_CANCEL: "Нет, спасибо",
			RATE_LATER: "Напомнить позже",
			RATE_NOW: "Оценить сейчас"
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