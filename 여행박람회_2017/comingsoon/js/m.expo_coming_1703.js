/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.03.31
 *
 * 2017 여행 박람회 MOBILE 커밍
 * 
 */
(function (scope) {
    if (scope.EXPOCOMING !== undefined) return;

    var EXPOCOMING = {};

    scope.EXPOCOMING = EXPOCOMING;
})(window);

(function ($) {
	var windowLoaded = false;

	$(window).on('load', function () {
		windowLoaded = true;
	});

	$(document).ready(function () {
		var containerDIV = $('#wrap');

		$('.teaserCont:not(".map")').each(function () {
			new SwiperTemplate().initGallerySwiper($(this).find('.tsSwipe_img > .swiper-container'), {roundLengths: true, exChange: function (data, type) {
				var fadeSwiperContainer = $(data.container).closest('.teaserCont').find('.tsSwipe_fade:eq(0) > .swiper-container');
				var isIconSwiper = $(data.container).find('.invite_in').length > 0;
				var swiper = fadeSwiperContainer[0].swiper;

				//배경 변경
				if (swiper !== undefined && data.activeIndex !== swiper.activeIndex) swiper.slideTo(data.activeIndex);

				var idx = fadeSwiperContainer.find('.swiper-pagination > span.swiper-pagination-bullet-active').index();

				//아래 글짜 컨텐츠 변경
				$(data.container).closest('.teaserCont').find('.btmTxt > .txtBox').hide().eq(idx).show();

				//스와이프 이동 시 발생 (복제 스와이프도 같이 실행)
				if (isIconSwiper && type === 'onTransitionEnd') {
					if (idx < 0) idx = 0;

					inMotionIcon($('.swiper-slide.invite_in[data-swiper-slide-index="'+idx+'"]'));
				}
			}, onInit: function (data) {
				var isIconSwiper = $(data.container).find('.invite_in').length > 0;

				//화면에 보이는 상태, 최소 아이콘 모션 실행
				if (isIconSwiper) {
					$(window).load(function () {
						inMotionIcon($('.swiper-slide.invite_in[data-swiper-slide-index="0"]'));	
					});
				}

				//글짜 컨텐츠 초기화
				$(data.container).closest('.teaserCont').find('.btmTxt > .txtBox').hide().eq(0).show();
			}});

			new SwiperTemplate().initGallerySwiper($(this).find('.tsSwipe_fade > .swiper-container'), {
				effect : 'fade'
			});
		});
		
		$('.swiper-container').on('click.expocoming', '.swiper-slide.invite_in a', function (e) {
			var target = $(e.currentTarget);

			if (parseInt(target.closest('.swiper-slide').attr('data-swiper-slide-index')) === 2) {
				$('.inviteCardPop').show().off('click.expocoming').on('click.expocoming', '.closeBtn', function (e) {
					containerDIV.css('display', 'block');

					var st = $('#wrap').data('scrolltop');

					if (st !== undefined) $(document).scrollTop($('#wrap').data('scrolltop'));

					$('.inviteCardPop').hide();
					e.preventDefault();
				});

				containerDIV.data('scrolltop', $(window).scrollTop()).css('display', 'none');

				e.preventDefault();
			}
		});

		initEvent();

		CountDown.setTime(new Date(), new Date(2016, 11-1, 8), {callback: function (data) {
			$('.timeBox > div:eq(0) > strong').text(data.d);
			$('.timeBox > div:eq(1) > strong').text(data.h);
	        $('.timeBox > div:eq(2) > strong').text(data.m);
	        $('.timeBox > div:eq(3) > strong').text(data.s);

	        //$('.txtTimer').text('메가세일 종료까지 ' + data.d + '일 ' + data.h + '시간 ' + data.m +'분 남았습니다.');	
		}});
	});

	//스와이프 안에 아이콘 등장 모션 
	function inMotionIcon(swiperSlide) {
		//화면에 보이는 경우 등장
		var showSlide = swiperSlide.isInViewport({tolerance: swiperSlide.outerHeight()});
		showSlide.find('> div > a').addClass('up');

		//화면에 보이지 않는 것이 있다면
		if (swiperSlide.length > 1) { //형제 스와이프 중에 같은 idx 가지고 있는 스와이프 있다면 같이 클래스 적용
			var idx = showSlide.attr('data-swiper-slide-index');

			showSlide.siblings('.swiper-slide[data-swiper-slide-index="'+idx+'"]').find('> div > a').addClass('up');
		}
	}

	function initEvent() {
		var title = $('.stit');

		var oldScrollYpos;
		$(window).on('scroll.expocoming', function (e) {
			inMotionIcon($('.swiper-slide-active.invite_in'));

			if (windowLoaded) {
				//스크롤 이동 시
				if (oldScrollYpos - WDDO.scrollYpos > 0) {
					//console.log('down');
					oldScrollYpos = WDDO.scrollYpos;
					setTimeout( function (oldypos) {
						tansTitle( Math.min(oldypos - $(window).scrollTop(), 20) ) 
					}, 50, [oldScrollYpos]);
				} else if (oldScrollYpos - WDDO.scrollYpos < 0) {
					//console.log('up');
					oldScrollYpos = WDDO.scrollYpos;
					setTimeout( function (oldypos) {
						tansTitle( Math.max(oldypos - $(window).scrollTop(), -20) ) 
					}, 50, [oldScrollYpos]);
				} else if (oldScrollYpos === undefined) {}

				oldScrollYpos = WDDO.scrollYpos;
			}
		});

		function tansTitle(distance) {
			//css transition:transform 0.2s ease;
			title.css('transform', 'translateY('+distance+'px)');
		}
	}

	/**
	* 카운트 다운
	*
	* @param options    ::: 설정 Object 값
	*
	* options
	*   callback:Function = function (data) {}       //이벤트까지 .. 의 까지 이전 문자열
	*
	* method
	*   CountDown.setTime(currentDate, endDate, options);    //카운트 설정
	*/
	var CountDown = (function ($) {
	    var currentDate,
	        endDate,
	        os,
	        cs,
	        sec,
	        countDown,
	        opts,
	        defaults = getDefaultOption(),
	        init = function (options) {
	            opts = $.extend({}, defaults, options);          

	            initLayout();
	            initEvent();
	        };

	    function initCountDown() {
	        var countDate = new Date();
	        cs = countDate.getSeconds();

	        if (cs === 0) sec += 60;
	        cs = cs + sec;
	        countDown = cs - os;

	        var interval = endDate.getTime() - currentDate.getTime() - (countDown * 1000);

	        if (interval < 0 && window.onlineCoundDownId !== undefined) {
	            clearInterval(window.onlineCoundDownId);
	            window.onlineCoundDownId = undefined;

	            return;
	        } 

	        var mescPerSecond = 1000;
	        var msecPerMinute = mescPerSecond * 60;          
	        var msecPerHour = msecPerMinute * 60; 
	        var msecPerDay = msecPerHour * 24;      //milliseconds -> day
	        var msecPerMonth = msecPerDay * 30;
	        var msecPerYear = msecPerMonth * 12;

	        var year = Math.floor(interval / msecPerYear);
	        interval = interval - (year * msecPerYear);

	        var month = Math.floor(interval / msecPerMonth);
	        interval = interval - (month * msecPerMonth);

	        var days = Math.floor(interval / msecPerDay);
	        interval = interval - (days * msecPerDay);

	        var hours = Math.floor(interval / msecPerHour);
	        interval = interval - (hours * msecPerHour);

	        var minutes = Math.floor(interval / msecPerMinute);
	        interval = interval - (minutes * msecPerMinute);

	        var seconds = Math.floor(interval / mescPerSecond);

	        //add
	        var d = force2Digits(days + month * 30 + year * 365);
	        var h = force2Digits(hours);
	        var m = force2Digits(minutes);
	        var s = force2Digits(seconds);

	        if (opts.callback !== undefined) opts.callback({d:d, h:h, m:m, s:s});

	        //console.log(year + '/' + month + '/' + days + ' ' + hours + ':' + minutes + ':' + seconds);
	    }

	    function getDefaultOption() {
	        return {
	            
	        };
	    }

	    function initLayout() {

	    }

	    function initEvent() {

	    }

	    return {
	        setTime: function (current, end, options) {
	            init(options);

	            currentDate = current;
	            endDate = end;

	            if (currentDate !== undefined && endDate !== undefined && window.onlineCoundDownId === undefined) {
	                countDown = 0;
	                sec = 0;
	                os = currentDate.getSeconds();
	                window.onlineCoundDownId = setInterval(initCountDown, 1000);
	                initCountDown();
	            }
	        }
	    };
	}(jQuery));

	function force2Digits(value) {
    	return (value < 10) ? '0' + value.toString() : value.toString();
	}

	/**
	 * 1차함수
	 * @param a ::: 값1의 최소값
	 * @param b ::: 값1의 최대값
	 * @param c ::: 값2의 최소값
	 * @param d ::: 값2의 최대값
	 * @param x ::: 값1의 현재값
	 * @return  ::: 값2의 현재값 
	 */
	function getLinearFunction(a, b, c, d, x) {
	    return (d - c) / (b - a) * (x - a) + c
	}

	//확장
	if ($.fn.getInstance === undefined) $.fn.getInstance = function () { return this.data('scope'); }

	//easing
	$.easing.jswing=$.easing.swing;$.extend($.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return $.easing[$.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-$.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return $.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return $.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

	//DOCOM (common_new.js ver 2.0.6)
	(function(a){if(a.DOTCOM!==undefined){return}if(a.ANI_EV===undefined){var b=document.createElement("div").style;var d=(function(){var h="t,webkitT,MozT,msT,OT".split(","),g,f=0,e=h.length;for(;f<e;f++){g=h[f]+"ransform";if(g in b){return h[f].substr(0,h[f].length-1)}}return false})();a.ANI_EV=(function(){if(d===false){return false}var e={"":"webkitAnimationEnd",webkit:"webkitAnimationEnd",Moz:"AnimationEnd",O:"oAnimationEnd",ms:"MSAnimationEnd"};return e[d]})()}var c={setMask:function(e,f){if(e){if(f!=="#overlayPanel"){$("body .ui-page").append('<div id="mask" class="mask"></div>');if(f!==undefined){WDDO.setDisableEvent(f.find(".innerScroller"))}}}else{$("#mask").remove();WDDO.setEnableEvent($("body"))}},fixedFixToggle:function(g,f){var e=g.find(".fixed");if(f){e.css({position:"absolute",top:g.scrollTop()})}else{e.css({position:"",top:""})}},innerScrollToggle:function(h,e){var g=(h.height()>WDDO.browserHeight);if(g){if(e){var f=h.attr("data-scrolltop");h.css({height:WDDO.browserHeight,"overflow-y":"auto"});if(f!==undefined){h.scrollTop(f)}}else{var f=h.attr("data-scrolltop");h.css({height:"auto","overflow-y":""}).removeAttr("data-scrolltop");if(f!==undefined){$(window).scrollTop(f)}}}},openSlidePop:function(h,e){var f=$.extend({source:$(jQuery.fn),parent:$("#wrap"),browserHeight:WDDO.browserHeight},e);if(h===undefined){return}var g=h;g.html(f.source.html());g.css({"min-height":f.browserHeight,display:"block"}).data("st",$(window).scrollTop());setTimeout(function(){c.innerScrollToggle(g,true);c.fixedFixToggle(g,true);g.addClass("slide slideUp").on(ANI_EV+".dotcom",function(){f.parent.hide();$(window).scrollTop(0);g.css("height","auto").addClass("show").removeClass("slideUp slide").off(ANI_EV+".dotcom");c.innerScrollToggle(g,false);c.fixedFixToggle(g,false)})},50)},closeSlidePop:function(i,f){var g=$.extend({parent:$("#wrap")},f);if(i===undefined){return}var h=i;h.attr("data-scrolltop",$(window).scrollTop());c.innerScrollToggle(h,true);c.fixedFixToggle(h,true);g.parent.show();h.css("height",WDDO.browserHeight).addClass("slide slideDown").one(ANI_EV+".dotcom",function(){c.innerScrollToggle(h,false);c.fixedFixToggle(h,false);h.attr("style","").removeClass("slideDown slide show").hide()});if(h.data("st")!==undefined){var e=parseInt(h.data("st"));h.removeData("st");setTimeout(function(){$(window).scrollTop(e)},1)}},openLoadPop:function(o){var l,e,h=g(),f=$.extend({},h,o);function g(){return{url:undefined,effect:"slide"}}k();function i(){j();n();if(f.effect==="slide"){c.openSlidePop(l,f)}l.off("close.loadpop").trigger("open.loadpop",f)}function j(){l=($("#overlayPanel").length>0)?$("#overlayPanel"):$('<div id="overlayPanel">');$("body").append(l);if(e!==undefined){l.html(e)}}function n(){l.off("click").on("click",".closeOverlayPanel",function(q){var p=$(q.currentTarget);if(f.effect==="slide"){c.closeSlidePop(l,f)}l.off("open.loadpop").trigger("close.loadpop",f)})}function k(){$.ajax({type:"GET",url:f.url,dataType:"text",success:function(p){e=p;i()},error:function(r,q,p){}})}function m(q){var p=q.indexOf("<script");while(p>-1){if(p==0){q=q.substring(q.indexOf("<\/script>")+9)}else{q=q.substring(0,p)+q.substring(q.indexOf("<\/script>")+9)}p=q.indexOf("<script")}return q}}};a.DOTCOM=c})(window);(function(a){if(a.WDDO!==undefined){return}var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:undefined,setEnableEvent:function(c){var d=(c===undefined)?$("body"):c;if(d.data("overflowY")!==undefined){d.css({"overflow-y":d.data("overflowY")}).removeData("overflowY")}d.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(g,f){var c=0;var e;var i=(f===undefined)?$("body"):f;if(i.css("overflow-y")==="hidden"){return}i.data({overflowY:i.css("overflow-y")}).css({"overflow-y":"hidden"});i.on("touchstart.WDDO",function(m){var n=m.originalEvent.touches[0]||m.originalEvent.changedTouches[0];var l=$(m.target);var k=(l.closest(g).length>0);c=n.pageY;e=(k)?$(g):undefined});i.on("touchmove.WDDO",function(m){if(e!==undefined){var o=m.originalEvent.touches[0]||m.originalEvent.changedTouches[0];var n=o.pageY-c;var k=j(e);var l=d(e);if(n>0&&l<=0){if(m.cancelable){m.preventDefault()}}else{if(n<0&&k<=0){if(m.cancelable){m.preventDefault()}}else{}}}else{if(m.cancelable){m.preventDefault()}}});function h(k){return k.prop("scrollHeight")-k.prop("clientHeight")}function d(k){return k.scrollTop()}function j(l){var l=typeof l=="object"?l:$(l);var k=h(l);var m=d(l);return k-m}}};a.WDDO=b})(window);$(document).ready(function(){g();i();d();c();h();f();e();a();function g(){$(".global-swiper").each(function(j){var k=new Swiper($(this),{pagination:$(this).find(".swiper-pagination"),loop:(($(this).find(".swiper-slide").length>1)?true:false),preloadImages:false,lazyLoadingInPrevNext:true,lazyLoading:true})})}function i(){try{$(document).on("scroll.dotcom",function(k){try{WDDO.scrollYpos=(document.documentElement.scrollTop!==0)?document.documentElement.scrollTop:document.body.scrollTop}catch(k){}}).triggerHandler("scroll.dotcom");$(window).on("resize.dotcom",function(k){if(WDDO.browserWidth===$(window).width()&&WDDO.browserHeight===$(window).height()){return false}WDDO.browserWidth=$(window).width();WDDO.browserHeight=$(window).height();b()}).triggerHandler("resize.dotcom");$(".scrollTop").on("click.dotcom",function(k){$(window).scrollTop(0)})}catch(j){}}function d(){if(typeof innerScroller!=="undefined"&&($("#gnb").length>0&&!$("#gnb").hasClass("swiper-container"))){return}$("#btnMenu").off("click");$("#btnMyhome").off("click");var k=$("#menuPanel");var m=$("#menuPanel02");var l=$("#wrap");m.on("click",".hanaMenuList > ul.topList > li > a",function(q){var p=$(q.currentTarget);var o=p.closest("li");var n=o.index();if(o.hasClass("on")){m.find("ul.topList > li").removeClass("on");m.find(".innerMenuBox > ul").removeClass("open")}else{m.find("ul.topList > li").removeClass("on");m.find(".innerMenuBox > ul").removeClass("open");o.addClass("on");p.closest("ul").next(".innerMenuBox").find("> ul").eq(n).addClass("open")}q.preventDefault()});$("#btnMenu").on("click.dotcom",function(n){if(m.length>0){m.find(".innerScroller").scrollTop(0);m.css("display","block");setTimeout(function(){m.addClass("open")},5);l.addClass("slideLeft")}else{k.addClass("slideIn");l.addClass("slideLeft")}DOTCOM.setMask(true,m);$("#mask, .closeSlide").one("click.dotcom",function(o){if(m.length>0){m.removeClass("open");l.removeClass("slideLeft")}else{k.removeClass("slideIn");l.removeClass("slideLeft")}DOTCOM.setMask(false);o.preventDefault()});n.preventDefault()});m.on("transitionend webkitTransitionEnd",function(n){if(!m.hasClass("open")){m.css("display","none")}});function j(n){return n.split("(")[1].split(")")[0].split(",")}$("#btnMyhome").on("click.dotcom",function(n){DOTCOM.setMask(true,$("#userPanel"));$("#userPanel").addClass("slideIn");$("#wrap").addClass("slideRight");$("#mask, .closeSlide").one("click.dotcom",function(o){$("#userPanel").removeClass("slideIn");$("#wrap").removeClass("slideRight");DOTCOM.setMask(false);o.preventDefault()});n.preventDefault()})}function c(){var j=new Swiper("#gnb",{slidesPerView:"auto",simulateTouch:false,spaceBetween:0,freeMode:true,slidesOffsetBefore:0,slidesOffsetAfter:45,wrapperClass:"gnb-wrapper",slideClass:"gnb-slide",onInit:function(){$("#gnb").addClass("nextShadow")},onProgress:function(m,l){if(l<=0){$("#gnb").removeClass("prevShadow").addClass("nextShadow")}else{if(l>=1){$("#gnb").removeClass("nextShadow").addClass("prevShadow")}else{$("#gnb").addClass("nextShadow prevShadow")}}}});$("#gnb").on("click","> ul > li > a",function(n){var m=$(n.currentTarget);var l=m.parent().index();$("#gnb").changeAct(l);n.preventDefault()});var k=$("div.allDepBox");$("a.btn_navAll").on("click.dotcom",function(m){var l=$(m.currentTarget);l.toggleClass("on");k.toggle();m.preventDefault()});if($.fn.changeAct===undefined){$.fn.changeAct=function(l){if(this.is("nav#gnb")){this.find("> ul > li").removeClass("on").eq(l).addClass("on");if(this.hasClass("swiper-container")){var m=this[0].swiper;m.slideTo(Math.max(l-1,0));if(k.length>0){k.find("ul > li").removeClass("on").eq(l).addClass("on")}}}}}}function h(){var m=$("#topBtn01");var j=$(".quickDimBox");if(m.length===0){return}var n=$(".newFoot");var k=n.height();var l=47+parseInt(m.css("bottom"));$(window).on("scroll.topbtn",function(q){$(window).trigger("scroll.dotcom");var p=WDDO.scrollYpos;var o=$(window).height()+p;if(p<=0||WDDO.browserHeight+p>n.offset().top+l){m.removeClass("on");j.removeClass("topPosi")}else{m.addClass("on");j.addClass("topPosi")}})}function f(){var k=$("div.pb_toggle");var j;k.each(function(){var l=$(this);if(typeof l.getInstance!=="undefined"&&l.getInstance()!==undefined){return}j=new WToggle();j.init({target:l,selector:"> .tabList > li > a",onTag:"li",onClass:"on",content:l,contentSelector:"> div.tabCont"})})}function e(){var j=$("a.pb_hrefpopup");j.on("click",function(m){var l=$(m.currentTarget);var k=$(this).attr("href");DOTCOM.openLoadPop({target:l,url:k,parent:$('body > div[data-role="page"]')});m.preventDefault()})}function a(){var k=$(".integ_search > .inputBox > input");var m=$(".integ_search > .inputBox");if(k.length===0||m.length===0){return}m.on("mousedown.dotcom","a",function(p){var o=$(p.currentTarget);k.val("").focus();p.preventDefault()});var n=new WToggle();n.init({target:$(".searchBox > ul.searchTab > li > a"),onTag:"li",content:$(".searchBox > ul.searchTab").nextAll("div.searchCont")});var j=new WToggle();j.init({target:$("ul.searEndTab > li > a"),onTag:"li"});var l=new WToggle();l.init({target:$(".categoryBox > ul.cateTab > li > a"),onTag:"li",onlyOpen:false,onChange:function(t){var p=t.idx;var r=$(".categoryBox > ul.cateTab");var o=r.find("> li");var s=r.nextAll("div");o.not(":eq("+p+")").removeClass("on");var q=(o.filter(".on").length>0);if(q){r.addClass("open");s.hide().eq(p).show()}else{r.removeClass("open");s.hide()}}})}function b(){$("#menuPanel .innerScroller").css("height",WDDO.browserHeight);$("#userPanel .innerScroller").css("height",WDDO.browserHeight)}});

	/*!
	 * @author : Jo Yun Ki (ddoeng@naver.com)
	 * @version : 2.0
	 * @since : 2015.11.09
	 *
	 * history
	 *
	 * 1.2   (2015.12.10) : setNext(), setPrev(), opts.onClass 추가 
	 * 1.2.1 (2015.12.11) : getOptions() 추가
	 * 1.3   (2016.04.18) : opts.onlyOpen = true 기본값 고정, otps.contentSelector 추가
	 * 2.0   (2016.05.16) : init()시 opts.selector 가 없어도 초기화 될수 있도록 수정
	 *
	 ********************************************************************************************
	 ***************************************** WToggle ******************************************
	 ********************************************************************************************
	 *
	 * var instance = new WToggle();
	 * instance.init(options);                   //초기화
	 *
	 * @param options    ::: 설정 Object 값
	 *
	 * options
	 *   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
	 *   selector:String = 'li > a'              //on() 두번째 인자의 셀렉터
	 *   onTag:String = 'li'                     //on 클래스를 적용 할 태그 셀렉션 String
	 *   onClass:String = 'on'                   //on 클래스 명
	 *   onlyOpen:Boolean = true                 //비 중복 활성화 유무
	 *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
	 *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
	 *   onChange:Function = fun(event)          //텝 변경 콜백함수
	 *   onChangeParams:Array = []               //텝 변경 콜백함수 인자
	 *   behavior:Boolean = false                //기본 비헤이비어 삭제 유무, 기본은 막음
	 *
	 * method
	 *   .setCloseAll()                          //모두 닫기
	 *   .setOpen(idx)                           //열기
	 *   .setCallback(change, param)             //콜백 설정
	 *   .setNext()                              //다음
	 *   .setPrev()                              //이전
	 *   .getOptions()                           //옵션객체 반환
	 */
	;var WToggle=(function(b){var a=function(r){var p,i,c,e=d(),o=function(s){c=b.extend(e,s);if(c.target.length>0&&c.target.data("scope")===undefined){if(c.target.data("scope")===undefined){c.target.data("scope",p)}h();q()}};function d(){return{target:b(b.fn),selector:"",onTag:"li",onClass:"on",onlyOpen:true,behavior:false,content:b(b.fn),contentSelector:"",onChange:undefined,onChangeParams:[]}}function h(){}function q(){if(c.selector===""){c.target.on("click.toggle",s)}else{c.target.on("click.toggle",c.selector,s)}function s(w){var v=b(w.currentTarget);l();i=j(c.content,c.contentSelector);var t=parseInt(v.data("toggle-idx"));var u=(c.onTag==="a")?v:v.closest(c.onTag);if(u.hasClass(c.onClass)){if(c.onlyOpen){}else{g(t);n(t)}}else{if(c.onlyOpen){g();n();k(t);f(t)}else{k(t);f(t)}}if(c.onChange!==undefined){c.onChange.apply(this,[{target:v,idx:t,content:i.eq(t),params:c.onChangeParams}])}c.target.trigger("change.toggle",[{target:v,idx:t,content:i.eq(t),params:c.onChangeParams}]);if(!c.behavior){w.preventDefault();w.stopPropagation()}}}function l(){j(c.target,c.selector).each(function(s){b(this).data("toggle-idx",s)})}function j(t,s){return(s!==""&&s!==undefined)?t.find(s):t}function k(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a")?u:u.closest(c.onTag);t.addClass(c.onClass)}function g(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a")?u:u.closest(c.onTag);t.removeClass(c.onClass)}function f(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.show()}function n(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.hide()}function m(s){return Math.max(Math.min(s,j(c.target,c.selector).length-1),0)}return{init:function(s){p=this;o(s)},setCloseAll:function(){g();n()},setOpen:function(s){k(s);f(s)},setCallback:function(t,s){c.onChange=t;if(s!==undefined){c.onChangeParams=s}},setNext:function(){var s=parseInt(j(c.target,c.selector).closest("."+c.onClass).data("toggle-idx"));var t=m(s+1);if(!isNaN(s)){j(c.target,c.selector).eq(t).trigger("click.toggle")}},setPrev:function(){var t=parseInt(j(c.target,c.selector).closest("."+c.onClass).data("toggle-idx"));var s=m(t-1);if(!isNaN(t)){j(c.target,c.selector).eq(s).trigger("click.toggle")}},getOptions:function(){return c}}};return a}(jQuery));if(WTab===undefined&&WToggle!==undefined){var WTab=WToggle}if(jQuery.fn.getInstance===undefined){jQuery.fn.getInstance=function(){return this.data("scope")}}jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(j,i,b,c,d){return jQuery.easing[jQuery.easing.def](j,i,b,c,d)},easeInQuad:function(j,i,b,c,d){return c*(i/=d)*i+b},easeOutQuad:function(j,i,b,c,d){return -c*(i/=d)*(i-2)+b},easeInOutQuad:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i+b}return -c/2*((--i)*(i-2)-1)+b},easeInCubic:function(j,i,b,c,d){return c*(i/=d)*i*i+b},easeOutCubic:function(j,i,b,c,d){return c*((i=i/d-1)*i*i+1)+b},easeInOutCubic:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i+b}return c/2*((i-=2)*i*i+2)+b},easeInQuart:function(j,i,b,c,d){return c*(i/=d)*i*i*i+b},easeOutQuart:function(j,i,b,c,d){return -c*((i=i/d-1)*i*i*i-1)+b},easeInOutQuart:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i+b}return -c/2*((i-=2)*i*i*i-2)+b},easeInQuint:function(j,i,b,c,d){return c*(i/=d)*i*i*i*i+b},easeOutQuint:function(j,i,b,c,d){return c*((i=i/d-1)*i*i*i*i+1)+b},easeInOutQuint:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i*i+b}return c/2*((i-=2)*i*i*i*i+2)+b},easeInSine:function(j,i,b,c,d){return -c*Math.cos(i/d*(Math.PI/2))+c+b},easeOutSine:function(j,i,b,c,d){return c*Math.sin(i/d*(Math.PI/2))+b},easeInOutSine:function(j,i,b,c,d){return -c/2*(Math.cos(Math.PI*i/d)-1)+b},easeInExpo:function(j,i,b,c,d){return(i==0)?b:c*Math.pow(2,10*(i/d-1))+b},easeOutExpo:function(j,i,b,c,d){return(i==d)?b+c:c*(-Math.pow(2,-10*i/d)+1)+b},easeInOutExpo:function(j,i,b,c,d){if(i==0){return b}if(i==d){return b+c}if((i/=d/2)<1){return c/2*Math.pow(2,10*(i-1))+b}return c/2*(-Math.pow(2,-10*--i)+2)+b},easeInCirc:function(j,i,b,c,d){return -c*(Math.sqrt(1-(i/=d)*i)-1)+b},easeOutCirc:function(j,i,b,c,d){return c*Math.sqrt(1-(i=i/d-1)*i)+b},easeInOutCirc:function(j,i,b,c,d){if((i/=d/2)<1){return -c/2*(Math.sqrt(1-i*i)-1)+b}return c/2*(Math.sqrt(1-(i-=2)*i)+1)+b},easeInElastic:function(o,m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p}if((m/=b)==1){return p+a}if(!c){c=b*0.3}if(n<Math.abs(a)){n=a;var d=c/4}else{var d=c/(2*Math.PI)*Math.asin(a/n)}return -(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p},easeOutElastic:function(o,m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p}if((m/=b)==1){return p+a}if(!c){c=b*0.3}if(n<Math.abs(a)){n=a;var d=c/4}else{var d=c/(2*Math.PI)*Math.asin(a/n)}return n*Math.pow(2,-10*m)*Math.sin((m*b-d)*(2*Math.PI)/c)+a+p},easeInOutElastic:function(o,m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p}if((m/=b/2)==2){return p+a}if(!c){c=b*(0.3*1.5)}if(n<Math.abs(a)){n=a;var d=c/4}else{var d=c/(2*Math.PI)*Math.asin(a/n)}if(m<1){return -0.5*(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p}return n*Math.pow(2,-10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c)*0.5+a+p},easeInBack:function(l,k,b,c,d,j){if(j==undefined){j=1.70158}return c*(k/=d)*k*((j+1)*k-j)+b},easeOutBack:function(l,k,b,c,d,j){if(j==undefined){j=1.70158}return c*((k=k/d-1)*k*((j+1)*k+j)+1)+b},easeInOutBack:function(l,k,b,c,d,j){if(j==undefined){j=1.70158}if((k/=d/2)<1){return c/2*(k*k*(((j*=(1.525))+1)*k-j))+b}return c/2*((k-=2)*k*(((j*=(1.525))+1)*k+j)+2)+b},easeInBounce:function(j,i,b,c,d){return c-jQuery.easing.easeOutBounce(j,d-i,0,c,d)+b},easeOutBounce:function(j,i,b,c,d){if((i/=d)<(1/2.75)){return c*(7.5625*i*i)+b}else{if(i<(2/2.75)){return c*(7.5625*(i-=(1.5/2.75))*i+0.75)+b}else{if(i<(2.5/2.75)){return c*(7.5625*(i-=(2.25/2.75))*i+0.9375)+b}else{return c*(7.5625*(i-=(2.625/2.75))*i+0.984375)+b}}}},easeInOutBounce:function(j,i,b,c,d){if(i<d/2){return jQuery.easing.easeInBounce(j,i*2,0,c,d)*0.5+b}return jQuery.easing.easeOutBounce(j,i*2-d,0,c,d)*0.5+c*0.5+b}});

	//WDDO ver 1.1.1
	!function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);

	/*!
	 * timer
	 * 
	 * var instance = new Timer(options);
	 * 
	 * @param options   ::: 옵션 오브젝트
	 * options {
	 *     loop : 반복 여부
	 *     interval : 반복 간격
	 *     callback : 반복 함수
	 * }
	 * 
	 * instance.setStart()                  - 시작
	 * instance.setStop()                   - 정지
	 */
	;var Timer=(function(){var a=function(d){var f=this,h={loop:true,interval:5000,callback:undefined,params:undefined},g=$.extend({},h,d),b;function i(){b=setInterval(c,g.interval)}function e(){if(b!==undefined){clearInterval(b)}}function c(){if(!g.loop){e()}if(g.callback!==undefined){g.callback(g.params)}}this.setStart=function(){e();i()};this.setStop=function(){e()}};return a}());

	/**
	* Swiper 템플릿
	*
	* @author : Jo Yun Ki (ddoeng@naver.com)
	* @version : 1.1
	* @since : 2016.11.11
	*
	* history
	*   1.0 (2016.11.11) : -
	*   1.1 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
	*   				   resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
	*   				   initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
	*
	*
	* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
	*/
	(function(b){if(b.SwiperTemplate!==undefined){return}var a=(function(d){var c=function(){var e,h;var k={};function g(p,o){var n=p.container;var m=n.find(".swiper-pagination > span").length;var l=n.find(".swiper-pagination .swiper-pagination-bullet-active").index();n.find(".swiper-pag-num").html("<span>"+(l+1)+"</span> / "+m);if(k.exChange!==undefined){k.exChange(p,o)}}function j(){if(h.length>0&&h.is(".swiper-container-horizontal")){e=h[0].swiper;if(e!==undefined){e.destroy(false,true)}}}function i(l,o){var n=new Image();n.src=o.src;if(n.height>n.width){var m=d(l);m.addClass("column");m.find("img").css("height","");var o=m.find("img");o.css("marginTop",-o.height()*0.5)}}function f(m){var l=m.container;var n=(d(window).width()/9)*16;l.find(".swiper-container .swiper-slide").css("height",n*0.32);l.find(".swiper-container .swiper-slide img").css("height",n*0.32)}return{initGallerySwiper:function(m,l){h=m;j();var n={viewport:false,pagination:h.find(".swiper-pagination"),loop:((h.find(".swiper-slide").length>1)?true:false),preloadImages:false,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(q,o,p){i(o,p)},onSlideChangeStart:function(o){g(o,"onSlideChangeStart")},onSliderMove:function(o){g(o,"onSliderMove")},onTransitionEnd:function(o){g(o,"onTransitionEnd")},onInit:function(o){g(o,"onInit");if(k.viewport){f(o)}}};if(h.find(".swiper-slide").length===1){h.find(".swiper-pagination").hide()}h.each(function(o){k=d.extend({},n,l);e=new Swiper(d(this),k)});h.find("a.big5_prev").on("click.city",function(q){var p=d(q.currentTarget);var o=p.closest(".swiper-container")[0].swiper;o.slidePrev();g(o);q.preventDefault()});h.find("a.big5_next").on("click.city",function(q){var p=d(q.currentTarget);var o=p.closest(".swiper-container")[0].swiper;o.slideNext();g(o);q.preventDefault()})},initFreeSwiper:function(m,l){h=m;j();var n={pagination:h.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true};h.each(function(o){k=d.extend({},n,l);e=new Swiper(d(this),k)})},resetSwiper:function(l){h=(l.hasClass("swiper-container-horizontal"))?l:l.find(".swiper-container-horizontal");h.each(function(){e=d(this)[0].swiper;if(e!==undefined){e.destroy(false,true);new Swiper(e.container,e.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);

	/**
	 * A jQuery plugin for sprite animation
	 *
	 * Version 1.0
	 * 2012-03-22
	 *
	 * Copyright (c) 2006 Luke Lutman (http://www.lukelutman.com)
	 * Dual licensed under the MIT and GPL licenses.
	 * http://www.opensource.org/licenses/mit-license.php
	 * http://www.opensource.org/licenses/gpl-license.php
	 *
	 * http://guny.kr
	 * http://ghophp.github.io/
	 */
	//;(function($){$.fn.sprite=function(options){var base=this,opts=$.extend(true,{},$.fn.sprite.defaults,options||{}),w=opts.cellSize[0],h=opts.cellSize[1],ys=opts.cells[0],xs=opts.cells[1],row=opts.initCell[0],col=opts.initCell[1],offx=opts.offset[0],offy=opts.offset[1],timer=null;this.next=function(){var last=false;if(opts.vertical===true){last=row+1>ys-1;row=!last?row+1:ys-1}else{last=col+1>xs-1;col=!last?col+1:xs-1}_setSprite(base,row,col,last)};this.prev=function(){var last=false;if(opts.vertical===true){last=row-1<0;row=!last?row-1:0}else{last=col-1<0;col=!last?col-1:0}_setSprite(base,row,col,last)};this.go=function(){if(timer)base.stop();if(!timer)timer=setInterval(this.next,opts.interval)};this.revert=function(){if(timer)base.stop();if(!timer)timer=setInterval(this.prev,opts.interval)};this.stop=function(){if(timer){clearTimeout(timer);timer=null}};this.cell=function(r,c){row=r;col=c;_setSprite(base,row,col,false)};this.row=function(r){if(r>ys-1)r=(opts.wrap)?0:ys-1;if(r<0)r=(opts.wrap)?ys-1:0;this.cell(r,0)};this.col=function(c){if(c>xs-1)c=(opts.wrap)?0:xs-1;if(c<0)c=(opts.wrap)?xs-1:0;this.cell(row,c)};this.offset=function(x,y){offx=x;offy=y;_setSprite(0,0,false)};return this.each(function(index,el){var $this=$(this);$this.css({'width':w,'height':h});if($this.css('display')=='inline')$this.css('display','inline-block');_setSprite(this,row,col,false,(opts.offsInitial?true:false))});function _setSprite(el,row,col,last,initial){if(last){opts.complete();if(!opts.wrap){base.stop();return}}initial=typeof initial!=='undefined'?initial:true;var x=(-1*((w*col)+(initial?0:offx))),y=(-1*((h*row)+(initial?0:offy)));$(el).css('background-position',x+'px '+y+'px')}};$.fn.sprite.defaults={cellSize:[0,0],cells:[1,1],initCell:[0,0],offset:[0,0],interval:50,offsInitial:false,vertical:false,wrap:true,complete:function(){}}})(jQuery);

	/*!
	 * @fileOverview TouchSwipe - jQuery Plugin
	 * @version 1.6.17
	 *
	 * @author Matt Bryson http://www.github.com/mattbryson
	 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
	 * @see http://labs.rampinteractive.co.uk/touchSwipe/
	 * @see http://plugins.jquery.com/project/touchSwipe
	 * @license
	 * Copyright (c) 2010-2015 Matt Bryson
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 *
	 */
	!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(!event.pointerType||"mouse"!=event.pointerType||0!=options.fallbackToMouseEvents){var ret,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null!==options.pinchThreshold?pinchDistance>=options.pinchThreshold:!0}function validateSwipeTime(){var result;return result=options.maxTimeThreshold?!(duration>=options.maxTimeThreshold):!0}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&DOUBLE_TAP_THRESHOLD>distance}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){return maximumsMap[direction]?maximumsMap[direction].distance:void 0}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return 1>pinchZoom?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return 0>angle&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return 45>=angle&&angle>=0?LEFT:360>=angle&&angle>=315?LEFT:angle>=135&&225>=angle?RIGHT:angle>45&&135>angle?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.17",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(plugin,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(plugin,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});

	//http://www.appelsiini.net/projects/viewport
	//(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);
	
	!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(require("jquery"),require("window")):"function"==typeof define&&define.amd?define("isInViewport",["jquery","window"],n):n(e.$,e.window)}(this,function(e,n){"use strict";function t(n){var t=this;if(1===arguments.length&&"function"==typeof n&&(n=[n]),!(n instanceof Array))throw new SyntaxError("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions");return n.forEach(function(n){"function"!=typeof n?(console.warn("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions"),console.warn("isInViewport: Ignoring non-function values in array and moving on")):[].slice.call(t).forEach(function(t){return n.call(e(t))})}),this}function o(n){var t=e("<div></div>").css({width:"100%"});n.append(t);var o=n.width()-t.width();return t.remove(),o}function r(t,i){var a=t.getBoundingClientRect(),u=a.top,c=a.bottom,f=a.left,l=a.right,d=e.extend({tolerance:0,viewport:n},i),s=!1,p=d.viewport.jquery?d.viewport:e(d.viewport);p.length||(console.warn("isInViewport: The viewport selector you have provided matches no element on page."),console.warn("isInViewport: Defaulting to viewport as window"),p=e(n));var w=p.height(),h=p.width(),v=p[0].toString();if(p[0]!==n&&"[object Window]"!==v&&"[object DOMWindow]"!==v){var g=p[0].getBoundingClientRect();u-=g.top,c-=g.top,f-=g.left,l-=g.left,r.scrollBarWidth=r.scrollBarWidth||o(p),h-=r.scrollBarWidth}return d.tolerance=~~Math.round(parseFloat(d.tolerance)),d.tolerance<0&&(d.tolerance=w+d.tolerance),l<=0||f>=h?s:s=d.tolerance?u<=d.tolerance&&c>=d.tolerance:c>0&&u<=w}function i(n){if(n){var t=n.split(",");return 1===t.length&&isNaN(t[0])&&(t[1]=t[0],t[0]=void 0),{tolerance:t[0]?t[0].trim():void 0,viewport:t[1]?e(t[1].trim()):void 0}}return{}}e="default"in e?e.default:e,n="default"in n?n.default:n,/**
	 * @author  Mudit Ameta
	 * @license https://github.com/zeusdeux/isInViewport/blob/master/license.md MIT
	 */
	e.extend(e.expr[":"],{"in-viewport":e.expr.createPseudo?e.expr.createPseudo(function(e){return function(n){return r(n,i(e))}}):function(e,n,t){return r(e,i(t[3]))}}),e.fn.isInViewport=function(e){return this.filter(function(n,t){return r(t,e)})},e.fn.run=t});
	//# sourceMappingURL=isInViewport.min.js.map


})(jQuery);