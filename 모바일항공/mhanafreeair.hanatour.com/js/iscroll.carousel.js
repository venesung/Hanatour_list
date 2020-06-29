/*!
 * iScrollCarousel v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
	m = Math,
	dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

	// Style properties
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	isMobile = (/mobile/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),
	ANI_EV = (function () {
		if ( vendor === false ) return false;

		var animationEnd = {
				''			: 'webkitAnimationEnd',
				'webkit'	: 'webkitAnimationEnd',
				'Moz'		: 'AnimationEnd',
				'O'			: 'oAnimationEnd',
				'ms'		: 'MSAnimationEnd'
			};

		return animationEnd[vendor];
	})(),

	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),

	// Helpers
	translateZ = has3d ? ' translateZ(0)' : '',

	// Constructor
	iScrollCarousel = function (el, overflow, options) {
		var swipeView, that = this, offsetWidth = 0,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = overflow;
		that.slider = that.wrapper.children[0];
		that.moveTime = isIDevice ? 350 : 300;
		that.currentPage = 0;

		// Default options
		that.options = {
			hScroll: true,
			vScroll: false,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			lockDirection: true,
			useTransform: true,
			useTransition: true,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental
			handleClick: true,
			infinite: false,

			// Zoom
			wheelAction: 'scroll',

			// Snap
			snap: true,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onInit: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform && that.options.useTransform;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		
		// Set some default styles
		that.slider.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
		that.slider.style[transitionDuration] = '0';
		that.slider.style[transformOrigin] = '0 0';
		if (that.options.useTransition) that.slider.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.slider.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
		else that.slider.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			if (that.options.wheelAction != 'none') {
				that._bind('DOMMouseScroll');
				that._bind('mousewheel');
			}
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);

	
		if (that.options.onInit) that.options.onInit.call(that);
	};

// Prototype
iScrollCarousel.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case TRNEND_EV: that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.animating ||
			(this.scrollerW == this.slider.offsetWidth && this.scrollerH == this.slider.offsetHeight)) return;

		this.refresh();
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, 200);
	},
	
	_pos: function (x, y) {
		if(!this.options.infinite)
			x = this.hScroll ? x : 0;
		y = 0;

		if (this.options.useTransform) {
			this.slider.style[transform] = 'translateX(' + x + 'px)' + translateZ;
		} else {
			x = m.round(x);
			y = m.round(y);
			this.slider.style.left = x + 'px';
			this.slider.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if(that.wrapper.id != "mainSlider"){
			try{
				carouselScroller.disable();
			}
			catch(e){}
		}

		if(!that.enabled) { that.enabled = true; return; }

		if(that.moved) { e.preventDefault(); return; }

		if(that.options.useTransition) that._transitionTime(0);

		if(that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		that.lockState = null;
		that.moved = false;
		that.animating = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV, window);
		that._bind(END_EV, window);
		that._bind(CANCEL_EV, window);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2,
			timestamp = e.timeStamp || Date.now();

		if(!that.enabled) { return; }

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		 if (that.absDistX < 6 && that.absDistY < 6) {
			that.distX += deltaX;
			that.distY += deltaY;
			that.absDistX = m.abs(that.distX);
			that.absDistY = m.abs(that.distY);

			return; 
		}

		// Lock direction
		if (that.lockState == "h" || (that.absDistX > that.absDistY)) {
			that.lockState = "h";
			newY = that.y;
			deltaY = 0;
		} else if (that.lockState == "v" || (that.absDistY > that.absDistX)) {
			that.lockState = "v";
			that.disable();
			return;
		}
		e.preventDefault();

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 200) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length !== 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap;

		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (!that.moved) {

			if (hasTouch) {
				that.doubleTapTimer = setTimeout(function () {
					that.doubleTapTimer = null;

					// Find the last touched element
					target = point.target;
					while (target.nodeType != 1) target = target.parentNode;

					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
						ev = doc.createEvent('MouseEvents');
						ev.initMouseEvent('click', true, true, e.view, 1,
							point.screenX, point.screenY, point.clientX, point.clientY,
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
							0, null);
						ev._fake = true;
						target.dispatchEvent(ev);
					}
				}, 0);
			}

			that._resetPos(that.moveTime);
			
			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}


		// Do we need to snap?
		distX = newPosX - that.absStartX;
		distY = newPosY - that.absStartY;
		if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) {
			that.scrollTo(that.absStartX, that.absStartY, 200);
	}
		else {
			snap = that._snap(that.x, that.y);
			if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
		}

		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
		return;
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (!that.options.infinite && resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			return;
		}

		if(!that.options.infinite){
			that.scrollTo(resetX, resetY, time || 0);
		}
		else{
			that.moved = false;
			if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			if (that.startX == that.x) 
				return;
		}
	},

	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.slider) return;

		that._unbind(TRNEND_EV);
		
		that._startAni();
	},


	/**
	*
	* Utilities
	*
	*/
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(that.moveTime);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		

		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) {
				that._bind(TRNEND_EV);
				//if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			}
			else {
				that._resetPos(0);
			}
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.slider.style[transitionDuration] = time;

//		$('#main-nav .bg-bar .focus-bar').css(transitionDuration, time);
//		$('#main-nav ul li a span').css(transitionDuration, time);
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		if(!that.options.infinite){
			page = that.pagesX.length - 1;
			for (i=0, l=that.pagesX.length; i<l; i++) {
				if (x >= that.pagesX[i]) {
					page = i;
					break;
				}
			}
			if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
			x = that.pagesX[page];
			sizeX = m.abs(x - that.pagesX[that.currPageX]);
			sizeX = sizeX ? m.abs(that.x - x) / sizeX * that.moveTime : 0;
			that.currPageX = page;

			// Check page Y
			page = that.pagesY.length-1;
			for (i=0; i<page; i++) {
				if (y >= that.pagesY[i]) {
					page = i;
					break;
				}
			}
			if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
			y = that.pagesY[page];
			sizeY = m.abs(y - that.pagesY[that.currPageY]);
			sizeY = sizeY ? m.abs(that.y - y) / sizeY * that.moveTime : 0;
			that.currPageY = page;

			// Snap with constant speed (proportional duration)
			time = m.round(m.max(sizeX, sizeY)) || 200;
		}
		else{
			if(x > that.startX)
				page = that.currPageX - 1;
			else
				page = that.currPageX + 1;
			if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
			x = -(page * that.wrapper.clientWidth);

			sizeX = that.wrapper.clientWidth;
			sizeX = sizeX ? m.abs(that.x - x) / sizeX * that.moveTime : 0;
			that.currPageX = page;

			time = m.round(sizeX);
			y = 0;
		}

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.slider).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.slider).removeEventListener(type, this, !!bubble);
	},


	/**
	*
	* Public methods
	*
	*/
	destroy: function () {
		var that = this;

		that.slider.style[transform] = '';


		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);
		
		if (!that.options.hasTouch) {
			that._unbind('DOMMouseScroll');
			that._unbind('mousewheel');
		}
		
		if (that.options.useTransition) that._unbind(TRNEND_EV);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if(that.offsetWidth != 0 && that.offsetWidth == document.body.offsetWidth){
			setTimeout(function() { that.refresh(); }, 200);
			return;
		}

		that.offsetWidth = document.body.offsetWidth;
		if (!that.options.infinite) {
			var slider = that.slider.children;
			if (typeof that.options.snap == 'string') 
				slider = that.slider.querySelectorAll(that.options.snap);

			var margin = 0;
			for(var i=0; i < slider.length; i++){
				slider[i].style["width"] = (document.body.offsetWidth - margin) + "px";
			}
			that.slider.style["width"] = (slider.length  * document.body.offsetWidth) + "px";
		}

		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.scrollerW = m.round(that.slider.offsetWidth);
		that.scrollerH = m.round((that.slider.offsetHeight + that.minScrollY));

		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.slider.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
			}

			if (that.options.infinite) {
				if( that.moved )
					that.currPageX--;

				that.stop();
				x = -(that.currPageX * that.wrapper.clientWidth);
				that._transitionTime(0);
				that._pos(x, 0);
				return;
			}
			else
				try{ that.scrollToPage(that.currPageX, 0, 0); } catch(e){}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;

			if (that.options.infinite) {
				if( that.moved )
					that.currPageX--;

				that.stop();
				x = -(that.currPageX * that.wrapper.clientWidth);
				that._transitionTime(0);
				if(!that.moved)
					that._pos(x, 0);
				else
					if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
				return;
			}
			else
				try{ that.scrollToPage(that.currPageX, 0, 0); } catch(e){}
		}

		that.slider.style[transitionDuration] = '0';
		that._resetPos(that.moveTime);
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.slider.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? that.moveTime : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;

			if(!that.options.infinite){
				pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;

				that.currPageX = pageX;
				x = that.pagesX[pageX];
			}
			else{
				that.currPageX = pageX;
				x = -(that.currPageX * that.wrapper.clientWidth);
			}
		} else {
			x = -that.wrapperW * pageX;
			if (x < that.maxScrollX) x = that.maxScrollX;
		}

		that.scrollTo(x, 0, time);
	},

	setSwipeView: function(id){
		this.swipeView = id;
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV, window);
		this._unbind(END_EV, window);
		this._unbind(CANCEL_EV, window);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(TRNEND_EV);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	isReady: function () {
		return !this.moved && !this.animating;
	}
};

function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

dummyStyle = null;	// for the sake of it

if (typeof exports !== 'undefined') exports.iScrollCarousel = iScrollCarousel;
else window.iScrollCarousel = iScrollCarousel;

})(window, document);
