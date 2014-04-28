/* TresReges / Adam Duncan / 2014-04-29 */
(function ($) {

	var $event = $.event,
		$special,
		resizeTimeout;

	$special = $event.special.debouncedresize = {
		setup: function () {
			$(this).on("resize", $special.handler);
		},
		teardown: function () {
			$(this).off("resize", $special.handler);
		},
		handler: function (event, execAsap) {
			// Save the context
			var context = this,
				args = arguments,
				dispatch = function () {
					// set correct event type
					event.type = "debouncedresize";
					$event.dispatch.apply(context, args);
				};

			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}

			execAsap ?
				dispatch() :
				resizeTimeout = setTimeout(dispatch, $special.threshold);
		},
		threshold: 50
	};

})(jQuery);
jQuery.extend(jQuery.easing, {
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	}
});
var AppSettings = {
	DEBUGMODE: true, //change to turn on/off console.log statements
	scrollPos: 0,
	easing: 'easeOutQuad'
};

var Debug = {

	log: function (value) {
		/// <summary>Wrapper for console.log to enable intellisense</summary>
		/// <param name="str" type="String">Value to log in the console</param>
		if (AppSettings.DEBUGMODE) {
			if (typeof(value) === 'object') {
				try { console.log(value); }
				catch (e) { }
			} else {
				try { console.log('%c' + value, 'color: blue;'); }
				catch (e) { }
			}
		}
	},

	time: function (str) {
		/// <summary>Wrapper for console.log to enable intellisense</summary>
		/// <param name="str" type="String">Value to log in the console</param>
		if (AppSettings.DEBUGMODE) {
			try { console.time(str); }
			catch (e) { }
		}
	},

	timeEnd: function (str) {
		/// <summary>Wrapper for console.log to enable intellisense</summary>
		/// <param name="str" type="String">Value to log in the console</param>
		if (AppSettings.DEBUGMODE) {
			try { console.timeEnd(str); }
			catch (e) { }
		}
	}

};

var Layout = {

	sectionSelector: '[data-section]',

	init: function() {
		$(Layout.sectionSelector).each(function() {
			var $this = $(this);
			$this.css('height', Utils.viewportHeight);
		});
	}

};

var Menu = {

	selector: '[data-menu]',
	sectionSelector: '[data-section]',
	sectionArray: [],
	currentClass: 'current',

	init: function() {
		Menu.bindClickEvent();
	},

	bindClickEvent: function () {
		$(Menu.selector + ' > li > a').on('click', function(e) {
			Utils.smoothScroll($(this).attr('href'));
			e.preventDefault();	
		});
	},

	storeSectionArray: function() {
		// clear array 
		Menu.sectionArray.length = 0;
		// loop through and create new object for each section, pushing to array
		$(Menu.sectionSelector).each(function() {
			var $this = $(this),
				sectionTop = $this.position().top,
				sectionBottom = sectionTop + $this.outerHeight(),
				obj = {
					top: sectionTop,
					bottom: sectionBottom
				};

			Menu.sectionArray.push(obj);

		});
	},

	highlightCurrent: function() {
		for (var i=0;  i < Menu.sectionArray.length; i++) {
			if (Menu.sectionArray[i].top <= Utils.scrollPos && Menu.sectionArray[i].bottom-1 >= Utils.scrollPos) {
				$('li:nth-child(' + (i+1) + ') > a', $(Menu.selector)).addClass(Menu.currentClass);
			} else {
				$('li:nth-child(' + (i+1) + ') > a', $(Menu.selector)).removeClass(Menu.currentClass);
			}
		}
	}

};

var Video = {

    selector: '[data-video]',
    anchorSelector: '[data-video-anchor]',
    videoIdAttr: 'data-video-id',
    frameSelector: '[data-video-frame]',
    frameUrl: '//player.vimeo.com/video/',
    frameQuery: '?title=0&amp;byline=0&amp;portrait=0&amp;color=bababa&amp;autoplay=1&amp;api=1',

    init: function () {
        Video.bindClickEvent();
    },

    bindClickEvent: function () {
        $(Video.anchorSelector).on('click', function (e) {
            var $this = $(this).parent();

            Video.loadVideo($this);
            e.preventDefault();
        });
    },

    loadVideo: function ($this) {
        var videoId = $this.attr(Video.videoIdAttr),
			videoHeight = $(Video.anchorSelector, $this).find('img').height();
        $(Video.frameSelector, $this).stop().animate({ 'opacity': 0 }, 0).show().find('iframe').attr({ 'src': Video.frameUrl + videoId + Video.frameQuery, 'height': videoHeight });
        Video.showVideo($this);
    },

    showVideo: function ($this) {
        $(Video.anchorSelector, $this).stop().animate({ 'opacity': 0 }, 200, function () {
            $(Video.frameSelector, $this).show().stop().animate({ 'opacity': 1 }, 200);
        });
    },

    pauseVideo: function () {
        var videoObject = $('.js_video_frame', '.js_showreel')[0],
            videoSrc = $(videoObject).attr('src');

        if (videoSrc !== '') {
            // frogaloop
            // http://css-tricks.com/play-button-youtube-and-vimeo-api/
            $f(videoObject).api('pause');
        }

    }
};

var Utils = {

	viewportHeight: 0,
	scrollPos: 0,

	bindResizeEvent: function() {
		$(window).on('load debouncedresize', function() {
			Utils.resizeEvents();
		});
	},

	resizeEvents: function() {
		Utils.setViewportHeight();
		Layout.init();
		Menu.storeSectionArray();
		Menu.highlightCurrent();
	},

	bindScrollEvent: function() {
		$(window).on('load scroll', function() {
			Utils.scrollEvents();
		});
	},

	scrollEvents: function() {
		Utils.setScrollPos();
		Menu.highlightCurrent();
	},

	setViewportHeight: function() {
		Utils.viewportHeight = $(window).height();
	},

	setScrollPos: function() {
		Utils.scrollPos = $(window).scrollTop();
	},

	smoothScroll: function(id) {
		$('html, body').stop().animate({
			scrollTop: $(id).offset().top
		}, 600, AppSettings.easing);
	}

};

var Main = {

	run: function () {
		Utils.bindResizeEvent();
		Utils.bindScrollEvent();
		Utils.setViewportHeight();
		Layout.init();
		Menu.bindClickEvent();
		Video.init();
	}

};

$(document).ready(Main.run());