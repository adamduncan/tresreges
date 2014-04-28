
/*
	JS Document for Tres Reges
	Build: Adam Duncan
	Date: April 2014
*/

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
	}

};

$(document).ready(Main.run());