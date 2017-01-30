(function(exports) {
	var locales = {
		en: {
			SELECT_LEVEL: "levels",
			PAUSED: "paused",
			CONTINUE: "continue",
			REPLAY: "replay",
			LEVELS: "levels",
			MENU: "menu",
			COMPLETED: "solved",
			NEXT_LEVEL: "next lvl",
			FAILED: "failed",
			TUTORIAL_0: 'Use arrow keys to move green boxes',
			TUTORIAL_1: 'Connect boxes using walls',
			TUTORIAL_2: 'Find the way through a maze',
			TUTORIAL_3: "beware of spikes",
			TUTORIAL_4: 'Arrows restrict movements',
			TUTORIAL_5: "use arrows to block up boxes",
			TUTORIAL_6: "more boxes is not a problem",
			TUTORIAL_7: "press spacebar to replay",
			LANGUAGE: "language",
			OK:"okay",
			END_GAME: "You got it!",
			END_GAME_TEXT: "PLay more levels on your mobile device",
			NOTIFICATION: "Quady is waiting for you!",
			RATE_TITLE:'Rate Quady',
			RATE_TEXT:'If you enjoy using Quady, would you mind taking a moment to rate it? It won’t take more than a minute.\nThanks for your support!',
			RATE_CANCEL:"No, Thanks",
			RATE_LATER:"Remind Me Later",
			RATE_NOW:"Rate It Now",
			TRY_MOBILE:"PLay more levels\non your mobile device",
			PRESS_SPACE:"Press SPACE to play"
		},
		uk: {
			SELECT_LEVEL: "рiвнi",
			PAUSED: "лобi",
			CONTINUE: "назад",
			REPLAY: "спочатку",
			LEVELS: "рiвнi",
			MENU: "меню",
			COMPLETED: "перемога",
			NEXT_LEVEL: "далi",
			FAILED: "зрада",
			TUTORIAL_0: 'Рухай зеленi квадрати стрiлками на клавiатурi',
			TUTORIAL_1: "Використовуй стiни, щоб сполучати квадрати",
			TUTORIAL_2: 'Знаходь шлях в лабiринтi',
			TUTORIAL_3: 'Не потрапляй на шипи',
			TUTORIAL_4: 'Стрiлки обмежують твiй рух',
			TUTORIAL_5: "Блокуй квадрати стрiлками",
			TUTORIAL_6: "Квадратiв бува i бiльше",
			TUTORIAL_7: "Натисни ПРОБIЛ, щоб переграти",
			LANGUAGE: "   мова   ",
			OK:"добре",
			END_GAME: "Молодець!",
			END_GAME_TEXT: "Бiльше рiвнiв доступно на смартфонах",
			NOTIFICATION: "Quady хоче гратися з тобою!",
			RATE_TITLE:"Оцiнити Quady",
			RATE_TEXT: "Якщо Вам подобається користуватися Quady, чи не будете Ви заперечувати проти того, щоб придiлити хвилинку та оцiнити її?\nСпасибi вам за пiдтримку!",
			RATE_CANCEL:"Нi, дякую",
			RATE_LATER:"Нагадати потiм",
			RATE_NOW:"Оцiнити зараз",
			TRY_MOBILE:"Бiльше рiвнiв\nдоступно на смартфонах",
			PRESS_SPACE:"Натиснiть ПРОБIЛ, щоб грати"
		},
		ru: {
			SELECT_LEVEL: "уровни",
			PAUSED: "опции",
			CONTINUE: "назад",
			REPLAY: "заново",
			LEVELS: "уровни",
			MENU: "меню",
			COMPLETED: "победа",
			NEXT_LEVEL: "дальше",
			FAILED: "неудача",
			TUTORIAL_0: 'Двигай зеленые квадраты стрелками на клавиатуре',
			TUTORIAL_1: "Используй стены, чтобы объединять квадраты",
			TUTORIAL_2: 'Ищи путь в лабиринте',
			TUTORIAL_3: 'Не ходи по шипам',
			TUTORIAL_4: 'Стрелки ограничат движение',
			TUTORIAL_5: "Блокируй квадраты стрелками",
			TUTORIAL_6: "Квадратов бывает больше",
			TUTORIAL_7: "Нажми пробел, чтобы переиграть",
			LANGUAGE: "   язык   ",
			OK:"окей",
			END_GAME: "Умница!",
			END_GAME_TEXT: "Больше уровней доступно на смартфонах",
			NOTIFICATION: "Quady ждет тебя!",
			RATE_TITLE:"Оцените Quady",
			RATE_TEXT:"Если Вам нравится пользоваться Quady, не будете ли Вы возражать против того, чтобы уделить минуту и оценить его?\nСпасибо вам за поддержку!",
			RATE_CANCEL: "Нет, спасибо",
			RATE_LATER: "Напомнить позже",
			RATE_NOW: "Оценить сейчас",
			TRY_MOBILE:"Больше уровней\nдоступно на смартфонах",
			PRESS_SPACE:"Нажми пробел, чтобы играть"
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