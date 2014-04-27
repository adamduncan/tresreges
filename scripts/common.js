
/*
	JS Document for the SAS Boilerplate
	Build: SAS Developers on behalf of SAS
	Date: January 2014
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

var Links = {

	selector: '[data-target]',
	targetNewWindow: 'newWindow',
	targetPageTop: 'pageTop',
	targetOnPage: 'onPage',
	$viewport: $('html'),

	init: function () {
		this.viewportDetect();
		this.bindClickEvent();
	},

	bindClickEvent: function () {

		// bind click event on any data-target
		$(Links.selector).on('click', function (e) {

			var $this = $(this),
				linkHref = $this.attr('href'),
				linkTarget = $this.data('target');

			// match data-target and run relevant function
			switch (linkTarget) {
				case Links.targetNewWindow:
					Links.newWindow(linkHref);
					break;
				case Links.targetOnPage:
					Links.onPage(linkHref);
					break;
				case Links.targetPageTop:
					Links.pageTop();
			}

			e.preventDefault();
		});

	},

	newWindow: function (href) {

		// window params
		var height = 420,
			width = 500,
			scrollBars = 'no',
			resizable = 'yes';

		// open new window with params
		window.open(href, 'popup', 'width=' + width + ', height=' + height + ', scrollbars=' + scrollBars + ', resizable=' + resizable + '');

	},

	onPage: function (href) {

		// scroll to offset of target
		Links.$viewport.stop().animate({
			scrollTop: $(href).offset().top - 50
		}, 750, AppSettings.Easing);

	},

	pageTop: function () {

		// scroll to top
		Links.$viewport.stop().animate({
			scrollTop: 0
		}, 500, AppSettings.Easing);

	},

	viewportDetect: function () {

		if (Utils.browser('applewebkit')) {
			Links.$viewport = $('body');
		}

	}

};

var Events = {

	init: function () {

		// bind scroll + resize event handlers
		Events.bindResize();
		Events.bindScroll();

		// run on load to set up init global vars
		Events.resize();
		Events.scroll();

	},

	bindResize: function () {

		$(window).on('debouncedresize', function () {
			Events.resize();
		});

	},

	bindScroll: function () {

		$(window).on('scroll', function () {
			Events.scroll();
		});

	},

	resize: function () {

		Events.scroll();

	},

	scroll: function () {

		// set scroll position
		AppSettings.scrollPos = $(window).scrollTop();

	},

	unbindScroll: function () {

		$(window).off('scroll');

	}

};

var Utils = {

	browser: function (browserName) {
		return (
			(navigator.userAgent.toLowerCase().indexOf(browserName) != -1)
		);
	}

};

var Input = {

	selector: '[data-input-clear]',

	init: function () {

		// test for clearable inputs
		if ($(Input.selector).length) {
			Input.clear();
		}

	},

	clear: function() {

		// test for placeholder support
		if (Input.placeholderSupport()) {
			Input.replaceValueAttr();
		} else {
			Input.bindClickEvent();
		}

	},

	replaceValueAttr: function() {

		// if true, swap value attr for placeholder
		$(Input.selector).each(function () {

			// set original value once
			var $this = $(this),
				value = $this.attr('value');

			// add placeholder attr and remove value attr (prevents override of placeholder)
			$this.attr('placeholder', value).removeAttr('value');

		});

	},

	bindClickEvent: function() {

		// otherwise set JS clearing fallback
		$(Input.selector).each(function () {

			// set original value once
			var $this = $(this),
				value = $this.attr('value');

			$this.on({
				'focus': function () {
					if ($this.attr('value') === value) {
						$this.attr('value', '');
					}
				},
				'blur': function () {
					if (!$this.attr('value')) {
						$this.attr('value', value);
					}
				}
			});
		});

	},

	placeholderSupport: function() {
		var input = document.createElement('input');
		return ('placeholder' in input);
	}

};



// Custom functions

var Foo = {

	bar: function () {

	}

};

// End custom functions



var Main = {

	run: function () {
		Events.init();
		Links.init();

		Foo.bar();
	}

};

$(document).ready(Main.run());