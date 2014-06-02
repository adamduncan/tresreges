
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
	carouselSlideSelector: '[data-carousel-slide]',

	init: function() {
		$(Layout.sectionSelector).each(function() {
			var $this = $(this);
			$this.css('height', Utils.viewportHeight);
		});
		$(Layout.carouselSlideSelector).css('height', Utils.viewportHeight);
	}

};

var Menu = {

	selector: '[data-menu]',
	sectionSelector: '[data-section]',
	sectionArray: [],
	subNavWrapper: '[data-section-nav-wrapper]',
	subNavSelector: '[data-section-nav]',
	subNavToggle: '[data-section-toggle]',
	subSectionSelector: '[data-sub-section]',
	currentSection: 0,
	currentClass: 'current',
	visibleClass: 'is_visible',

	init: function() {
		Menu.bindClickEvent();
	},

	bindClickEvent: function () {
		// primary nav
		$(Menu.selector + ' > li > a').on('click', function(e) {
			Utils.smoothScroll($(this).attr('href'));
			e.preventDefault();	
		});
		// secondary nav
		$(Menu.subNavToggle).on('click', function() {
			// store ref to $this and list item index
			var $this = $(this),
				$thisTabContainer = $this.parents(Menu.sectionSelector),
				index = $this.parent().index();

			// if clicked button already active, return
			if ($this.hasClass(Menu.currentClass)) return;
			// otherwise continue to showTab, passing new current tab index and tab container
			Menu.showTab(index, $thisTabContainer);
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
				$(Menu.selector + ' > li:nth-child(' + (i+1) + ') > a').addClass(Menu.currentClass);
				// set current section global
				Menu.currentSection = i;
				Menu.toggleSubNav(Menu.currentSection);
			} else {
				$(Menu.selector + ' > li:nth-child(' + (i+1) + ') > a').removeClass(Menu.currentClass);
			}
		}
	},

	toggleSubNav: function(i) {
		if ($(Menu.subNavWrapper, $(Menu.sectionSelector)[i]).length) {
			$(Menu.subNavWrapper, $(Menu.sectionSelector)[i]).addClass(Menu.visibleClass);
		} else {
			$(Menu.subNavWrapper).removeClass(Menu.visibleClass);
		}
	},

	showTab: function (i, $tabContainer) {
		// remove current classes from tab content and tab button
		$tabContainer.find('.' + Menu.currentClass).removeClass(Menu.currentClass);
		// add current class to new tab content and tab button
		$(Menu.subSectionSelector, $tabContainer[0]).eq(i).addClass(Menu.currentClass);
		$tabContainer.find('li:nth-child(' + (i+1) + ') ' + Menu.subNavToggle).addClass(Menu.currentClass);
	}

};

var Stellar = {

	init: function() {
		$.stellar({
			horizontalScrolling: false,
			verticalOffset: 0,
			responsive: true
		});
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

var Carousel = {

	selector: '[data-carousel]',
	slideSelector: '[data-carousel-slide]',
	prevSelector: '[data-carousel-prev]',
	nextSelector: '[data-carousel-next]',
	contentSelector: '[data-slide-content]',
	titleSelector: '[data-title]',
	locationSelector: '[data-location]',
	captionSelector: '[data-caption]',
	titleTarget: '[data-slide-title]',
	locationTarget: '[data-slide-location]',
	captionTarget: '[data-slide-caption]',
	captionArray: [],

	init: function() {
		var $carousel = new Swiper(Carousel.selector, {
			calculateHeight: true,
			onSwiperCreated: function (swiper) {
				swiper.resizeFix();
				if ($(Carousel.contentSelector).length) {
					Carousel.storeCaptions(swiper);
				}
				Carousel.updateCaption(swiper);
			},
			onSlideChangeStart: function(swiper) {
				Carousel.loadImage(swiper.activeIndex);
			},
			onSlideChangeEnd: function(swiper) {
				Carousel.updateCaption(swiper);
			}
		});
		// bind pager events once carousel built, pass $carousel
		Carousel.bindPagerEvents($carousel);
	},

	bindPagerEvents: function ($carousel) {
		// prev
		$(Carousel.prevSelector).on('click', function () {
			$carousel.swipePrev();
		});
		// next
		$(Carousel.nextSelector).on('click', function () {
			$carousel.swipeNext();
		});
	},

	loadImage: function(i) {
		var $nextSlide = $(Carousel.slideSelector).eq(i+1),
			nextSlideImgSrc = $nextSlide.data('src');

		// refactor to avoid duplicate calls?
		if (!nextSlideImgSrc) {
			return;
		} else {
			$nextSlide.css('background-image', 'url(' + nextSlideImgSrc + ')').removeAttr('data-src');
		}

	},

	storeCaptions: function(swiper) {
		
		$carousel = $(swiper.container);
		
		$(Carousel.slideSelector, $carousel).each(function () {
			var $this = $(this),
				data = {
					title: $(Carousel.titleSelector, $this).html(),
					location: $(Carousel.locationSelector, $this).html(),
					caption: $(Carousel.captionSelector, $this).html()
				};

			Carousel.captionArray.push(data);
		});

	},

	updateCaption: function(swiper) {
		var $carousel = $(swiper.container),
			$captionContainer = $carousel.next(Carousel.contentSelector);
		
		$(Carousel.titleTarget, $captionContainer).text(Carousel.captionArray[swiper.activeIndex].title);
		$(Carousel.locationTarget, $captionContainer).text(Carousel.captionArray[swiper.activeIndex].location);
		$(Carousel.captionTarget, $captionContainer).text(Carousel.captionArray[swiper.activeIndex].caption);
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

		// check for subnav elements to show, passing current section index
		Menu.toggleSubNav(Menu.currentSection);
	}

};

var Main = {

	run: function () {
		Utils.bindResizeEvent();
		Utils.bindScrollEvent();
		Utils.setViewportHeight();
		Menu.bindClickEvent();
		Layout.init();
		Stellar.init();
		Video.init();
		Carousel.init();
	}

};

$(document).ready(Main.run());