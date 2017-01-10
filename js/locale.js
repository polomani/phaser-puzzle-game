(function(exports) {
	var locales = {
		en: {
			SELECT_LEVEL: "select a level",
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
			TUTORIAL_2: 'Find the way through a maze',
			TUTORIAL_3: "beware of spikes",
			TUTORIAL_4: 'Arrows let you go only in one direction',
			TUTORIAL_5: "use arrows to block up green boxes",
			TUTORIAL_6: "more boxes is not a problem",
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
			TUTORIAL_0: 'Керуй зеленими квадратами за допомогою свайпiв',
			TUTORIAL_1: "Використовуй стiни, щоб сполучати зеленi квадрати",
			TUTORIAL_2: 'Знаходь шлях в лабiринтi',
			TUTORIAL_3: 'Не швендяй по шипах, це боляче!',
			TUTORIAL_4: 'Вказiвники пропустять тебе тiльки в один бiк',
			TUTORIAL_5: "Використовуй вказiвники, щоб блокувати зеленi квадрати",
			TUTORIAL_6: "Квадратiв може бути бiльше",
			LANGUAGE: "   мова   ",
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
			TUTORIAL_0: 'Используй свайпы, чтобы двигать квадраты',
			TUTORIAL_1: "Используй стены, чтобы объединять квадраты",
			TUTORIAL_2: 'Ищи путь в лабиринте',
			TUTORIAL_3: 'Не ходи по шипам!',
			TUTORIAL_4: 'Указатели пропустят тебя только в одну сторону',
			TUTORIAL_5: "Блокируй квадраты с помощью стрелок",
			TUTORIAL_6: "Квадратов может быть и больше",
			LANGUAGE: "   язык   ",
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