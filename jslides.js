var jSlides = function (selector, width, height, args) {
	var that = {};
	
	that.next = function () {
		var next = that.element.find('.next');
		var caption = next.find('.caption');
		caption.hide();

		if (!that.thumbs.is(":hover")) that.centerThumbs();

		that.slides.find('.active').fadeOut('slow',function() {
			// Since the caption is positioned at the bottom, this actually slides "up" to display it
			caption.slideDown(); 
			that.element.find('.active').removeClass('active')
			next.removeClass('next').addClass('active');
			var nextnext = next.next()[0]? next.next() : that.element.find('li:first-child');
			nextnext.addClass('next');
			$(this).show();


		});
	}

	that.centerThumbs = function(speed, s) {
		if (typeof speed == 'undefined') speed = 'slow';
		if (typeof s == 'undefined') s = '.next';

		var thumb = that.thumbs.find(s);
		var scroller = that.thumbs.find('.jthumbs-scroller');

		var center = thumb.position().left 
			+ scroller.scrollLeft() 
			- (scroller.width() / 2) 
			+ (thumb.outerWidth() / 2);


		scroller.animate({ scrollLeft: center }, speed);
	}

	that.prev = function () {
		that.element.find('.next').removeClass('next');
		var cur = that.element.find('.active');
		(cur.prev()[0]? cur.prev() : that.slides.find('li:last-child')).addClass('next');
		that.next();
	}

	that.skipTo = function (i) {
		console.log(i);
		var selector = 'li:nth-child('+i+')';
		console.log(selector);
		var slide = that.element.find(selector);
		
		// Don't do anything if this slide doesn't exist
		if (slide[0]) {
			
			that.delay();

			// If the chosen slide is the active one, don't transition to it
			if (slide.hasClass('active')) return;

			that.element.find('.next').removeClass('next');
			slide.addClass('next');
			that.next();
		}
	}

	that.start = function () { 
		if (that.interval) that.stop(); 
		that.interval = setInterval(that.next, 7000); 
		console.log('start')
	}

	that.stop = function () {
		clearInterval(that.interval); 
		that.interval = null;
		console.log('stop'); 
	}

	// Delay the next transition
	that.delay = function () {
		that.stop();
		that.start();
	}

	that.init = function () {
		that.element = jQuery(selector);

		that.slides = that.element.find('ul');
		if (!that.slides[0]) that.slides = $(document.createElement('ul')).appendTo(that.element);


		if (args.slides) {
			$("#slideTemplate").tmpl(args.slides).appendTo(that.slides);
		}

		if (args.thumbs) {
			that.thumbs = $(document.createElement('div'));
			that.thumbs.addClass('jthumbs');
			that.element.append(that.thumbs);

			var scroller = $(document.createElement('div')).addClass('jthumbs-scroller');
			scroller.width(width);
			that.thumbs.width(width);
			that.thumbs.append(scroller);

			var leftScroll = $(document.createElement('div')).addClass('jthumbs-left');
			var rightScroll = $(document.createElement('div')).addClass('jthumbs-right');

			var scrollAmount = 2;
			var scrollInterval = 20;

			rightScroll.hover(function() {
				$(this).data('interval', setInterval(function() {
					scroller.scrollLeft(scroller.scrollLeft()+scrollAmount);
				}, scrollInterval))
			}, function() {
				clearInterval($(this).data('interval'));
			});

			leftScroll.hover(function() {
				$(this).data('interval', setInterval(function() {
					scroller.scrollLeft(scroller.scrollLeft()-scrollAmount);
				}, scrollInterval))
			}, function() {
				clearInterval($(this).data('interval'));
			});

			that.thumbs.append(leftScroll);
			that.thumbs.append(rightScroll);

			var thumbsUl = $(that.slides.clone());
			thumbsUl.removeAttr('class').removeAttr('style');
			thumbsUl.width(thumbsUl.children().size() * 110);
			thumbsUl.find('.caption, .title').remove();
			scroller.append(thumbsUl);
			scroller.scrollLeft(0);

			thumbsUl.find('li').each(
				function(i, e) {
					$(this).click(function() {
						var nth = i+1;
						that.element.stop();
						that.skipTo(nth);
						that.centerThumbs('slow','li:nth-child('+nth+')');
					});
				}
			);

		}
		
		that.slides.width(width);
		that.slides.height(height);
		var first = that.element.addClass('jslides').find('li:first-child');
		first.addClass('active');
		var next = first.next();
		next.addClass('next');
		that.slides.hover(that.stop, that.start);
		that.start();

	}

	that.init();

	return that;
};
