/*!
 * SwipeView v1.0 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var SwipeView = (function (window, document) {
	SwipeView = function (scroller, el, indicator, auto, options) {
		var i,
			div,
			className,
			pageIndex,
			timerID;

		that = this;
		that.scroller = scroller;
		that.auto = auto;

		that.scroller.setSwipeView(that);

		that.slides = new Array();
		that.indicator = indicator;
		//$("#" + el).find(".slider .page").hide();
		tagName = $("#" + el).find(".slider .page").eq(0).get(0).tagName;
		that.pageW = $("#" + el).find(".slider .page").eq(0).width();
		$("#" + el).find(".slider .page").filter(function(){
			that.slides.push("<div class='page'>" + $(this).html() + "</div>");
		});

		if(that.indicator != null){
			$(indicator).find("a").remove();
			$(indicator).append("<a class='on'></a>&nbsp;");
			for(var i = 0; i < that.slides.length-1; i++){
				$(indicator).append("<a></a>&nbsp;");
			}

			$(indicator).css("margin-left", "-" + ($(indicator).width()/2) + "px");
		}

		that.masterPages = [];
		that.slider = document.getElementById(el).children[0];
		that.pageWidth = that.slider.clientWidth;
		that.numberOfPages = that.slides.length;

		for (i=-1; i<2; i++) {
			div = document.createElement('div');
			div.id = 'swipeview-masterpage-' + (i+1);
			div.style.cssText = cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;left:' + i*100 + '%';
			if (!div.dataset) div.dataset = {};
			pageIndex = i == -1 ? that.numberOfPages - 1 : i;
			div.dataset.pageIndex = pageIndex;
			div.dataset.upcomingPageIndex = pageIndex;
			
			that.slider.appendChild(div);
			that.masterPages.push(div);
		}
		
		className = that.masterPages[1].className;
		that.masterPages[1].className = !className ? 'swipeview-active' : className + ' swipeview-active';

		for (i=0; i<3; i++) {
			page = i==0 ? that.slides.length-1 : i-1;

			el = document.createElement('span');
			el.innerHTML = that.slides[page];
			that.masterPages[i].appendChild(el);
		}

		this.setTimeInterval();
	};

	SwipeView.prototype = {
		currentMasterPage: 1,
		page: 0,
		pageIndex: 0,
		customEvents: [],
		checkPos: false,
		pageCount: 0,
		
		/**
		*
		* Pseudo private methods
		*
		*/


		clearTimeInterval: function(){
			if(!this.auto)
				return;

			clearInterval(this.timerID); 
		},

		setTimeInterval: function(){
			var that = this;
			if(!that.auto)
				return;
			clearInterval(this.timerID); 
			this.timerID = window.setInterval(function() { 
				that.scroller.scrollToPage("next", 0, 300);
			}, 5000); 
		},

		checkPosition: function (directionX) {
			var pageFlip,
				pageFlipIndex,
				className;

			this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
			// Flip the page
			if (directionX > 0) {
				this.pageCount--;
				this.page = this.pageCount;
				this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
				this.pageIndex = this.pageIndex === 0 ? this.numberOfPages - 1 : this.pageIndex - 1;

				pageFlip = this.currentMasterPage - 1;
				pageFlip = pageFlip < 0 ? 2 : pageFlip;
				this.masterPages[pageFlip].style.left = this.page * 100 - 100 + '%';

				pageFlipIndex = this.page - 1;
			} else {
				this.pageCount++;
				this.page = this.pageCount;

				this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
				this.pageIndex = this.pageIndex == this.numberOfPages - 1 ? 0 : this.pageIndex + 1;

				pageFlip = this.currentMasterPage + 1;
				pageFlip = pageFlip > 2 ? 0 : pageFlip;
				this.masterPages[pageFlip].style.left = this.page * 100 + 100 + '%';

				pageFlipIndex = this.page + 1;
			}

			// Add active class to current page
			className = this.masterPages[this.currentMasterPage].className;
			/(^|\s)swipeview-active(\s|$)/.test(className) || (this.masterPages[this.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active');

			// Add loading class to flipped page
			className = this.masterPages[pageFlip].className;
			/(^|\s)swipeview-loading(\s|$)/.test(className) || (this.masterPages[pageFlip].className = !className ? 'swipeview-loading' : className + ' swipeview-loading');
			
			pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / this.numberOfPages) * this.numberOfPages;
			this.masterPages[pageFlip].dataset.upcomingPageIndex = pageFlipIndex;		// Index to be loaded in the newly flipped page

//			this.slider.style[transitionDuration] = Math.floor(400) + 'ms';
			var that = this;
			if(that.indicator != null){
				document.querySelector(that.indicator + ' a.on').className = '';
				document.querySelector(that.indicator + ' a:nth-child(' + (that.pageIndex+1) + ')').className = 'on';
			}

			var el, upcoming;
			for (var i=0; i<3; i++) {
				upcoming = that.masterPages[i].dataset.upcomingPageIndex;

				if (upcoming != that.masterPages[i].dataset.pageIndex) {
					el = that.masterPages[i].querySelector('span');
					el.innerHTML = that.slides[upcoming];
				}
			}
			for (var i=0; i<3; i++) {
				this.masterPages[i].className = this.masterPages[i].className.replace(/(^|\s)swipeview-loading(\s|$)/, '');		// Remove the loading class
				this.masterPages[i].dataset.pageIndex = this.masterPages[i].dataset.upcomingPageIndex;
			}
		}
	};

	return SwipeView;
})(window, document);