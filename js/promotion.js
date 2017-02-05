(function(exports) {
	function period () {
		if (Data.completedLevels < 10) {
			return false;
		}
		return (new Date().getTime() - showed) > 1000 * 60;
	}
	var showed = new Date().getTime();
	var interstitial;
	var IOS_RATING_URL = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=[  ID  ]";
	var ANDROID_RATING_URL = "market://details?id=cc.dreamlike.quady";

	exports.init = function () {

		initNotification();
	    initRateMe();

		if (window.Cocoon && window.Cocoon.Ad) {
	        Cocoon.Ad.AdMob.configure({
	            android: {
	              interstitial:"ca-app-pub-9147936306521137/8577493605"
	            }
	        });
	        initInterstitial();
    	}
	}

	initRateMe = function() {
		if (navigator && navigator.notification && window.Cocoon && !Data.logged) {
			Data.logged = true;
			function onConfirm(buttonIndex) {
				var ratingURL = null;
				if (/ios/.test(navigator.userAgent))
					ratingURL = IOS_RATING_URL;
				else if (/android/.test(navigator.userAgent))
					ratingURL = ANDROID_RATING_URL;

				switch (buttonIndex) {
					case 0:
						later();
					break;
					case 1:
						cancel();
					break;
					case 2:
						later();
					break;
					case 3:
						rate();
					break;
				}
				function cancel () {
					Data.rateFlag(-1);
				}
				function later () {
					Data.rateFlag(1);
				}
				function rate () {
					Cocoon.App.openURL(ratingURL);
					Data.rateFlag(0);
				}
			}
			if (Data.rated>=3) {
				navigator.notification.confirm(
				    LOCALE.RATE_TEXT,
				    onConfirm,
				    LOCALE.RATE_TITLE,
				    [LOCALE.RATE_CANCEL, LOCALE.RATE_LATER, LOCALE.RATE_NOW]
				);
			} else if (Data.rated>0) {
				Data.rateFlag(Data.rated+1);
			}
		}
	}

	initNotification = function() {
		if (window.Cocoon && Cocoon.Notification && Cocoon.Notification.Local && Data.completedLevels < 40 && Data.notification <= Date.now()) {
	      	Cocoon.Notification.Local.initialize({}, function(registered, error) {
	      		if (registered && !error) {
		      		Cocoon.Notification.Local.cancelAllNotifications();
		          	var notification = {
		          		message : LOCALE.NOTIFICATION,
		          		date : (Date.now() + 1000*60*60*24*5).toFixed()
		        	};
			        Data.notificate(notification.date);
			        Cocoon.Notification.Local.send(notification);
		    	}
	      	});
	    }
	} 

	initInterstitial = function () {
		if (!interstitial) {
			console.log("loading interstitial");
			interstitial = Cocoon.Ad.AdMob.createInterstitial();
	        interstitial.on("load", function(){
	        	interstitial.ready = true;
	          	console.log("interstitial loaded");
	        });
	        interstitial.on("fail", function(){
	           	console.log("interstitial failed");
	        });
	        interstitial.on("show", function(){
	          	console.log("Interstitial shown");
	        });
	        interstitial.on("dismiss", function(){
			   	console.log("Interstitial dismissed");
			}); 
			interstitial.on("click", function(){
			   	console.log("Interstitial clicked");
			});
	        interstitial.load();
    	}
	}

	exports.openShare = function(lvl) {
		var options = {
		  message: LOCALE.SHARE_TEXT.replace("%", Data.completedLevels),
		  files: [game.cache.getText('share')],
		  url: "https://play.google.com/store/apps/details?id=cc.dreamlike.quady",
		  chooserTitle: LOCALE.SHARE
		}

		var onSuccess = function(result) {
		  console.log("Share completed? " + result.completed);
		  console.log("Shared to app: " + result.app);
		}

		var onError = function(msg) {
		  console.log("Sharing failed with message: " + msg);
		}

		if (window.plugins && window.plugins.socialsharing) {
			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
		}
	} 

	exports.showInterstitial = function() {
		if (window.Cocoon && window.Cocoon.Ad && period()) {
			if (interstitial && interstitial.ready) {
				showed = new Date().getTime();
				interstitial.show();
				interstitial = null;
				initInterstitial();
			}
		}
	} 

})(window.Promotion={});