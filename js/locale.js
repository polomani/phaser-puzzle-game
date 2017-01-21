(function(exports) {
	var locales = {
		en: {
			SELECT_LEVEL: "levels",
			PAUSED: "paused",
			CONTINUE: "continue",
			REPLAY: "replay",
			LEVELS: "levels",
			MENU: "menu",
			COMPLETED: "completed",
			NEXT_LEVEL: "next level",
			FAILED: "failed",
			TUTORIAL_0: 'Swipe to move green boxes',
			TUTORIAL_1: 'Connect boxes using walls',
			TUTORIAL_2: 'Find the way through a maze',
			TUTORIAL_3: "beware of spikes",
			TUTORIAL_4: 'Arrows restrict movements',
			TUTORIAL_5: "use arrows to block up boxes",
			TUTORIAL_6: "more boxes is not a problem",
			LANGUAGE: "language",
			OK:"okay",
			END_GAME: "You got it!",
			END_GAME_TEXT: "This was the last level. Thank you for playing.",
			NOTIFICATION: "Quady is waiting for you!",
			RATE_TITLE:'Rate Quady',
			RATE_TEXT:'If you enjoy using Quady, would you mind taking a moment to rate it? It won’t take more than a minute.\nThanks for your support!',
			RATE_CANCEL:"No, Thanks",
			RATE_LATER:"Remind Me Later",
			RATE_NOW:"Rate It Now",
			SHARE:"Share",
			ASK_SHARE:"Not bad! You solved % levels. Whould you like to share this with your friends?",
			SHARE_TEXT:"I have solved % levels in #quady puzzle on #android by @dreamlikegames. It trains my brain"
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
			TUTORIAL_0: 'Рухай зеленi квадрати свайпом',
			TUTORIAL_1: "Сполучай всi квадрати в один",
			TUTORIAL_2: 'Знаходь шлях в лабiринтi',
			TUTORIAL_3: 'Не потрапляй на шипи',
			TUTORIAL_4: 'Стрiлки обмежують твiй рух',
			TUTORIAL_5: "Блокуй квадрати стрiлками",
			TUTORIAL_6: "Квадратiв бува i бiльше",
			LANGUAGE: "   мова   ",
			OK:"добре",
			END_GAME: "Молодець!",
			END_GAME_TEXT: "Це був останнiй рiвень. Дякую за гру.",
			NOTIFICATION: "Quady хоче гратися з тобою!",
			RATE_TITLE:"Оцiнити Quady",
			RATE_TEXT: "Якщо Вам подобається користуватися Quady, чи не будете Ви заперечувати проти того, щоб придiлити хвилинку та оцiнити її?\nСпасибi вам за пiдтримку!",
			RATE_CANCEL:"Нi, дякую",
			RATE_LATER:"Нагадати потiм",
			RATE_NOW:"Оцiнити зараз",
			SHARE:"Подiлитись",
			ASK_SHARE:"Непогано! Ти пройшов % рiвнiв. Хочеш подiлитись рекордом з друзями?",
			SHARE_TEXT:"Пройшов % рiвнiв в головоломцi #quady на #android вiд @dreamlikegames. Спробуйте i ви!"
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
			TUTORIAL_0: 'Двигай квадраты свайпами',
			TUTORIAL_1: "Объедини их в один",
			TUTORIAL_2: 'Ищи путь в лабиринте',
			TUTORIAL_3: 'Не ходи по шипам',
			TUTORIAL_4: 'Стрелки ограничат движение',
			TUTORIAL_5: "Блокируй квадраты стрелками",
			TUTORIAL_6: "Квадратов бывает больше",
			LANGUAGE: "   язык   ",
			OK:"окей",
			END_GAME: "Умница!",
			END_GAME_TEXT: "Это был последний уровень. Спасибо за игру.",
			NOTIFICATION: "Quady ждет тебя!",
			RATE_TITLE:"Оцените Quady",
			RATE_TEXT:"Если Вам нравится пользоваться Quady, не будете ли Вы возражать против того, чтобы уделить минуту и оценить его?\nСпасибо вам за поддержку!",
			RATE_CANCEL: "Нет, спасибо",
			RATE_LATER: "Напомнить позже",
			RATE_NOW: "Оценить сейчас",
			SHARE:"Поделиться",
			ASK_SHARE:"Неплохо! Ты прошел % уровней. Хочешь поделиться рекордом с друзьями?",
			SHARE_TEXT:"Уверенно прохожу уровни в #quady на #android от @dreamlikegames. % - не предел, попробуйте и вы"
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